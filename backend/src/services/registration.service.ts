import prisma from "../lib/prisma";
import { AppError } from "../errors/app.error";
import { sendRegistrationConfirmation } from "./email.service";

export const createRegistration = async (data: {
    name: string;
    email: string;
    phone?: string;
    attendanceAt: string;
    productIds: number[];
    serviceIds: number[];
}) => {
    const {
        name,
        email,
        phone,
        attendanceAt,
        productIds,
        serviceIds
    } = data;

    const products = await prisma.product.findMany({
        where: {
            id: {
                in: productIds
            },
            active: true
        }
    });

    const services = await prisma.service.findMany({
        where: {
            id: {
                in: serviceIds
            },
            active: true
        }
    });

    if (products.length !== productIds.length) {
        throw new AppError(
            400,
            "Uno o más productos seleccionados no existen o están inactivos"
        );
    }

    if (services.length !== serviceIds.length) {
        throw new AppError(
            400,
            "Uno o más servicios seleccionados no existen o están inactivos"
        );
    }

    const productSubtotal = products.reduce(
        (total, product) => total + Number(product.price),
        0
    );

    const serviceSubtotal = services.reduce(
        (total, service) => total + Number(service.price),
        0
    );

    let productDiscountPercent = 0;
    let serviceDiscountPercent = 0;

    // Descuento de productos
    if (products.length >= 5) {
        productDiscountPercent = 5;
    } else if (products.length >= 3) {
        productDiscountPercent = 3;
    }

    // Descuento de servicios
    if (services.length >= 2 && serviceSubtotal > 1500) {
        serviceDiscountPercent = 5;
    } else if (services.length >= 2) {
        serviceDiscountPercent = 3;
    }

    const productDiscount = Number(
        ((productSubtotal * productDiscountPercent) / 100).toFixed(2)
    );

    const serviceDiscount = Number(
        ((serviceSubtotal * serviceDiscountPercent) / 100).toFixed(2)
    );

    const productTotal = Number(
        (productSubtotal - productDiscount).toFixed(2)
    );

    const serviceTotal = Number(
        (serviceSubtotal - serviceDiscount).toFixed(2)
    );

    const grandTotal = Number(
        (productTotal + serviceTotal).toFixed(2)
    );

    const registrationId = await prisma.$transaction(async (tx) => {
        const customer = await tx.customer.upsert({
            where: {
                email
            },
            update: {
                name,
                phone
            },
            create: {
                name,
                email,
                phone
            }
        });

        const registration = await tx.registration.create({
            data: {
                customerId: customer.id,
                attendanceAt: new Date(attendanceAt),

                productSubtotal,
                serviceSubtotal,

                productDiscountPercent,
                serviceDiscountPercent,

                productTotal,
                serviceTotal,
                grandTotal,

                products: {
                    create: products.map((product) => ({
                        productId: product.id,
                        unitPrice: product.price
                    }))
                },

                services: {
                    create: services.map((service) => ({
                        serviceId: service.id,
                        unitPrice: service.price
                    }))
                }
            }
        });

        return registration.id;
    });

    const registration = await prisma.registration.findUnique({
        where: {
            id: registrationId
        },
        include: {
            customer: true,

            products: {
                include: {
                    product: true
                }
            },

            services: {
                include: {
                    service: true
                }
            }
        }
    });

    if (!registration) {
        throw new AppError(
            500,
            "No fue posible recuperar el registro creado"
        );
    }

    // El registro ya fue almacenado correctamente.
    // Un fallo en el envío del correo no debe deshacer la inscripción.
    try {
        await sendRegistrationConfirmation({
            email: registration.customer.email,
            name: registration.customer.name,
            attendanceAt: registration.attendanceAt,

            products: registration.products.map((item) => ({
                name: item.product.name,
                price: Number(item.unitPrice)
            })),

            services: registration.services.map((item) => ({
                name: item.service.name,
                price: Number(item.unitPrice)
            })),

            productSubtotal,
            productDiscount,

            serviceSubtotal,
            serviceDiscount,

            grandTotal
        });

        console.log(
            `Correo de confirmación enviado a ${registration.customer.email}`
        );
        
    } catch (error) {
        console.error(
            `No fue posible enviar el correo de confirmación a ${registration.customer.email}`,
            error
        );
    }

    return registration;

};
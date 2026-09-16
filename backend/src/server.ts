import "dotenv/config";
import express from "express";
import cors from "cors";
//import prisma from "./lib/prisma";


import productRoutes from "./routes/product.routes";
import serviceRoutes from "./routes/service.routes";
import registrationRoutes from "./routes/registration.routes";

import { errorHandler } from "./middlewares/error.middleware";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
    res.json({
        message: "API funcionando correctamente"
    });
});

app.use("/api/products", productRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/registrations", registrationRoutes);

// Ruta no encontrada
app.use((_req, res) => {
  return res.status(404).json({
    message: "Ruta no encontrada"
  });
});

// Middleware global de errores
app.use(errorHandler);

// app.get("/api/products", async (_req, res) => {
//     const products = await prisma.product.findMany({
//         where: {
//             active: true
//         }
//     });

//     res.json(products);
// });

// app.get("/api/services", async (_req, res) => {
//     const services = await prisma.service.findMany({
//         where: {
//             active: true
//         }
//     });

//     res.json(services);
// });

// app.post("/api/registrations", async (req, res) => {
//     const {
//         name,
//         email,
//         phone,
//         attendanceAt,
//         productIds,
//         serviceIds
//     } = req.body;

//     const products = await prisma.product.findMany({
//         where: {
//             id: {
//                 in: productIds
//             },
//             active: true
//         }
//     });

//     const services = await prisma.service.findMany({
//         where: {
//             id: {
//                 in: serviceIds
//             },
//             active: true
//         }
//     });

//     if (products.length !== productIds.length) {
//         return res.status(400).json({
//             message: "Uno o más productos seleccionados no existen o están inactivos"
//         });
//     }

//     if (services.length !== serviceIds.length) {
//         return res.status(400).json({
//             message: "Uno o más servicios seleccionados no existen o están inactivos"
//         });
//     }

//     const productSubtotal = products.reduce(
//         (total, product) => total + Number(product.price),
//         0
//     );

//     const serviceSubtotal = services.reduce(
//         (total, service) => total + Number(service.price),
//         0
//     );

//     let productDiscountPercent = 0;
//     let serviceDiscountPercent = 0;

//     // Productos
//     if (products.length >= 5) {
//         productDiscountPercent = 5;
//     } else if (products.length >= 3) {
//         productDiscountPercent = 3;
//     }

//     // Servicios
//     if (services.length >= 2 && serviceSubtotal > 1500) {
//         serviceDiscountPercent = 5;
//     } else if (services.length >= 2) {
//         serviceDiscountPercent = 3;
//     }

//     const productDiscount = Number(
//         ((productSubtotal * productDiscountPercent) / 100).toFixed(2)
//     );

//     const serviceDiscount = Number(
//         ((serviceSubtotal * serviceDiscountPercent) / 100).toFixed(2)
//     );

//     const productTotal = Number(
//         (productSubtotal - productDiscount).toFixed(2)
//     );

//     const serviceTotal = Number(
//         (serviceSubtotal - serviceDiscount).toFixed(2)
//     );

//     const grandTotal = Number(
//         (productTotal + serviceTotal).toFixed(2)
//     );

//     const registration = await prisma.$transaction(async (tx) => {

//         const customer = await tx.customer.upsert({
//             where: {
//                 email
//             },
//             update: {
//                 name,
//                 phone
//             },
//             create: {
//                 name,
//                 email,
//                 phone
//             }
//         });

//         const newRegistration = await tx.registration.create({
//             data: {
//                 customerId: customer.id,
//                 attendanceAt: new Date(attendanceAt),

//                 productSubtotal,
//                 serviceSubtotal,

//                 productDiscountPercent,
//                 serviceDiscountPercent,

//                 productTotal,
//                 serviceTotal,
//                 grandTotal,

//                 products: {
//                     create: products.map((product) => ({
//                         productId: product.id,
//                         unitPrice: product.price
//                     }))
//                 },

//                 services: {
//                     create: services.map((service) => ({
//                         serviceId: service.id,
//                         unitPrice: service.price
//                     }))
//                 }
//             },
//             include: {
//                 customer: true,

//                 products: {
//                     include: {
//                         product: true
//                     }
//                 },

//                 services: {
//                     include: {
//                         service: true
//                     }
//                 }
//             }
//         });

//         return newRegistration;
//     });

//     return res.status(201).json(registration);
// });

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
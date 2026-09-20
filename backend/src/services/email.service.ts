import nodemailer from 'nodemailer';

interface RegistrationEmailData {
    email: string;
    name: string;
    attendanceAt: Date | string;

    products: {
        name: string;
        price: number;
    }[];

    services: {
        name: string;
        price: number;
    }[];

    productSubtotal: number;
    productDiscount: number;
    serviceSubtotal: number;
    serviceDiscount: number;
    grandTotal: number;
}

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

export async function sendRegistrationConfirmation(
    data: RegistrationEmailData
): Promise<void> {

    const productsHtml = data.products.length > 0
        ? data.products
            .map(
                product => `
                    <tr>
                        <td style="padding: 6px 0;">${product.name}</td>
                        <td style="padding: 6px 0; text-align: right;">
                            Q${product.price.toFixed(2)}
                        </td>
                    </tr>
                `
            )
            .join('')
        : `
            <tr>
                <td colspan="2">No se seleccionaron productos.</td>
            </tr>
        `;

    const servicesHtml = data.services.length > 0
        ? data.services
            .map(
                service => `
                    <tr>
                        <td style="padding: 6px 0;">${service.name}</td>
                        <td style="padding: 6px 0; text-align: right;">
                            Q${service.price.toFixed(2)}
                        </td>
                    </tr>
                `
            )
            .join('')
        : `
            <tr>
                <td colspan="2">No se seleccionaron servicios.</td>
            </tr>
        `;

    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: data.email,
        subject: 'Confirmación de asistencia - Disagro',
        html: `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
            </head>

            <body style="
                margin: 0;
                padding: 20px;
                font-family: Arial, Helvetica, sans-serif;
                background-color: #f5f5f5;
                color: #333;
            ">

                <div style="
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: white;
                    padding: 30px;
                    border-radius: 10px;
                ">

                    <h1 style="margin-bottom: 5px;">
                        Disagro
                    </h1>

                    <p style="margin-top: 0;">
                        Feria de Promociones
                    </p>

                    <hr>

                    <h2>
                        ¡Asistencia confirmada!
                    </h2>

                    <p>
                        Gracias <strong>${data.name}</strong> por confirmar tu asistencia.
                    </p>

                    <p>
                        <strong>Fecha de asistencia:</strong>
                        ${new Date(data.attendanceAt).toLocaleDateString('es-GT')}
                    </p>

                    <h3>Servicios seleccionados</h3>

                    <table style="width: 100%;">
                        ${servicesHtml}

                        <tr>
                            <td><strong>Subtotal</strong></td>
                            <td style="text-align: right;">
                                Q${data.serviceSubtotal.toFixed(2)}
                            </td>
                        </tr>

                        <tr>
                            <td><strong>Descuento</strong></td>
                            <td style="text-align: right;">
                                ${data.serviceDiscount > 0
                                    ? `-Q${data.serviceDiscount.toFixed(2)}`
                                    : 'Q0.00'
                                }
                            </td>
                        </tr>
                    </table>

                    <h3>Productos seleccionados</h3>

                    <table style="width: 100%;">
                        ${productsHtml}

                        <tr>
                            <td><strong>Subtotal</strong></td>
                            <td style="text-align: right;">
                                Q${data.productSubtotal.toFixed(2)}
                            </td>
                        </tr>

                        <tr>
                            <td><strong>Descuento</strong></td>
                            <td style="text-align: right;">
                                ${data.productDiscount > 0
                                    ? `-Q${data.productDiscount.toFixed(2)}`
                                    : 'Q0.00'
                                }
                            </td>
                        </tr>
                    </table>

                    <hr>

                    <h2 style="text-align: right;">
                        Total: Q${data.grandTotal.toFixed(2)}
                    </h2>

                    <p style="
                        margin-top: 30px;
                        font-size: 12px;
                        color: #666;
                    ">
                        Este correo fue generado automáticamente.
                    </p>

                </div>

            </body>
            </html>
        `,
    });
}
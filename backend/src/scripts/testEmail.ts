import 'dotenv/config';
import { sendRegistrationConfirmation } from '../services/email.service.js';

async function main() {
    await sendRegistrationConfirmation({
        email: 'v.sdb.59@gmail.com',
        name: 'Victor Alfonso López Morales',
        attendanceAt: new Date(),

        services: [
            {
                name: 'Análisis de Suelo',
                price: 850,
            },
            {
                name: 'Asesoría Técnica',
                price: 750,
            },
        ],

        products: [
            {
                name: 'Fertilizante Premium',
                price: 350,
            },
        ],

        serviceSubtotal: 1600,
        serviceDiscount: 80,

        productSubtotal: 350,
        productDiscount: 0,

        grandTotal: 1870,
    });

    console.log('Correo enviado correctamente');
}

main().catch((error) => {
    console.error('Error enviando correo:');
    console.error(error);
    process.exit(1);
});
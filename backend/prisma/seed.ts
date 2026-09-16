import prisma from "../src/lib/prisma";

async function main() {
  const productCount = await prisma.product.count();

  if (productCount === 0) {
    await prisma.product.createMany({
      data: [
        {
          name: "Fertilizante Premium",
          description: "Fertilizante para mejorar el rendimiento del cultivo",
          price: 350.00
        },
        {
          name: "Semillas Mejoradas",
          description: "Semillas seleccionadas de alto rendimiento",
          price: 450.00
        },
        {
          name: "Control de Plagas",
          description: "Producto para protección y control de plagas",
          price: 275.00
        },
        {
          name: "Fertilizante Foliar",
          description: "Fertilizante de aplicación foliar",
          price: 225.00
        },
        {
          name: "Bioestimulante",
          description: "Producto para estimular el desarrollo del cultivo",
          price: 300.00
        }
      ]
    });
  }

  const serviceCount = await prisma.service.count();

  if (serviceCount === 0) {
    await prisma.service.createMany({
      data: [
        {
          name: "Análisis de Suelo",
          description: "Evaluación de las condiciones y nutrientes del suelo",
          price: 850.00
        },
        {
          name: "Asesoría Técnica",
          description: "Asesoría especializada para manejo de cultivos",
          price: 750.00
        },
        {
          name: "Agricultura de Precisión",
          description: "Servicio de análisis y optimización del cultivo",
          price: 1200.00
        }
      ]
    });
  }

  console.log("Datos iniciales creados correctamente");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
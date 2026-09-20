import prisma from "../src/lib/prisma";

async function main() {

  const products = [
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
  ];

  for (const product of products) {

    const existingProduct = await prisma.product.findFirst({
      where: {
        name: product.name
      }
    });

    if (!existingProduct) {

      await prisma.product.create({
        data: product
      });

      console.log(`Producto creado: ${product.name}`);

    } else {

      console.log(`Producto existente: ${product.name}`);

    }

  }

  
  const services = [
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
    },
    {
      name: "Monitoreo de Cultivo",
      description: "Seguimiento básico del estado y desarrollo del cultivo",
      price: 500.00
    }
  ];

  for (const service of services) {

    const existingService = await prisma.service.findFirst({
      where: {
        name: service.name
      }
    });

    if (!existingService) {

      await prisma.service.create({
        data: service
      });

      console.log(`Servicio creado: ${service.name}`);

    } else {

      console.log(`Servicio existente: ${service.name}`);

    }

  }

  console.log("Seed ejecutado correctamente");

}

main()
  .catch((error) => {
    console.error("Error ejecutando seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
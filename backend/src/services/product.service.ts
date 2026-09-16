import prisma from "../lib/prisma";

export const getActiveProducts = async () => {
  return prisma.product.findMany({
    where: {
      active: true
    }
  });
};
import prisma from "../lib/prisma";

export const getActiveServices = async () => {
  return prisma.service.findMany({
    where: {
      active: true
    }
  });
};
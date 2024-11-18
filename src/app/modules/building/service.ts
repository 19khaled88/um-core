import { Building, Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createBuilding = async (payload: Building): Promise<Building> => {
  const result = await prisma.building.create({ data: payload });
  return result;
};


export const buildingService = {
    createBuilding
}

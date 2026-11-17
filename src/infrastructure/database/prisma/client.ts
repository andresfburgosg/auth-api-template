import dotenv from "dotenv";
import { PrismaClient } from "../../../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import logger from "./../../../lib/logger.js";

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma = new PrismaClient({ adapter });

export async function connectDatabase(): Promise<void> {
  await prisma.$connect();
  logger.info("Database connected");
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  logger.info("Database disconnected");
}

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

import dbConfig from "./common/config/db.config";

const adapter = new PrismaPg({ connectionString: dbConfig.db_url });

export const prisma = new PrismaClient({ adapter });

export const connectDB = async () => {
  await prisma.$connect();
  console.log("🗄️  Database connected");
};

export const disconnectDB = async () => {
  await prisma.$disconnect();
  console.log("🗄️  Database disconnected");
};

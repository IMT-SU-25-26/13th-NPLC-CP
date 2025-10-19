import path from "node:path";
import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({ path: ".env" });

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),

  migrations: {
    path: path.join("prisma", "migrations"),
    seed: "tsx prisma/seed.ts",
  },
});

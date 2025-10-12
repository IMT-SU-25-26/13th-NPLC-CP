import path from "node:path";
import { defineConfig } from "prisma/config";

require("dotenv").config({ path: ".env" });

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),

  migrations: {
    path: path.join("prisma", "migrations"),
    seed: "tsx prisma/seed.ts",
  },
});

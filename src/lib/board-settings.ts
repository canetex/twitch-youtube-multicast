import { nanoid } from "nanoid";

import { prisma } from "@/lib/prisma";

export async function ensureBoardSettings() {
  return prisma.boardSettings.upsert({
    where: { id: "default" },
    create: { id: "default", shareSlug: nanoid(12) },
    update: {},
  });
}

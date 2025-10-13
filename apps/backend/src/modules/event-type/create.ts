import type { PrismaClient } from "../../../generated/prisma";

interface CreateEventTypeData {
  title: string;
  duration: number;
  slug: string;
  userId: string;
}

interface ICreateEventTypeProp {
  prisma: PrismaClient;
  data: CreateEventTypeData;
}

export async function createEventType({ prisma, data }: ICreateEventTypeProp) {
  const { duration, title, userId, slug } = data;
  return await prisma.eventType.create({
    data: {
      title,
      duration,
      slug,
      userId,
    },
  });
}

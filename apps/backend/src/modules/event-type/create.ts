import type { PrismaClient } from "../../../generated/prisma";

interface CreateEventTypeData {
  title: string;
  duration: number;
  userId: string;
}

interface ICreateEventTypeProp {
  prisma: PrismaClient;
  data: CreateEventTypeData;
}

export async function createEventType({ prisma, data }: ICreateEventTypeProp) {
  const { duration, title, userId } = data;
  return await prisma.eventType.create({
    data: {
      title,
      duration,
      userId,
    },
  });
}

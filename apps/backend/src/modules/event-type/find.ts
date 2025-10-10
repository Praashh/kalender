import type { PrismaClient } from "../../../generated/prisma";


export async function findEventType({prisma, eventTypeId}: {prisma: PrismaClient, eventTypeId: string}) {
    return await prisma.eventType.findUniqueOrThrow({
      where:{
        id: eventTypeId
      }
    })
  }
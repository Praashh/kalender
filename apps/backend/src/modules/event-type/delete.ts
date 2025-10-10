import { PrismaClient } from "../../../generated/prisma";

export async function deleteEventType({prisma, eventTypeId}: {prisma: PrismaClient, eventTypeId: string}){
    return await prisma.eventType.delete({
        where: {
            id: eventTypeId
        }
    })
}
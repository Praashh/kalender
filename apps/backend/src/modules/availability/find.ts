import { PrismaClient } from "../../../generated/prisma";


export async function findAvailability({prisma, availabilityId}: {prisma: PrismaClient, availabilityId: string}){
    return await prisma.availability.findUniqueOrThrow({
        where:{
            id: availabilityId
        }
    })
}
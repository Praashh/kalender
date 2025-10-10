import { PrismaClient } from "../../../generated/prisma";


export async function deleteAvailability({availabilityId, prisma}: {prisma: PrismaClient, availabilityId: string}){
    return await prisma.availability.delete({
        where:{
            id:availabilityId
        }
    })
}
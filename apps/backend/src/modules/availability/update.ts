import { PrismaClient } from "../../../generated/prisma";

interface IUpdateAvailabilityData {
    startTime: string;
    endTime: string;
}

interface IUpdateAvailabilityProp {
    prisma: PrismaClient;
    availabilityId: string;
    data: IUpdateAvailabilityData;
}


export async function updateAvailability({prisma, data, availabilityId}: IUpdateAvailabilityProp){
    return await prisma.availability.update({
        where:{
            id: availabilityId
        },
        data:{
            ...data
        }
    })
}
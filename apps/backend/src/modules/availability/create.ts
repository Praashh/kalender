
import { PrismaClient } from "../../../generated/prisma";

interface ICreateAvailabilityData {
    days: Array<number>;
    userId: string;
    eventTypeId?: string;
    name?: string;
    startTime: string;
    endTime: string;
  }

  interface ICreateProp {
    prisma: PrismaClient;
    data: ICreateAvailabilityData;
  }

export async function createAvailability({prisma,data}:ICreateProp){
    const {
        days,
        endTime,
        eventTypeId,
        startTime,
        name,
        userId
    } = data;

    if(new Date(startTime) > new Date(endTime)){
        throw new Error("ERROR: Invalid availability dates");
    }
    return await prisma.availability.create({
        data:{
            days,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            name
        }
    })
}
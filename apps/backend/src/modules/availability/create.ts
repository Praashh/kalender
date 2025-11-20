
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

  export async function createAvailability({ prisma, data }: ICreateProp) {
    const { days, endTime, startTime, name, userId } = data;
  
    if (new Date(startTime) > new Date(endTime)) {
      throw new Error("ERROR: Invalid availability dates");
    }
  
    // Find or create schedule
    let schedule = await prisma.schedule.findFirst({
      where: { userId },
    });
  
    if (!schedule) {
      schedule = await prisma.schedule.create({
        data: {
          userId,
          name: `${name}-schedule`, // give it a name
          availabilities: {
            create: {
              days,
              endTime: new Date(endTime),
              startTime: new Date(startTime),
              name,
            },
          },
        },
      });
    } else {
      // Add new availability to existing schedule
      await prisma.availability.create({
        data: {
          days,
          endTime: new Date(endTime),
          startTime: new Date(startTime),
          name,
          scheduleId: schedule.id,
        },
      });
    }
  
    return schedule;
  }
  
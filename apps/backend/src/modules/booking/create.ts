import { PrismaClient } from "../../../generated/prisma";
import { HttpResponse } from "../../utils/response/success";

interface ICreateBookingData {
  slug: string;
  hostId: string;
  guestId?: string;
  guestEmail: string;
  startTime: string;
  guestName: string;
  additionalNote?: string;
}
interface ICreateBookingProp {
  prisma: PrismaClient;
  data: ICreateBookingData;
}
export async function createBooking({ prisma, data }: ICreateBookingProp) {
  const { slug, guestEmail, hostId, startTime, guestId, guestName, additionalNote } = data;
  // Find event type by slug
  const eventType = await prisma.eventType.findFirst({
    where:{
      slug,
      userId: hostId
    }
  })

  if(!eventType){
    return new HttpResponse(404, "EVENT_TYPE_NOT_FOUND").toResponse();
  }
  const duration = eventType.duration;
  const endTime = new Date(new Date(startTime).getTime() + duration * 60000).toISOString();
  const eventTypeId = eventType.id;
  
  if (new Date(endTime) < new Date(startTime)) {
    return new HttpResponse(401, "INVALID_DATES");
  }

  try {
    const isUserOccupied = await prisma.user.findFirst({
      where:{
        id: hostId,
        guestBookings:{
          some:{
            // if a guest wants to book in between an already booked slot
            OR:[
              {
                startTime: {
                  lte: new Date(startTime)
                },
                endTime: {
                  gt: new Date(startTime)
                }
              },
              {
                startTime: {
                  lt: new Date(endTime)
                },
                endTime: {
                  gte: new Date(endTime)
                }
              },
              {
                startTime: {
                  gte: new Date(startTime)
                },
                endTime: {
                  lte: new Date(endTime)
                }
              }
            ]
          }
        }
      }
    });

    if(isUserOccupied){
      return new HttpResponse(409, "USER_OCCUPIED");
    }

    const booking =  await prisma.booking.create({
      data: {
        eventTypeId,
        guestName,
        additionalNote,
        hostId,
        guestId,
        guestEmail,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: "PENDING",
      },
    });
    
    return new HttpResponse(201, "BOOKING_CREATED", booking).toResponse();
  } catch (error) {
    return new HttpResponse(500, "INTERNAL_SERVER_ERROR", error).toResponse();
  }
  
}

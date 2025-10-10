import { PrismaClient } from "../../../generated/prisma";
import { HttpResponse } from "../../utils/response/success";

interface ICreateBookingData {
  eventTypeId: string;
  hostId: string;
  guestId?: string;
  guestEmail: string;
  startTime: string;
  endTime: string;
}
interface ICreateBookingProp {
  prisma: PrismaClient;
  data: ICreateBookingData;
}
export async function createBooking({ prisma, data }: ICreateBookingProp) {
  const { endTime, eventTypeId, guestEmail, hostId, startTime, guestId } = data;

  
  if (new Date(endTime) < new Date(startTime)) {
    return new HttpResponse(401, "INVALID_DATES");
  }

  try {
    const booking =  await prisma.booking.create({
      data: {
        eventTypeId,
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

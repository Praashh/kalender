import { PrismaClient } from "../../../generated/prisma";
import { HttpResponse } from "../../utils/response/success";

interface IUpdateBookingData {
    startTime: string;
    endTime: string;
}

interface IUpdateBookingProp {
    prisma: PrismaClient;
    bookingId: string;
    userId: string | null,
    data: IUpdateBookingData;
}


export async function updateBooking({prisma, data, bookingId, userId}:IUpdateBookingProp){
    if(!userId){
        throw new HttpResponse(400, "BAD_REQUEST")
    }

    const isBookingExists = await prisma.booking.findUnique({
        where:{
            id: bookingId,
            hostId: userId
        }
    })
    if(!isBookingExists){
        return new HttpResponse(404, "BOOKING_NOT_FOUND").toResponse();
    }

    
    try {
        const booking =  await prisma.booking.update({
            where: {
                id: bookingId
            },
            data: {
                ...data
            }
        });
        
        return new HttpResponse(200, "BOOKING_UPDATED", booking).toResponse();
    } catch (error) {
        return new HttpResponse(500, "INTERNAL_SERVER_ERROR").toResponse();
    }
    
}
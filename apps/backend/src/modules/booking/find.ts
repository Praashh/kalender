import { PrismaClient } from "../../../generated/prisma";
import { HttpResponse } from "../../utils/response/success";

export async function findBooking ({prisma, bookingId, userId}: {prisma: PrismaClient, bookingId: string, userId: string | null}) {
    if(!userId){
        return new HttpResponse(400, "BAD_REQUEST").toResponse()
    }
    try {
        const booking = await prisma.booking.findUnique({
            where:{
                id: bookingId,
                hostId: userId
            }
        });
        if(!booking){
            return new HttpResponse(404, "BOOKING_NOT_FOUND").toResponse();
        }

        return new HttpResponse(200, "BOOKING_FOUND", booking).toResponse();
    } catch (error) {
        return  new HttpResponse(500, "INTERNAL_SERVER_ERROR").toResponse()
    }
}
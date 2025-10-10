import { PrismaClient } from "../../../generated/prisma";
import { HttpResponse } from "../../utils/response/success";

export async function findAllBooking ({prisma, userId}: {prisma: PrismaClient, userId: string | null}) {
    if(!userId){
        return new HttpResponse(400, "BAD_REQUEST").toResponse()
    }
    try {
        const bookings = await prisma.user.findMany({
            where:{
                id: userId,
            },
            select:{
                id: true,
                name: true,
                email: true,
                hostedBookings: true
            }
        });
        if(!bookings){
            return new HttpResponse(404, "BOOKING_NOT_FOUND").toResponse();
        }

        return new HttpResponse(200, "BOOKING_FOUND", bookings).toResponse();
    } catch (error) {
        return  new HttpResponse(500, "INTERNAL_SERVER_ERROR").toResponse()
    }
}
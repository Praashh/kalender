import { PrismaClient } from "../../../generated/prisma";
import { HttpResponse } from "../../utils/response/success";


export async function deleteBooking({ prisma, bookingId, userId }: { prisma: PrismaClient, bookingId: string, userId: string | null }) {
    if (!userId) {
        return new HttpResponse(400, "BAD_REQUEST").toResponse();
    }

    const isBookingExists = await prisma.booking.findUnique({
        where: {
            id: bookingId,
            hostId: userId
        }
    });

    if (!isBookingExists) {
        return new HttpResponse(404, "BOOKING_NOT_FOUND").toResponse();
    }

    try {
        const booking = await prisma.booking.delete({
            where: {
                id: bookingId
            }
        })

        return new HttpResponse(200, "BOOKING_DEELETED", booking).toResponse();
    } catch (error) {
        return new HttpResponse(500, "INTERNAL_SERVER_ERROR").toResponse();
    }

}
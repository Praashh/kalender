import { Elysia } from "elysia";
import { authMiddleware } from "../middleware/auth";
import { bookingModel } from "./schema";
import { prisma } from "../db";
import {
  cancelBooking,
  confirmBooking,
  createBooking,
  deleteBooking,
  findAllBooking,
  findBooking,
  updateBooking,
} from "../modules/booking";
import { HttpResponse } from "../utils/response/success";

const subRouter = new Elysia({ prefix: "/api/booking" })
  .use(bookingModel)
  .use(authMiddleware)
  .post(
    "/create",
    async (ctx) => {
      console.log("booking Body", ctx.body);
      if (ctx.user?.id !== ctx.body.hostId) {
        return new HttpResponse(400, "BAD_REQUEST").toResponse();
      }
      return await createBooking({ prisma, data: ctx.body });
    },
    { body: "booking.create" }
  )
  .get("/:id", async ({ params, user }) => {
    if (!user) {
      return new HttpResponse(400, "BAD_REQUEST");
    }
    return await findBooking({ prisma, bookingId: params.id, userId: user.id });

  }).get("/getAll/:id", async ({ params, user }) => {
    if (!user) {
      return new HttpResponse(400, "BAD_REQUEST");
    }
    if (user.id !== params.id) {
      return new HttpResponse(400, "BAD_REQUEST").toResponse();
    }
    return await findAllBooking({ prisma, userId: params.id })
  })
  .put(
    "/update/:id",
    async ({ params, body, user }) => {
      if (!user) {
        return new HttpResponse(400, "BAD_REQUEST");
      }
      return await updateBooking({ prisma, data: { ...body }, bookingId: params.id, userId: user.id });
    },
    { body: "booking.update" }
  )
  .delete("/delete/:id", async ({ params, user }) => {
    if (!user) {
      return new HttpResponse(400, "BAD_REQUEST");
    }
    return await deleteBooking({ prisma, bookingId: params.id, userId: user.id });
  })
  .post("/confirm/:id", async ({ params, user }) => {
    if (!user) {
      return new HttpResponse(400, "BAD_REQUEST");
    }
    return await confirmBooking({ prisma, bookingId: params.id, userId: user.id });
  })
  .post("/cancel/:id", async ({ params, user }) => {
    if (!user) {
      return new HttpResponse(400, "BAD_REQUEST");
    }
    return await cancelBooking({ prisma, bookingId: params.id, userId: user.id });

  });

export default subRouter;

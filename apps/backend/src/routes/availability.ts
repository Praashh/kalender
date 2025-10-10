import { Elysia } from "elysia";
import { authMiddleware } from "../middleware/auth";
import { prisma } from "../db";
import {
  createAvailability,
  deleteAvailability,
  findAvailability,
  updateAvailability,
} from "../modules/availability";
import { availabilityModel } from "./schema";

const subRouter = new Elysia({ prefix: "/api/availability" })
  .use(availabilityModel)
  .use(authMiddleware)
  .post(
    "/create",
    async (ctx) => {
      return createAvailability({ prisma, data: ctx.body });
    },
    { body: "availability.create" }
  )
  .get("/:id", async ({ params }) => {
    return findAvailability({ prisma, availabilityId: params.id });
  })
  .get("/getAll/:id", async ({ params }) => {
    const availabilities= await prisma.availability.findMany({
      where: {
        userId: params.id,
      },
    });
    return {availabilities}
  })
  .put(
    "/update/:id",
    ({ params, body }) => {
      return updateAvailability({
        prisma,
        data: { ...body },
        availabilityId: params.id,
      });
    },
    { body: "availability.update" }
  )
  .delete("/delete/:id", ({ params }) => {
    return deleteAvailability({ prisma, availabilityId: params.id });
  });

export default subRouter;

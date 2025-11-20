import { Elysia } from "elysia";
import { authMiddleware } from "../middleware/auth";
import { eventModel } from "./schema";
import { prisma } from "../db";
import {
  createEventType,
  deleteEventType,
  findEventType,
  updateEventType,
} from "../modules/event-type";

const subRouter = new Elysia({ prefix: "/api/event" })
  .use(eventModel)
  .use(authMiddleware)
  .post(
    "/create",
    async (ctx) => {
      return createEventType({ prisma, data: ctx.body });
    },
    { body: "event.create" }
  )
  .post("/availability", async ({body}) =>{ // TODO: make it GET (use parmas for slug and username)
    console.log(body)
    const {
      slug,
      username
    }=body;

    try {
      const data = await prisma.user.findFirst({
        where:{
          username,
          eventTypes:{
            some:{
              slug
            }
          }
        },
        include:{
          schedules: {
            select:{
              availabilities: true,
              name: true,
              timeZone: true,
            }
          },
          eventTypes: true,
        }
      });
  
      console.log("data", data)
      return {
        availabilities: data?.schedules[0].availabilities,
        eventTypes: data?.eventTypes,
      }
      
    } catch (error) {
      console.log(error)
      return {
        availabilities: null,
        eventTypes: null
      }
    }
  }, {body: "event.availability"})
  .get("/:id", ({ params }) => {
    return findEventType({ prisma, eventTypeId: params.id });
  })
  .get("/getAll/:id", async ({params}) =>{
    const eventTypes= await prisma.eventType.findMany({
      where:{
        userId: params.id
      }
    })
    return {eventTypes};
  })
  .put(
    "/update/:id",
    ({ params, body }) => {
      return updateEventType({
        prisma,
        data: {
          eventTypeId: params.id,
          title: body.title,
          duration: body.duration,
        },
      });
    },
    { body: "event.update" }
  )
  .delete("/delete/:id", ({ params }) => {
    return deleteEventType({ prisma, eventTypeId: params.id });
  });

export default subRouter;

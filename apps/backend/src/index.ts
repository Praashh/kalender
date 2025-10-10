import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import userRouter from "./routes/user";
import eventRouter from "./routes/event";
import bookingRouter from "./routes/booking"
import availabilityRouter from "./routes/availability"
import openapi from "@elysiajs/openapi";

const app = new Elysia()
  .use(
    cors({
      origin: "*",
    })
  )
  .use(openapi())
  .get("/health", () => "Working fine")
  .use(userRouter)
  .use(bookingRouter)
  .use(eventRouter)
  .use(availabilityRouter);

export type App = typeof app;

app.listen(3001, () => console.log("running at 3001"));

export default app;

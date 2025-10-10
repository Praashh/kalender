import { Elysia, t } from "elysia";
import { prisma } from "../db/index";
import { authModel } from "./schema";
import { setAuthCookies } from "../utils/setCookies";
import { registerUser } from "../modules/auth/register";
import { loginUser } from "../modules/auth/login";

const subRouter = new Elysia({ prefix: "/api/auth" })
  .use(authModel)
  .post(
    "/register",
    async (ctx) => {
      try {
        console.time("user");
        const { user, accessToken } = await registerUser({
          prisma,
          data: ctx.body,
        });
        console.timeEnd("user");

        setAuthCookies(ctx.cookie, accessToken);

        return ctx.status(200, {
          message: "User created successfully",
          token: accessToken,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            username: user.username,
          },
        });
      } catch (error) {
        return ctx.status(400, {
          message: "Error while creating user",
        });
      }
    },
    {
      body: "auth.register",
    }
  )
  .post(
    "/login",
    async (ctx) => {
      try {
        const { user, accessToken } = await loginUser({
          prisma,
          data: ctx.body,
        });
        setAuthCookies(ctx.cookie, accessToken);

        return ctx.status(200, {
          message: "User logged in successfully",
          token: accessToken,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            username: user.username,
          },
        });
      } catch (error) {
        console.log("Login error:", error);
        return ctx.status(400, {
          message: "Error while login user",
        });
      }
    },
    { body: "auth.login" }
  )
  .get("/user", async (ctx) => {
    return await prisma.user.findUniqueOrThrow({
      where: {
        email: ctx.query.email,
      },
    });
  });

export default subRouter;

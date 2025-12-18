import { Elysia, t } from "elysia";
import { prisma } from "../db/index";
import { authModel } from "./schema";
import { setAuthCookies } from "../utils/setCookies";
import { registerOAuthUser, registerUser } from "../modules/auth/register";
import { cookie } from "@elysiajs/cookie";

import { loginUser } from "../modules/auth/login";
// @ts-ignore
import { oauth2 } from "elysia-oauth2";
import { googleProvider } from "../lib/google-oauth";
import { HttpResponse } from "../utils/response/success";
import { decodeUser } from "../utils/decodeUser";

const subRouter = new Elysia({ prefix: "/api/auth" })
  .use(authModel)
  .use(cookie())
  .use(oauth2({ Google: googleProvider }))
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
  })
  .get("/google/signin", async ({ oauth2, redirect }) => {
    const url = oauth2.createURL("Google", ["email", "profile"]);
    url.searchParams.set("access_type", "offline");

    return redirect(url.href);
  })
  .get("/google/callback", async ({ oauth2 }) => {
    const tokens = await oauth2.authorize("Google");
    const accessToken = tokens.accessToken();
    const accessTokenExpiresAt = tokens.accessTokenExpiresAt()

    try {
      const user = await decodeUser(tokens.idToken());
      return registerOAuthUser({
        prisma, data: {
          accessToken: accessToken,
          name: user.name,
          picture: user.picture,
          email: user.email,
          expireAt: accessTokenExpiresAt
        }
      })
    } catch (error) {
      return new HttpResponse(400, "BAD_REQUEST");
    }
  })


export default subRouter;
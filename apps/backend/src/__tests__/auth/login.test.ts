import { beforeAll, describe, expect, it, mock } from "bun:test";
import { PrismockClient } from "prismock"; 
import bcrypt from "bcrypt";
import { PrismockClientType } from "prismock/build/main/lib/client";
import { loginUser } from "../../modules/auth/login";

let prismock: PrismockClientType;

mock.module("@prisma/client", () => {
  const actual = require("@prisma/client");
  return {
    ...actual,
    PrismaClient: mock(() => prismock),
  };
});

describe.skip("LOGIN", () => {
  beforeAll(async () => {
    prismock = new PrismockClient();

    const hash = await bcrypt.hash("testuser", 10);

    const user = await prismock.user.create({
      data: {
        id: "test-user-id",
        email: "praash@gmail.com",
        username: "praash",
        name: "test user",
      },
    });

    await prismock.userPassword.create({
      data: {
        hash,
        userId: user.id,
      },
    });
  });

  describe("loginUser", () => {
    it("Should login a user", async () => {
      const result = await prismock.user.findUnique({
        where:{
            email:"praash@gmail.com",
            password: "testuser"
        }
      })
      expect(result).toEqual(
        expect.objectContaining({
          accessToken: expect.any(String),
          user: expect.objectContaining({
            id: expect.any(String),
            name: "test user",
            username: "praash",
            email: "praash@gmail.com",
            emailVerified: null,
            bio: null,
            avatarUrl: null,
          }),
        })
      );
    });

    it("Should fail on wrong password", async () => {
      await expect(
        loginUser({
          prisma: prismock,
          data: {
            email: "praash@gmail.com",
            password: "wrongpassword",
          },
        })
      ).rejects.toThrow("Invalid password");
    });
  });
});

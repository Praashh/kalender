import { beforeAll, describe, expect, it, mock } from "bun:test";
import { generatePrismock } from "prismock";
import { PrismockClientType } from "prismock/build/main/lib/client";
import { registerUser } from "../../modules/auth/register";

let prismock: PrismockClientType;

mock.module("@prisma/client", () => {
  const actual = require("@prisma/client");

  return {
    ...actual,
    PrismaClient: mock(() => prismock), 
  };
});

describe("REGISTER", () => {
  beforeAll(async () => {
    prismock = await generatePrismock(); 
  });

  describe("create", () => {
    it("Should create a user", async () => {
      const result = await registerUser({
        prisma: prismock,
        data: {
          email: "praash@gmail.com",
          password: "testuser",
          username: "praash",
          name: "test user",
        },
      });
    
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
  });
});

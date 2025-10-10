import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET, SALT } from "../../env";
import type { PrismaClient } from "../../../generated/prisma";

interface RegisterData {
  email: string;
  username?: string;
  name?: string;
  password: string;
}

interface IRegisterProp {
  prisma: PrismaClient;
  data: RegisterData;
}

export async function registerUser({ prisma, data }: IRegisterProp) {
  const { email, password, name, username } = data;

  const isUserExists = await prisma.user.findUnique({ where: { email } });
  if (isUserExists) throw new Error("User already exists");

  const user = await prisma.user.create({
    data: { email, username, name },
  });

  const hash = await bcrypt.hash(password, +SALT);

  await prisma.userPassword.create({
    data: { hash, userId: user.id },
  });

  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    accessToken,
    { expiresIn: "30d" } 
  );

  await prisma.session.create({
    data: {
      sessionToken: refreshToken,
      userId: user.id,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  });

  return { user, accessToken, refreshToken };
}

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../env";
import type { PrismaClient } from "../../../generated/prisma";

interface LoginData {
    email: string,
    password: string
}

interface ILoginProp {
  prisma: PrismaClient
  data: LoginData
}


export async function loginUser({ prisma,  data}: ILoginProp) {
  const {email, password} = data;
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        password: { select: { hash: true } },
      },
    });
  
    if (!user) {
      throw new Error("User not found");
    }
  
    const match = await bcrypt.compare(password, user.password?.hash as string);
  
    if (!match) {
      throw new Error("Invalid password");
    }
  
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      {expiresIn: "1d"}
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
  
    return { user, accessToken };
  }
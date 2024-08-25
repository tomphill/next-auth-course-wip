"use server";

import { signIn } from "@/auth";
import db from "@/db/drizzle";
import { users } from "@/db/usersSchema";
import { passwordSchema } from "@/validation/passwordSchema";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const loginWithCredentials = async ({
  email,
  password,
  token,
}: {
  email: string;
  password: string;
  token?: string;
}) => {
  const loginSchema = z.object({
    email: z.string().email(),
    password: passwordSchema,
  });

  const loginValidation = loginSchema.safeParse({
    email,
    password,
  });

  if (!loginValidation.success) {
    return {
      error: true,
      message:
        loginValidation.error?.issues[0]?.message ?? "An error occurred.",
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      token,
      redirect: false,
    });
  } catch (e) {
    return {
      error: true,
      message: "Incorrect email or password",
    };
  }
};

export const preLoginCheck = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) {
    return {
      error: true,
      message: "Incorrect credentials",
    };
  } else {
    const passwordCorrect = await compare(password, user.password!);
    if (!passwordCorrect) {
      return {
        error: true,
        message: "Incorrect credentials",
      };
    }
  }

  return {
    twoFactorActivated: user.twoFactorActivated,
  };
};

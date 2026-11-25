"use server";

import { auth } from "../../../auth";
import { User } from "models/user";
import { Types } from "mongoose";

export async function getPortfolioAvatar(): Promise<string | null> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id || !Types.ObjectId.isValid(id)) return null;
  const user = await User.findById(id).select("avatarUrl").lean<{ avatarUrl?: string } | null>();
  return user?.avatarUrl || null;
}

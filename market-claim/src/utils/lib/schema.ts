import { z } from "zod";

export const verifyInviteCodeSchema = z.object({
  code: z.string().min(1, "Invite code is required"),
});

export const verifyEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

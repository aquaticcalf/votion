import bcrypt from "bcryptjs"
import { z } from "zod"

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { db } from "@/server/db"

const signupSchema = z.object({
	name: z.string().min(1),
	email: z.string(),
	password: z.string().min(8),
	username: z.string().min(3),
})

const loginSchema = z.object({
	username: z.string(),
	password: z.string(),
})

export const userRouter = createTRPCRouter({
	signup: publicProcedure.input(signupSchema).mutation(async ({ input }) => {
		const existingUser = await db.user.findUnique({
			where: { email: input.email },
		})

		if (existingUser) {
			throw new Error("Email already in use")
		}

		const existingUsername = await db.user.findUnique({
			where: { username: input.username },
		})

		if (existingUsername) {
			throw new Error("Username already taken")
		}

		const hashedPassword = await bcrypt.hash(input.password, 10)

		const user = await db.user.create({
			data: {
				name: input.name,
				email: input.email,
				username: input.username,
				password: hashedPassword,
			},
		})

		const workspace = await db.workspace.create({
			data: {
				userId: user.id,
				name: "My Workspace",
			},
		})

		return {
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
			},
			workspace,
		}
	}),

	login: publicProcedure.input(loginSchema).query(async ({ input }) => {
		const user = await db.user.findUnique({
			where: { username: input.username },
		})

		if (!user || !user.password) {
			throw new Error("Invalid credentials")
		}

		const isPasswordValid = await bcrypt.compare(input.password, user.password)

		if (!isPasswordValid) {
			throw new Error("Invalid credentials")
		}

		return {
			id: user.id,
			email: user.email,
			name: user.name,
			username: user.username,
		}
	}),
})

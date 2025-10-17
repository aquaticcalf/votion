import bcrypt from "bcryptjs"
import { z } from "zod"

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "@/server/api/trpc"

export const postRouter = createTRPCRouter({
	hello: publicProcedure
		.input(z.object({ text: z.string() }))
		.query(({ input }) => {
			return {
				greeting: `Hello ${input.text}`,
			}
		}),

	signup: publicProcedure
		.input(
			z.object({
				username: z.string().min(1),
				password: z.string().min(6),
				name: z.string().optional(),
				email: z.string().email().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const hashedPassword = await bcrypt.hash(input.password, 10)

			const user = await ctx.db.user.create({
				data: {
					username: input.username,
					password: hashedPassword,
					...(input.name && { name: input.name }),
					...(input.email && { email: input.email }),
				},
			})

			return { success: true, userId: user.id }
		}),

	create: protectedProcedure
		.input(z.object({ name: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			return ctx.db.post.create({
				data: {
					name: input.name,
					createdBy: { connect: { id: ctx.session.user.id } },
				},
			})
		}),

	getLatest: protectedProcedure.query(async ({ ctx }) => {
		const post = await ctx.db.post.findFirst({
			orderBy: { createdAt: "desc" },
			where: { createdBy: { id: ctx.session.user.id } },
		})

		return post ?? null
	}),

	getSecretMessage: protectedProcedure.query(() => {
		return "you can now see this secret message!"
	}),
})

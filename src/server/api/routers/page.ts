import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { z } from "zod"

const createPageSchema = z.object({
	title: z.string().min(1).max(255),
	workspaceId: z.string(),
	parentId: z.string().optional(),
	icon: z.string().optional(),
	cover: z.string().optional(),
})

const updatePageSchema = z.object({
	id: z.string(),
	title: z.string().min(1).max(255).optional(),
	icon: z.string().optional(),
	cover: z.string().optional(),
	archived: z.boolean().optional(),
})

const getPageSchema = z.object({
	id: z.string(),
})

const listPagesSchema = z.object({
	workspaceId: z.string(),
	parentId: z.string().optional(),
})

export const pageRouter = createTRPCRouter({
	create: protectedProcedure
		.input(createPageSchema)
		.mutation(async ({ ctx, input }) => {
			const page = await ctx.db.page.create({
				data: {
					title: input.title,
					icon: input.icon,
					cover: input.cover,
					parentId: input.parentId,
					workspaceId: input.workspaceId,
					userId: ctx.session.user.id,
				},
			})
			return page
		}),

	get: protectedProcedure.input(getPageSchema).query(async ({ ctx, input }) => {
		const page = await ctx.db.page.findUnique({
			where: { id: input.id },
			include: {
				blocks: {
					orderBy: { order: "asc" },
				},
				children: true,
				database: true,
			},
		})

		if (!page) {
			throw new Error("Page not found")
		}

		if (page.userId !== ctx.session.user.id) {
			throw new Error("Unauthorized")
		}

		return page
	}),

	list: protectedProcedure
		.input(listPagesSchema)
		.query(async ({ ctx, input }) => {
			const pages = await ctx.db.page.findMany({
				where: {
					workspaceId: input.workspaceId,
					parentId: input.parentId,
					userId: ctx.session.user.id,
				},
				include: {
					children: true,
				},
				orderBy: { createdAt: "asc" },
			})

			return pages
		}),

	update: protectedProcedure
		.input(updatePageSchema)
		.mutation(async ({ ctx, input }) => {
			const page = await ctx.db.page.findUnique({
				where: { id: input.id },
			})

			if (!page || page.userId !== ctx.session.user.id) {
				throw new Error("Unauthorized")
			}

			const updated = await ctx.db.page.update({
				where: { id: input.id },
				data: {
					title: input.title,
					icon: input.icon,
					cover: input.cover,
					archived: input.archived,
				},
			})

			return updated
		}),

	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const page = await ctx.db.page.findUnique({
				where: { id: input.id },
			})

			if (!page || page.userId !== ctx.session.user.id) {
				throw new Error("Unauthorized")
			}

			await ctx.db.page.delete({
				where: { id: input.id },
			})

			return { success: true }
		}),
})

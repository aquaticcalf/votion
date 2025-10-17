import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { z } from "zod"

const createBlockSchema = z.object({
	pageId: z.string(),
	type: z.string(),
	content: z.any(),
	order: z.number().optional(),
})

const updateBlockSchema = z.object({
	id: z.string(),
	pageId: z.string(),
	content: z.any(),
})

const reorderBlocksSchema = z.object({
	pageId: z.string(),
	blockIds: z.array(z.string()),
})

const getPageBlocksSchema = z.object({
	pageId: z.string(),
})

export const blockRouter = createTRPCRouter({
	create: protectedProcedure
		.input(createBlockSchema)
		.mutation(async ({ ctx, input }) => {
			const page = await ctx.db.page.findUnique({
				where: { id: input.pageId },
			})

			if (!page || page.userId !== ctx.session.user.id) {
				throw new Error("Unauthorized")
			}

			const block = await ctx.db.block.create({
				data: {
					type: input.type,
					content: input.content,
					order: input.order ?? 0,
					pageId: input.pageId,
				},
			})

			return block
		}),

	getByPage: protectedProcedure
		.input(getPageBlocksSchema)
		.query(async ({ ctx, input }) => {
			const page = await ctx.db.page.findUnique({
				where: { id: input.pageId },
			})

			if (!page || page.userId !== ctx.session.user.id) {
				throw new Error("Unauthorized")
			}

			const blocks = await ctx.db.block.findMany({
				where: { pageId: input.pageId },
				orderBy: { order: "asc" },
			})

			return blocks
		}),

	update: protectedProcedure
		.input(updateBlockSchema)
		.mutation(async ({ ctx, input }) => {
			const page = await ctx.db.page.findUnique({
				where: { id: input.pageId },
			})

			if (!page || page.userId !== ctx.session.user.id) {
				throw new Error("Unauthorized")
			}

			const block = await ctx.db.block.update({
				where: { id: input.id },
				data: {
					content: input.content,
				},
			})

			return block
		}),

	delete: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				pageId: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const page = await ctx.db.page.findUnique({
				where: { id: input.pageId },
			})

			if (!page || page.userId !== ctx.session.user.id) {
				throw new Error("Unauthorized")
			}

			await ctx.db.block.delete({
				where: { id: input.id },
			})

			return { success: true }
		}),

	reorder: protectedProcedure
		.input(reorderBlocksSchema)
		.mutation(async ({ ctx, input }) => {
			const page = await ctx.db.page.findUnique({
				where: { id: input.pageId },
			})

			if (!page || page.userId !== ctx.session.user.id) {
				throw new Error("Unauthorized")
			}

			await Promise.all(
				input.blockIds.map((blockId, index) =>
					ctx.db.block.update({
						where: { id: blockId },
						data: { order: index },
					}),
				),
			)

			return { success: true }
		}),
})

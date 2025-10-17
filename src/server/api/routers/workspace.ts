import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { z } from "zod"

const createWorkspaceSchema = z.object({
	name: z.string().min(1).max(255).optional(),
})

const updateWorkspaceSchema = z.object({
	id: z.string(),
	name: z.string().min(1).max(255),
})

const getWorkspaceSchema = z.object({
	id: z.string(),
})

export const workspaceRouter = createTRPCRouter({
	create: protectedProcedure
		.input(createWorkspaceSchema)
		.mutation(async ({ ctx, input }) => {
			const workspace = await ctx.db.workspace.create({
				data: {
					name: input.name ?? "My Workspace",
					userId: ctx.session.user.id,
				},
			})

			return workspace
		}),

	get: protectedProcedure
		.input(getWorkspaceSchema)
		.query(async ({ ctx, input }) => {
			const workspace = await ctx.db.workspace.findUnique({
				where: { id: input.id },
				include: {
					pages: {
						where: { parentId: null },
						include: { children: true },
						orderBy: { createdAt: "asc" },
					},
				},
			})

			if (!workspace || workspace.userId !== ctx.session.user.id) {
				throw new Error("Unauthorized")
			}

			return workspace
		}),

	list: protectedProcedure.query(async ({ ctx }) => {
		const workspaces = await ctx.db.workspace.findMany({
			where: { userId: ctx.session.user.id },
			orderBy: { createdAt: "asc" },
		})

		return workspaces
	}),

	update: protectedProcedure
		.input(updateWorkspaceSchema)
		.mutation(async ({ ctx, input }) => {
			const workspace = await ctx.db.workspace.findUnique({
				where: { id: input.id },
			})

			if (!workspace || workspace.userId !== ctx.session.user.id) {
				throw new Error("Unauthorized")
			}

			const updated = await ctx.db.workspace.update({
				where: { id: input.id },
				data: { name: input.name },
			})

			return updated
		}),

	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const workspace = await ctx.db.workspace.findUnique({
				where: { id: input.id },
			})

			if (!workspace || workspace.userId !== ctx.session.user.id) {
				throw new Error("Unauthorized")
			}

			await ctx.db.workspace.delete({
				where: { id: input.id },
			})

			return { success: true }
		}),
})

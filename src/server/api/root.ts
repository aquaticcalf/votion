import { blockRouter } from "@/server/api/routers/block"
import { pageRouter } from "@/server/api/routers/page"
import { postRouter } from "@/server/api/routers/post"
import { userRouter } from "@/server/api/routers/user"
import { workspaceRouter } from "@/server/api/routers/workspace"
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc"

export const appRouter = createTRPCRouter({
	post: postRouter,
	page: pageRouter,
	block: blockRouter,
	workspace: workspaceRouter,
	user: userRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter)

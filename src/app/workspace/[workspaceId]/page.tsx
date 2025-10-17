"use client"

import { api } from "@/trpc/react"
import { useRouter } from "next/navigation"
import { use, useEffect } from "react"

export default function WorkspacePage({
	params,
}: {
	params: Promise<{ workspaceId: string }>
}) {
	const router = useRouter()
	const { workspaceId } = use(params)

	const {
		data: workspace,
		error,
		isLoading,
	} = api.workspace.get.useQuery({
		id: workspaceId,
	})

	const createPageMutation = api.page.create.useMutation()

	useEffect(() => {
		if (workspace) {
			if (workspace.pages && workspace.pages.length > 0) {
				const firstPageId = workspace.pages[0]?.id
				if (firstPageId) {
					router.push(`/workspace/${workspaceId}/${firstPageId}`)
				}
			} else {
				createPageMutation.mutate({
					workspaceId,
					title: "Untitled",
				})
			}
		}
	}, [workspace, workspaceId])

	useEffect(() => {
		if (createPageMutation.data?.id) {
			router.push(`/workspace/${workspaceId}/${createPageMutation.data.id}`)
		}
	}, [createPageMutation.data?.id, workspaceId, router])

	if (error) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-red-600">Error</h1>
					<p className="mt-2 text-gray-600">{error.message}</p>
				</div>
			</div>
		)
	}

	return (
		<div className="flex items-center justify-center h-screen">Loading...</div>
	)
}

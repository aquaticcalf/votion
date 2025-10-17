"use client"

import { api } from "@/trpc/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function WorkspacePage({
	params,
}: {
	params: { workspaceId: string }
}) {
	const router = useRouter()

	const { data: workspace } = api.workspace.get.useQuery({
		id: params.workspaceId,
	})

	useEffect(() => {
		if (workspace && workspace.pages && workspace.pages.length > 0) {
			const firstPageId = workspace.pages[0]?.id
			if (firstPageId) {
				router.push(`/workspace/${params.workspaceId}/${firstPageId}`)
			}
		}
	}, [workspace, params.workspaceId, router])

	return (
		<div className="flex items-center justify-center h-screen">Loading...</div>
	)
}

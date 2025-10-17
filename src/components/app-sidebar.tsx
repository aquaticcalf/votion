"use client"

import { PageTree } from "@/components/sidebar/page-tree"
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarRail,
} from "@/components/ui/sidebar"
import { api } from "@/trpc/react"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback } from "react"

interface AppSidebarProps {
	workspaceId: string
}

export function AppSidebar({ workspaceId }: AppSidebarProps) {
	const router = useRouter()

	const { data: workspace } = api.workspace.get.useQuery({
		id: workspaceId,
	})

	const handlePageSelect = useCallback(
		(pageId: string) => {
			router.push(`/workspace/${workspaceId}/${pageId}`)
		},
		[workspaceId, router],
	)

	const handlePageCreate = useCallback(
		(parentId?: string) => {
			router.push(`/workspace/${workspaceId}/new?parent=${parentId || ""}`)
		},
		[workspaceId, router],
	)

	if (!workspace) {
		return null
	}

	return (
		<Sidebar>
			<SidebarContent>
				<SidebarGroup>
					<div className="flex items-center justify-between">
						<SidebarGroupLabel>{workspace.name}</SidebarGroupLabel>
					</div>
					{workspace.pages && workspace.pages.length > 0 ? (
						<PageTree
							pages={workspace.pages}
							onPageSelect={handlePageSelect}
							onPageCreate={handlePageCreate}
						/>
					) : (
						<div className="space-y-2 py-2 text-muted-foreground text-sm">
							<p>No pages yet</p>
							<button
								type="button"
								onClick={() => handlePageCreate()}
								className="flex items-center gap-2 text-primary text-xs hover:underline"
							>
								<Plus className="h-3 w-3" /> Create first page
							</button>
						</div>
					)}
				</SidebarGroup>
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	)
}

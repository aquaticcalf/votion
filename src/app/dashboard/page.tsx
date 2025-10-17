"use client"

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar"
import { api } from "@/trpc/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function DashboardPage() {
	const router = useRouter()
	const [workspaceName, setWorkspaceName] = useState("")
	const utils = api.useUtils()

	const { data: workspaces, isLoading } = api.workspace.list.useQuery()
	const createWorkspaceMutation = api.workspace.create.useMutation({
		onSuccess: (newWorkspace) => {
			setWorkspaceName("")
			utils.workspace.list.invalidate()
			router.push(`/workspace/${newWorkspace.id}`)
		},
	})

	useEffect(() => {
		if (!isLoading && workspaces && workspaces.length === 1) {
			router.push(`/workspace/${workspaces[0]?.id}`)
		}
	}, [isLoading, workspaces, router])

	const handleCreateWorkspace = async () => {
		if (!workspaceName.trim()) return
		await createWorkspaceMutation.mutateAsync({
			name: workspaceName,
		})
	}

	const handleSelectWorkspace = (workspaceId: string) => {
		router.push(`/workspace/${workspaceId}`)
	}

	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				Loading...
			</div>
		)
	}

	return (
		<SidebarProvider>
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
					<SidebarTrigger className="-ml-1" />
					<Separator
						orientation="vertical"
						className="mr-2 data-[orientation=vertical]:h-4"
					/>
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbPage>Workspaces</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</header>

				<div className="flex flex-1 flex-col gap-4 p-4">
					<div>
						<h1 className="text-3xl font-bold">Your Workspaces</h1>
						<p className="mt-1 text-muted-foreground">
							Select or create a workspace to get started
						</p>
					</div>

					{workspaces && workspaces.length > 1 && (
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{workspaces.map((workspace) => (
								<Card
									key={workspace.id}
									className="cursor-pointer transition-all hover:shadow-lg"
									onClick={() => handleSelectWorkspace(workspace.id)}
								>
									<CardHeader>
										<CardTitle>{workspace.name}</CardTitle>
										<CardDescription>
											Created{" "}
											{new Date(workspace.createdAt).toLocaleDateString()}
										</CardDescription>
									</CardHeader>
									<CardContent>
										<Button className="w-full">Open</Button>
									</CardContent>
								</Card>
							))}
						</div>
					)}

					<Card className="mt-4">
						<CardHeader>
							<CardTitle>Create New Workspace</CardTitle>
							<CardDescription>
								Create a new workspace to organize your pages
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex gap-2">
								<Input
									placeholder="Workspace name"
									value={workspaceName}
									onChange={(e) => setWorkspaceName(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											handleCreateWorkspace()
										}
									}}
								/>
								<Button
									onClick={handleCreateWorkspace}
									disabled={
										!workspaceName.trim() || createWorkspaceMutation.isPending
									}
								>
									{createWorkspaceMutation.isPending ? "Creating..." : "Create"}
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</SidebarInset>
		</SidebarProvider>
	)
}

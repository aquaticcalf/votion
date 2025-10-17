import { AppSidebar } from "@/components/app-sidebar"
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar"

export default async function Layout({
	children,
	params,
}: {
	children: React.ReactNode
	params: Promise<{ workspaceId: string }>
}) {
	const { workspaceId } = await params

	return (
		<SidebarProvider>
			<AppSidebar workspaceId={workspaceId} />
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
								<BreadcrumbPage>Workspace</BreadcrumbPage>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>Page</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</header>
				<div className="flex-1 overflow-y-auto">
					<div className="mx-auto w-full max-w-4xl p-8">{children}</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	)
}

"use client"

import { Button } from "@/components/ui/button"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { Page } from "@prisma/client"
import { ChevronRight, FileText, Plus, Trash2 } from "lucide-react"
import { useState } from "react"

interface PageTreeProps {
	pages: (Page & { children: Page[] })[]
	onPageSelect: (pageId: string) => void
	onPageCreate?: (parentId?: string) => void
	selectedPageId?: string
}

export function PageTree({
	pages,
	onPageSelect,
	onPageCreate,
	selectedPageId,
}: PageTreeProps) {
	const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set())

	const toggleExpanded = (pageId: string) => {
		setExpandedPages((prev) => {
			const next = new Set(prev)
			if (next.has(pageId)) {
				next.delete(pageId)
			} else {
				next.add(pageId)
			}
			return next
		})
	}

	const renderPageItem = (page: Page & { children: Page[] }, depth = 0) => {
		const isExpanded = expandedPages.has(page.id)
		const hasChildren = page.children.length > 0
		const isSelected = page.id === selectedPageId

		return (
			<div key={page.id}>
				<div
					className={cn(
						"group flex cursor-pointer items-center gap-1 rounded-md px-2 py-1.5 transition-colors hover:bg-accent",
						isSelected && "bg-primary/10 text-primary",
					)}
					style={{ marginLeft: `${depth * 16}px` }}
				>
					{hasChildren && (
						<Button
							variant="ghost"
							size="sm"
							onClick={() => toggleExpanded(page.id)}
							className="h-6 w-6 p-0"
						>
							<ChevronRight
								className={cn(
									"h-4 w-4 transition-transform",
									isExpanded && "rotate-90",
								)}
							/>
						</Button>
					)}
					{!hasChildren && <div className="w-6" />}

					<FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground" />

					<button
						className="flex-1 truncate text-left text-sm"
						onClick={() => onPageSelect(page.id)}
						type="button"
					>
						{page.icon} {page.title}
					</button>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => onPageCreate?.(page.id)}
								className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
							>
								<Plus className="h-3 w-3" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Add sub-page</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="h-6 w-6 p-0 opacity-0 hover:text-destructive group-hover:opacity-100"
							>
								<Trash2 className="h-3 w-3" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Delete page</TooltipContent>
					</Tooltip>
				</div>

				{isExpanded &&
					hasChildren &&
					page.children.map((child) =>
						renderPageItem(child as Page & { children: Page[] }, depth + 1),
					)}
			</div>
		)
	}

	return (
		<div className="space-y-1 py-2">
			{pages.map((page) => renderPageItem(page as Page & { children: Page[] }))}
		</div>
	)
}

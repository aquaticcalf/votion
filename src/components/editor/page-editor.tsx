"use client"

import { ListBlock } from "@/components/blocks/list-block"
import { TextBlock } from "@/components/blocks/text-block"
import { SlashCommandPalette } from "@/components/editor/slash-command-palette"
import { Button } from "@/components/ui/button"
import type {
	Block,
	BlockType,
	HeadingContent,
	ListContent,
	TextContent,
} from "@/lib/blocks/types"
import { useBlockStore } from "@/lib/stores/block-store"
import { Trash2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { createSwapy } from "swapy"

interface PageEditorProps {
	pageId: string
	initialBlocks: Block[]
}

export function PageEditor({ pageId, initialBlocks }: PageEditorProps) {
	const { blocks, addBlock, deleteBlock, reorderBlocks, setPageBlocks } =
		useBlockStore()
	const containerRef = useRef<HTMLDivElement>(null)
	const [isCommandOpen, setIsCommandOpen] = useState(false)

	useEffect(() => {
		setPageBlocks(pageId, initialBlocks)
	}, [pageId, initialBlocks, setPageBlocks])

	useEffect(() => {
		if (!containerRef.current) return

		const instance = createSwapy(containerRef.current)

		instance.onSwapEnd(() => {
			const pageBlocks = blocks[pageId] ?? []
			const container = containerRef.current
			if (!container) return

			const newOrder = Array.from(container.children)
				.map((el) => el.getAttribute("data-block-id"))
				.filter(Boolean) as string[]

			const reorderedBlocks = newOrder
				.map((id) => pageBlocks.find((b) => b.id === id))
				.filter(Boolean) as Block[]

			reorderBlocks(pageId, reorderedBlocks)
		})

		return () => {
			instance.destroy()
		}
	}, [pageId, blocks, reorderBlocks])

	const handleAddBlock = (type: BlockType) => {
		addBlock(pageId, type)
	}

	const pageBlocks = blocks[pageId] ?? []

	return (
		<div className="flex flex-col gap-4">
			<div className="flex gap-2">
				<Button
					size="sm"
					variant="outline"
					onClick={() => handleAddBlock("text")}
				>
					+ Text
				</Button>
				<Button
					size="sm"
					variant="outline"
					onClick={() => handleAddBlock("heading")}
				>
					+ Heading
				</Button>
				<Button
					size="sm"
					variant="outline"
					onClick={() => handleAddBlock("bulleted_list")}
				>
					+ List
				</Button>
				<Button
					size="sm"
					variant="outline"
					onClick={() => handleAddBlock("todo")}
				>
					+ Todo
				</Button>
				<Button
					size="sm"
					variant="outline"
					onClick={() => setIsCommandOpen(true)}
				>
					/ Commands
				</Button>
			</div>

			<SlashCommandPalette
				onSelectBlock={handleAddBlock}
				isOpen={isCommandOpen}
				onOpenChange={setIsCommandOpen}
			/>

			<div ref={containerRef} className="space-y-2">
				{pageBlocks
					.sort((a, b) => a.order - b.order)
					.map((block) => (
						<div
							key={block.id}
							data-block-id={block.id}
							className="group flex cursor-grab gap-2 rounded-lg border border-transparent p-2 transition-colors hover:border-border hover:bg-muted/50 active:cursor-grabbing"
						>
							<div className="flex-1">
								{block.type === "text" && (
									<TextBlock
										blockId={block.id}
										pageId={pageId}
										content={block.content as TextContent}
									/>
								)}
								{block.type === "heading" && (
									<TextBlock
										blockId={block.id}
										pageId={pageId}
										content={block.content as HeadingContent}
									/>
								)}
								{block.type === "bulleted_list" && (
									<ListBlock
										blockId={block.id}
										pageId={pageId}
										content={block.content as ListContent}
										isTodo={false}
									/>
								)}
								{block.type === "numbered_list" && (
									<ListBlock
										blockId={block.id}
										pageId={pageId}
										content={block.content as ListContent}
										isTodo={false}
									/>
								)}
								{block.type === "todo" && (
									<ListBlock
										blockId={block.id}
										pageId={pageId}
										content={block.content as ListContent}
										isTodo={true}
									/>
								)}
							</div>
							<Button
								variant="ghost"
								size="icon"
								className="h-6 w-6 opacity-0 group-hover:opacity-100"
								onClick={() => deleteBlock(pageId, block.id)}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					))}
			</div>
		</div>
	)
}

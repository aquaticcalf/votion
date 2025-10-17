"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import type { ListContent } from "@/lib/blocks/types"
import { useBlockStore } from "@/lib/stores/block-store"
import { useCallback } from "react"

interface ListBlockProps {
	blockId: string
	pageId: string
	content: ListContent
	isTodo?: boolean
	isEditing?: boolean
}

export function ListBlock({
	blockId,
	pageId,
	content,
	isTodo = false,
	isEditing = true,
}: ListBlockProps) {
	const updateBlock = useBlockStore((state) => state.updateBlock)

	const handleTextChange = useCallback(
		(text: string) => {
			updateBlock(pageId, blockId, { ...content, text })
		},
		[blockId, pageId, updateBlock, content],
	)

	const handleCheckChange = useCallback(
		(checked: boolean) => {
			updateBlock(pageId, blockId, { ...content, checked })
		},
		[blockId, pageId, updateBlock, content],
	)

	if (isEditing && isTodo) {
		return (
			<div className="flex items-start gap-3">
				<Checkbox
					checked={content.checked ?? false}
					onCheckedChange={handleCheckChange}
					className="mt-1.5"
				/>
				<Textarea
					value={content.text}
					onChange={(e) => handleTextChange(e.target.value)}
					className={`min-h-[24px] flex-1 resize-none bg-transparent text-base placeholder:text-muted-foreground ${
						content.checked ? "text-muted-foreground line-through" : ""
					}`}
					placeholder="Add a task..."
					rows={1}
				/>
			</div>
		)
	}

	if (isEditing) {
		return (
			<div className="flex items-start gap-2">
				<span className="mt-1 text-muted-foreground">•</span>
				<Textarea
					value={content.text}
					onChange={(e) => handleTextChange(e.target.value)}
					className="min-h-[24px] flex-1 resize-none bg-transparent text-base placeholder:text-muted-foreground"
					placeholder="Add an item..."
					rows={1}
				/>
			</div>
		)
	}

	if (isTodo) {
		return (
			<div className="flex items-start gap-3">
				<Checkbox
					checked={content.checked ?? false}
					disabled
					className="mt-1"
				/>
				<p
					className={`text-base ${
						content.checked ? "text-muted-foreground line-through" : ""
					}`}
				>
					{content.text}
				</p>
			</div>
		)
	}

	return (
		<div className="flex items-start gap-2">
			<span className="text-muted-foreground">•</span>
			<p className="text-base">{content.text}</p>
		</div>
	)
}

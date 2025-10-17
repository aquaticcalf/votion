"use client"

import { Textarea } from "@/components/ui/textarea"
import type { TextContent } from "@/lib/blocks/types"
import { useBlockStore } from "@/lib/stores/block-store"
import { useCallback } from "react"

interface TextBlockProps {
	blockId: string
	pageId: string
	content: TextContent
	isEditing?: boolean
}

export function TextBlock({
	blockId,
	pageId,
	content,
	isEditing = true,
}: TextBlockProps) {
	const updateBlock = useBlockStore((state) => state.updateBlock)

	const handleChange = useCallback(
		(text: string) => {
			updateBlock(pageId, blockId, { text })
		},
		[blockId, pageId, updateBlock],
	)

	if (isEditing) {
		return (
			<Textarea
				value={content.text}
				onChange={(e) => handleChange(e.target.value)}
				className="min-h-[24px] resize-none bg-transparent text-base placeholder:text-muted-foreground"
				placeholder="Start typing..."
				rows={1}
			/>
		)
	}

	return (
		<p className="text-base text-foreground leading-relaxed">{content.text}</p>
	)
}

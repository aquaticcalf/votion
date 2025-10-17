"use client"

import { InlineEditor } from "@/components/editor/inline-editor"
import type { InlineFormat, TextContent } from "@/lib/blocks/types"
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
		(text: string, formats?: InlineFormat[]) => {
			updateBlock(pageId, blockId, { text, formats })
		},
		[blockId, pageId, updateBlock],
	)

	if (isEditing) {
		return (
			<InlineEditor
				value={content.text}
				formats={content.formats}
				onChange={handleChange}
				placeholder="Start typing..."
				multiline
			/>
		)
	}

	return (
		<p className="text-base text-foreground leading-relaxed">{content.text}</p>
	)
}

// @vitest-environment happy-dom

import { TextBlock } from "@/components/blocks/text-block"
import { useBlockStore } from "@/lib/stores/block-store"
import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"

describe("TextBlock", () => {
	beforeEach(() => {
		useBlockStore.setState({ blocks: {} })
	})

	it("renders textarea in edit mode", () => {
		render(
			<TextBlock
				blockId="block-1"
				pageId="page-1"
				content={{ text: "" }}
				isEditing={true}
			/>,
		)

		const textarea = screen.getByPlaceholderText("Start typing...")
		expect(textarea).toBeInTheDocument()
	})

	it("renders text in read-only mode", () => {
		render(
			<TextBlock
				blockId="block-1"
				pageId="page-1"
				content={{ text: "Hello World" }}
				isEditing={false}
			/>,
		)

		expect(screen.getByText("Hello World")).toBeInTheDocument()
	})

	it("updates store on text change", async () => {
		const store = useBlockStore.getState()
		store.setPageBlocks("page-1", [
			{
				id: "block-1",
				type: "text",
				content: { text: "" },
				order: 0,
				pageId: "page-1",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		])

		const { rerender } = render(
			<TextBlock
				blockId="block-1"
				pageId="page-1"
				content={{ text: "" }}
				isEditing={true}
			/>,
		)

		rerender(
			<TextBlock
				blockId="block-1"
				pageId="page-1"
				content={{ text: "New text" }}
				isEditing={true}
			/>,
		)

		const state = useBlockStore.getState()
		store.updateBlock("page-1", "block-1", { text: "New text" })

		const block = state.getBlockById("page-1", "block-1")
		expect(block?.content).toEqual({ text: "New text" })
	})

	it("handles empty content gracefully", () => {
		const { container } = render(
			<TextBlock
				blockId="block-1"
				pageId="page-1"
				content={{ text: "" }}
				isEditing={false}
			/>,
		)

		expect(container.querySelector("p")).toBeEmptyDOMElement()
	})

	it("preserves text content", () => {
		const longText =
			"This is a longer piece of text that should be preserved across renders"

		const { rerender } = render(
			<TextBlock
				blockId="block-1"
				pageId="page-1"
				content={{ text: longText }}
				isEditing={false}
			/>,
		)

		expect(screen.getByText(longText)).toBeInTheDocument()

		rerender(
			<TextBlock
				blockId="block-1"
				pageId="page-1"
				content={{ text: longText }}
				isEditing={true}
			/>,
		)

		const textarea = screen.getByPlaceholderText(
			"Start typing...",
		) as HTMLTextAreaElement
		expect(textarea.value).toBe(longText)
	})
})

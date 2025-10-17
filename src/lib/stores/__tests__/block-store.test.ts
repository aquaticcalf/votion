import type { TextContent } from "@/lib/blocks/types"
import { useBlockStore } from "@/lib/stores/block-store"
import { beforeEach, describe, expect, it } from "vitest"

describe("BlockStore", () => {
	beforeEach(() => {
		useBlockStore.setState({ blocks: {} })
	})

	describe("addBlock", () => {
		it("should add a block to the store", () => {
			const store = useBlockStore.getState()
			const block = store.addBlock("page-1", "text")

			expect(block).toBeDefined()
			expect(block.type).toBe("text")
			expect(block.pageId).toBe("page-1")
			expect(block.content).toEqual({ text: "" })
		})

		it("should generate unique block IDs", () => {
			const store = useBlockStore.getState()
			const block1 = store.addBlock("page-1", "text")
			const block2 = store.addBlock("page-1", "text")

			expect(block1.id).not.toBe(block2.id)
		})

		it("should preserve order parameter", () => {
			const store = useBlockStore.getState()
			const block = store.addBlock("page-1", "text", 5)

			expect(block.order).toBe(5)
		})

		it("should create blocks with correct default content for each type", () => {
			const store = useBlockStore.getState()

			const textBlock = store.addBlock("page-1", "text")
			expect(textBlock.content).toEqual({ text: "" })

			const headingBlock = store.addBlock("page-1", "heading")
			expect(headingBlock.content).toEqual({ text: "", level: 1 })

			const todoBlock = store.addBlock("page-1", "todo")
			expect(todoBlock.content).toEqual({ text: "", checked: false })

			const codeBlock = store.addBlock("page-1", "code")
			expect(codeBlock.content).toEqual({ text: "", language: "javascript" })
		})
	})

	describe("updateBlock", () => {
		it("should update block content", () => {
			const store = useBlockStore.getState()
			const block = store.addBlock("page-1", "text")

			const newContent: TextContent = { text: "Updated text" }
			store.updateBlock("page-1", block.id, newContent)

			const updated = store.getBlockById("page-1", block.id)
			expect(updated?.content).toEqual(newContent)
		})

		it("should update the updatedAt timestamp", () => {
			const store = useBlockStore.getState()
			const block = store.addBlock("page-1", "text")
			const originalTime = block.updatedAt

			store.updateBlock("page-1", block.id, { text: "New text" })
			const updated = store.getBlockById("page-1", block.id)

			expect(updated?.updatedAt.getTime()).toBeGreaterThanOrEqual(
				originalTime.getTime(),
			)
		})

		it("should not affect other blocks", () => {
			const store = useBlockStore.getState()
			const block1 = store.addBlock("page-1", "text")
			const block2 = store.addBlock("page-1", "text")

			store.updateBlock("page-1", block1.id, { text: "Changed" })

			const unchanged = store.getBlockById("page-1", block2.id)
			expect(unchanged?.content).toEqual({ text: "" })
		})
	})

	describe("deleteBlock", () => {
		it("should delete a block", () => {
			const store = useBlockStore.getState()
			const block = store.addBlock("page-1", "text")

			store.deleteBlock("page-1", block.id)

			const deleted = store.getBlockById("page-1", block.id)
			expect(deleted).toBeUndefined()
		})

		it("should not affect other blocks", () => {
			const store = useBlockStore.getState()
			const block1 = store.addBlock("page-1", "text")
			const block2 = store.addBlock("page-1", "text")

			store.deleteBlock("page-1", block1.id)

			const remaining = store.getBlocksByPage("page-1")
			expect(remaining).toHaveLength(1)
			expect(remaining[0]?.id).toBe(block2.id)
		})
	})

	describe("reorderBlocks", () => {
		it("should reorder blocks and update order property", () => {
			const store = useBlockStore.getState()
			const block1 = store.addBlock("page-1", "text")
			const block2 = store.addBlock("page-1", "text")
			const block3 = store.addBlock("page-1", "text")

			const reordered = [block3, block1, block2]
			store.reorderBlocks("page-1", reordered)

			const blocks = store.getBlocksByPage("page-1")
			expect(blocks[0]?.id).toBe(block3.id)
			expect(blocks[0]?.order).toBe(0)
			expect(blocks[1]?.id).toBe(block1.id)
			expect(blocks[1]?.order).toBe(1)
			expect(blocks[2]?.id).toBe(block2.id)
			expect(blocks[2]?.order).toBe(2)
		})
	})

	describe("getBlocksByPage", () => {
		it("should return all blocks for a page", () => {
			const store = useBlockStore.getState()
			store.addBlock("page-1", "text")
			store.addBlock("page-1", "text")
			store.addBlock("page-2", "text")

			const page1Blocks = store.getBlocksByPage("page-1")
			expect(page1Blocks).toHaveLength(2)

			const page2Blocks = store.getBlocksByPage("page-2")
			expect(page2Blocks).toHaveLength(1)
		})

		it("should return empty array for non-existent page", () => {
			const store = useBlockStore.getState()
			const blocks = store.getBlocksByPage("non-existent")
			expect(blocks).toEqual([])
		})
	})

	describe("getBlockById", () => {
		it("should return a block by ID", () => {
			const store = useBlockStore.getState()
			const block = store.addBlock("page-1", "text")

			const retrieved = store.getBlockById("page-1", block.id)
			expect(retrieved?.id).toBe(block.id)
		})

		it("should return undefined for non-existent block", () => {
			const store = useBlockStore.getState()
			const retrieved = store.getBlockById("page-1", "non-existent")
			expect(retrieved).toBeUndefined()
		})
	})

	describe("setPageBlocks", () => {
		it("should replace all blocks for a page", () => {
			const store = useBlockStore.getState()
			const block1 = store.addBlock("page-1", "text")
			store.addBlock("page-1", "text")

			const newBlocks = [
				{
					...block1,
					content: { text: "Changed" },
				},
			]

			store.setPageBlocks("page-1", newBlocks)

			const blocks = store.getBlocksByPage("page-1")
			expect(blocks).toHaveLength(1)
		})
	})

	describe("multi-page isolation", () => {
		it("should keep blocks isolated by page", () => {
			const store = useBlockStore.getState()

			const page1Block1 = store.addBlock("page-1", "text")
			const page1Block2 = store.addBlock("page-1", "text")
			const page2Block1 = store.addBlock("page-2", "text")

			store.updateBlock("page-1", page1Block1.id, { text: "Page 1 Update" })

			expect(store.getBlockById("page-1", page1Block1.id)?.content).toEqual({
				text: "Page 1 Update",
			})
			expect(store.getBlockById("page-1", page1Block2.id)?.content).toEqual({
				text: "",
			})
			expect(store.getBlockById("page-2", page2Block1.id)?.content).toEqual({
				text: "",
			})
		})
	})
})

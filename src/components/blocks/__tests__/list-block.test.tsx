import { ListBlock } from "@/components/blocks/list-block"
import { useBlockStore } from "@/lib/stores/block-store"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"

describe("ListBlock", () => {
	beforeEach(() => {
		useBlockStore.setState({ blocks: {} })
	})

	describe("bulleted list", () => {
		it("renders bullet point in edit mode", () => {
			render(
				<ListBlock
					blockId="block-1"
					pageId="page-1"
					content={{ text: "" }}
					isTodo={false}
					isEditing={true}
				/>,
			)

			expect(screen.getByPlaceholderText("Add an item...")).toBeInTheDocument()
		})

		it("renders bullet point in read-only mode", () => {
			render(
				<ListBlock
					blockId="block-1"
					pageId="page-1"
					content={{ text: "Item 1" }}
					isTodo={false}
					isEditing={false}
				/>,
			)

			expect(screen.getByText("Item 1")).toBeInTheDocument()
		})
	})

	describe("todo list", () => {
		it("renders checkbox in edit mode", () => {
			const { container } = render(
				<ListBlock
					blockId="block-1"
					pageId="page-1"
					content={{ text: "", checked: false }}
					isTodo={true}
					isEditing={true}
				/>,
			)

			const checkbox = container.querySelector("button[role='checkbox']")
			expect(checkbox).toBeInTheDocument()
			expect(checkbox).toHaveAttribute("aria-checked", "false")
		})

		it("updates store when checkbox is toggled", async () => {
			const user = userEvent.setup()

			const store = useBlockStore.getState()
			store.setPageBlocks("page-1", [
				{
					id: "block-1",
					type: "todo",
					content: { text: "Task", checked: false },
					order: 0,
					pageId: "page-1",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			])

			const { container } = render(
				<ListBlock
					blockId="block-1"
					pageId="page-1"
					content={{ text: "Task", checked: false }}
					isTodo={true}
					isEditing={true}
				/>,
			)

			const checkbox = container.querySelector("button[role='checkbox']")
			if (!checkbox) throw new Error("Checkbox not found")
			await user.click(checkbox)

			const state = useBlockStore.getState()
			const block = state.getBlockById("page-1", "block-1")
			expect(block?.content).toEqual({ text: "Task", checked: true })
		})

		it("shows strikethrough when checked in read-only mode", () => {
			const { container } = render(
				<ListBlock
					blockId="block-1"
					pageId="page-1"
					content={{ text: "Completed task", checked: true }}
					isTodo={true}
					isEditing={false}
				/>,
			)

			const paragraph = container.querySelector("p")
			expect(paragraph).toHaveClass("line-through")
		})

		it("updates text content", async () => {
			const store = useBlockStore.getState()
			store.setPageBlocks("page-1", [
				{
					id: "block-1",
					type: "todo",
					content: { text: "", checked: false },
					order: 0,
					pageId: "page-1",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			])

			render(
				<ListBlock
					blockId="block-1"
					pageId="page-1"
					content={{ text: "", checked: false }}
					isTodo={true}
					isEditing={true}
				/>,
			)

			store.updateBlock("page-1", "block-1", {
				text: "My new task",
				checked: false,
			})

			const state = useBlockStore.getState()
			const block = state.getBlockById("page-1", "block-1")
			expect(block?.content).toEqual({ text: "My new task", checked: false })
		})
	})

	describe("multi-page isolation", () => {
		it("updates correct page blocks", async () => {
			const store = useBlockStore.getState()

			store.setPageBlocks("page-1", [
				{
					id: "block-1",
					type: "bulleted_list",
					content: { text: "Page 1 item" },
					order: 0,
					pageId: "page-1",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			])

			const { rerender } = render(
				<ListBlock
					blockId="block-1"
					pageId="page-1"
					content={{ text: "Page 1 item" }}
					isTodo={false}
					isEditing={true}
				/>,
			)

			store.addBlock("page-2", "bulleted_list")

			rerender(
				<ListBlock
					blockId="block-2"
					pageId="page-2"
					content={{ text: "Page 2 item" }}
					isTodo={false}
					isEditing={true}
				/>,
			)

			const state = useBlockStore.getState()
			const page1Blocks = state.getBlocksByPage("page-1")
			const page2Blocks = state.getBlocksByPage("page-2")

			expect(page1Blocks).toHaveLength(1)
			expect(page2Blocks).toHaveLength(1)
		})
	})
})

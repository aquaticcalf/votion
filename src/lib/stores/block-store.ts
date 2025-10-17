import type { Block, BlockContent, BlockType } from "@/lib/blocks/types"
import { defaultBlockContent } from "@/lib/blocks/types"
import { nanoid } from "nanoid"
import { create } from "zustand"
import { devtools, subscribeWithSelector } from "zustand/middleware"

interface BlockStore {
	blocks: Record<string, Block[]>
	addBlock: (pageId: string, type: BlockType, order?: number) => Block
	updateBlock: (pageId: string, blockId: string, content: BlockContent) => void
	deleteBlock: (pageId: string, blockId: string) => void
	reorderBlocks: (pageId: string, blocks: Block[]) => void
	setPageBlocks: (pageId: string, blocks: Block[]) => void
	getBlocksByPage: (pageId: string) => Block[]
	getBlockById: (pageId: string, blockId: string) => Block | undefined
}

export const useBlockStore = create<BlockStore>()(
	devtools(
		subscribeWithSelector((set, get) => ({
			blocks: {},

			addBlock: (pageId: string, type: BlockType, order?: number) => {
				const newBlock: Block = {
					id: nanoid(),
					type,
					content: defaultBlockContent[type] as BlockContent,
					order: order ?? 0,
					pageId,
					createdAt: new Date(),
					updatedAt: new Date(),
				}

				set((state) => {
					const pageBlocks = state.blocks[pageId] ?? []
					return {
						blocks: {
							...state.blocks,
							[pageId]: [...pageBlocks, newBlock],
						},
					}
				})

				return newBlock
			},

			updateBlock: (pageId: string, blockId: string, content: BlockContent) => {
				set((state) => {
					const pageBlocks = state.blocks[pageId] ?? []
					return {
						blocks: {
							...state.blocks,
							[pageId]: pageBlocks.map((block) =>
								block.id === blockId
									? { ...block, content, updatedAt: new Date() }
									: block,
							),
						},
					}
				})
			},

			deleteBlock: (pageId: string, blockId: string) => {
				set((state) => {
					const pageBlocks = state.blocks[pageId] ?? []
					return {
						blocks: {
							...state.blocks,
							[pageId]: pageBlocks.filter((block) => block.id !== blockId),
						},
					}
				})
			},

			reorderBlocks: (pageId: string, blocks: Block[]) => {
				set((state) => ({
					blocks: {
						...state.blocks,
						[pageId]: blocks.map((block, index) => ({
							...block,
							order: index,
						})),
					},
				}))
			},

			setPageBlocks: (pageId: string, blocks: Block[]) => {
				set((state) => ({
					blocks: {
						...state.blocks,
						[pageId]: blocks,
					},
				}))
			},

			getBlocksByPage: (pageId: string) => {
				return get().blocks[pageId] ?? []
			},

			getBlockById: (pageId: string, blockId: string) => {
				const pageBlocks = get().blocks[pageId] ?? []
				return pageBlocks.find((block) => block.id === blockId)
			},
		})),
		{ name: "block-store" },
	),
)

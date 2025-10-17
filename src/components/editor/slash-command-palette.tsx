"use client"

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command"
import { Popover, PopoverContent } from "@/components/ui/popover"
import { type BlockType, blockTypeLabels } from "@/lib/blocks/types"
import { Heading1, List, ListChecks, Pilcrow, Quote } from "lucide-react"
import { useCallback, useRef, useState } from "react"

const BLOCK_ICONS: Record<BlockType, React.ReactNode> = {
	text: <Pilcrow className="h-4 w-4" />,
	heading: <Heading1 className="h-4 w-4" />,
	bulleted_list: <List className="h-4 w-4" />,
	numbered_list: <List className="h-4 w-4" />,
	todo: <ListChecks className="h-4 w-4" />,
	code: <Pilcrow className="h-4 w-4" />,
	quote: <Quote className="h-4 w-4" />,
	divider: <Pilcrow className="h-4 w-4" />,
	image: <Pilcrow className="h-4 w-4" />,
}

const AVAILABLE_BLOCKS: BlockType[] = [
	"text",
	"heading",
	"bulleted_list",
	"numbered_list",
	"todo",
	"code",
	"quote",
	"divider",
	"image",
]

interface SlashCommandPaletteProps {
	onSelectBlock: (type: BlockType) => void
	isOpen: boolean
	onOpenChange: (open: boolean) => void
}

export function SlashCommandPalette({
	onSelectBlock,
	isOpen,
	onOpenChange,
}: SlashCommandPaletteProps) {
	const [search, setSearch] = useState("")

	const filteredBlocks = AVAILABLE_BLOCKS.filter((type) =>
		blockTypeLabels[type].toLowerCase().includes(search.toLowerCase()),
	)

	return (
		<Popover open={isOpen} onOpenChange={onOpenChange}>
			<PopoverContent className="w-56 p-0" align="start">
				<Command>
					<CommandInput
						placeholder="Search blocks..."
						value={search}
						onValueChange={setSearch}
					/>
					<CommandEmpty>No blocks found.</CommandEmpty>
					<CommandGroup>
						{filteredBlocks.map((type) => (
							<CommandItem
								key={type}
								value={type}
								onSelect={() => {
									onSelectBlock(type)
									onOpenChange(false)
									setSearch("")
								}}
							>
								{BLOCK_ICONS[type]}
								<span>{blockTypeLabels[type]}</span>
							</CommandItem>
						))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	)
}

export function useSlashCommandDetection(
	_onCommand: (type: BlockType) => void,
) {
	const [isOpen, setIsOpen] = useState(false)
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
			const target = e.currentTarget
			const text = target.value
			const cursorPos = target.selectionStart

			if (e.key === "/" && cursorPos > 0 && text[cursorPos - 1] === " ") {
				setIsOpen(true)
			} else if (e.key === "Escape") {
				setIsOpen(false)
			}
		},
		[],
	)

	return {
		textareaRef,
		isOpen,
		setIsOpen,
		handleKeyDown,
	}
}

export type BlockType =
	| "text"
	| "heading"
	| "bulleted_list"
	| "numbered_list"
	| "todo"
	| "code"
	| "quote"
	| "divider"
	| "image"

export type InlineStyle = "bold" | "italic" | "code" | "link"

export interface InlineFormat {
	style: InlineStyle
	start: number
	end: number
	data?: Record<string, string>
}

export interface TextContent {
	text: string
	formats?: InlineFormat[]
}

export interface HeadingContent {
	text: string
	level: 1 | 2 | 3
	formats?: InlineFormat[]
}

export interface ListContent {
	text: string
	checked?: boolean
}

export interface CodeContent {
	text: string
	language: string
}

export interface QuoteContent {
	text: string
}

export interface ImageContent {
	url: string
	caption?: string
}

export type BlockContent =
	| TextContent
	| HeadingContent
	| ListContent
	| CodeContent
	| QuoteContent
	| ImageContent

export interface Block {
	id: string
	type: BlockType
	content: BlockContent
	order: number
	pageId: string
	createdAt: Date
	updatedAt: Date
}

export const defaultBlockContent: Record<BlockType, unknown> = {
	text: { text: "", formats: [] },
	heading: { text: "", level: 1, formats: [] },
	bulleted_list: { text: "" },
	numbered_list: { text: "" },
	todo: { text: "", checked: false },
	code: { text: "", language: "javascript" },
	quote: { text: "" },
	divider: {},
	image: { url: "", caption: "" },
}

export const blockTypeLabels: Record<BlockType, string> = {
	text: "Text",
	heading: "Heading",
	bulleted_list: "Bulleted List",
	numbered_list: "Numbered List",
	todo: "To-do",
	code: "Code",
	quote: "Quote",
	divider: "Divider",
	image: "Image",
}

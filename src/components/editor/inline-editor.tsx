"use client"

import type { InlineFormat, InlineStyle } from "@/lib/blocks/types"
import { Bold, Code2, Italic, Link2 } from "lucide-react"
import { useCallback, useRef } from "react"

interface InlineEditorProps {
	value: string
	formats?: InlineFormat[]
	onChange: (text: string, formats?: InlineFormat[]) => void
	placeholder?: string
	multiline?: boolean
}

export function InlineEditor({
	value,
	formats = [],
	onChange,
	placeholder = "Start typing...",
	multiline = false,
}: InlineEditorProps) {
	const editorRef = useRef<HTMLDivElement>(null)

	const applyFormat = useCallback(
		(style: InlineStyle) => {
			const selection = window.getSelection()
			if (!selection || selection.toString().length === 0) return

			const range = selection.getRangeAt(0)
			const preCaretRange = range.cloneRange()
			preCaretRange.selectNodeContents(editorRef.current!)
			preCaretRange.setEnd(range.endContainer, range.endOffset)
			const start = preCaretRange.toString().length - range.toString().length
			const end = start + range.toString().length

			const newFormats = [...formats]

			if (style === "link") {
				const url = prompt("Enter URL:")
				if (url) {
					newFormats.push({
						style,
						start,
						end,
						data: { url },
					})
					onChange(value, newFormats)
				}
			} else {
				const existingIndex = newFormats.findIndex(
					(f) => f.start === start && f.end === end && f.style === style,
				)

				if (existingIndex !== -1) {
					newFormats.splice(existingIndex, 1)
				} else {
					newFormats.push({ style, start, end })
				}

				onChange(value, newFormats)
			}

			selection.removeAllRanges()
		},
		[value, formats, onChange],
	)

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.ctrlKey || e.metaKey) {
			if (e.key === "b") {
				e.preventDefault()
				applyFormat("bold")
			} else if (e.key === "i") {
				e.preventDefault()
				applyFormat("italic")
			} else if (e.key === "`") {
				e.preventDefault()
				applyFormat("code")
			} else if (e.key === "k") {
				e.preventDefault()
				applyFormat("link")
			}
		}

		if (!multiline && e.key === "Enter") {
			e.preventDefault()
		}
	}

	const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
		const text = e.currentTarget.textContent || ""
		onChange(text, formats)
	}

	const renderFormattedContent = () => {
		if (!value) return placeholder

		const result: (string | React.ReactNode)[] = []
		let lastIndex = 0

		const sortedFormats = [...formats].sort((a, b) => a.start - b.start)

		for (const format of sortedFormats) {
			if (format.start > lastIndex) {
				result.push(value.slice(lastIndex, format.start))
			}

			const text = value.slice(format.start, format.end)
			const key = `${format.style}-${format.start}-${format.end}`

			switch (format.style) {
				case "bold":
					result.push(
						<strong key={key} className="font-semibold">
							{text}
						</strong>,
					)
					break
				case "italic":
					result.push(
						<em key={key} className="italic">
							{text}
						</em>,
					)
					break
				case "code":
					result.push(
						<code
							key={key}
							className="bg-muted px-1.5 py-0.5 rounded font-mono text-sm"
						>
							{text}
						</code>,
					)
					break
				case "link":
					result.push(
						<a
							key={key}
							href={format.data?.url}
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-500 underline hover:text-blue-600"
						>
							{text}
						</a>,
					)
					break
			}

			lastIndex = format.end
		}

		if (lastIndex < value.length) {
			result.push(value.slice(lastIndex))
		}

		return result.length > 0 ? result : placeholder
	}

	return (
		<div className="space-y-2">
			<div className="flex gap-1 border-b pb-2">
				<button
					type="button"
					onClick={() => applyFormat("bold")}
					className="p-1.5 hover:bg-muted rounded text-sm"
					title="Bold (Ctrl+B)"
				>
					<Bold className="h-4 w-4" />
				</button>
				<button
					type="button"
					onClick={() => applyFormat("italic")}
					className="p-1.5 hover:bg-muted rounded text-sm"
					title="Italic (Ctrl+I)"
				>
					<Italic className="h-4 w-4" />
				</button>
				<button
					type="button"
					onClick={() => applyFormat("code")}
					className="p-1.5 hover:bg-muted rounded text-sm"
					title="Code (Ctrl+`)"
				>
					<Code2 className="h-4 w-4" />
				</button>
				<button
					type="button"
					onClick={() => applyFormat("link")}
					className="p-1.5 hover:bg-muted rounded text-sm"
					title="Link (Ctrl+K)"
				>
					<Link2 className="h-4 w-4" />
				</button>
			</div>

			<div
				ref={editorRef}
				contentEditable
				suppressContentEditableWarning
				onInput={handleInput}
				onKeyDown={handleKeyDown}
				className="min-h-[24px] w-full resize-none bg-transparent text-base outline-hidden focus:outline-hidden placeholder:text-muted-foreground"
			>
				{renderFormattedContent()}
			</div>
		</div>
	)
}

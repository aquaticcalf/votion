"use client"

import { PageEditor } from "@/components/editor/page-editor"
import { api } from "@/trpc/react"
import { useParams } from "next/navigation"

export default function PageRoute() {
	const params = useParams()
	const pageId = params.pageId as string

	const { data: page } = api.page.get.useQuery({ id: pageId })
	const { data: blocks } = api.block.getByPage.useQuery({ pageId })

	if (!page || !blocks) {
		return <div>Loading...</div>
	}

	return (
		<div>
			<h1 className="mb-6 font-bold text-3xl">{page.title}</h1>
			<PageEditor pageId={pageId} initialBlocks={blocks} />
		</div>
	)
}

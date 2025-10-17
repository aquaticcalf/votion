import Link from "next/link"

import { Button } from "@/components/ui/button"
import { auth } from "@/server/auth"

export default async function Home() {
	const session = await auth()

	if (session?.user) {
		const { redirect } = await import("next/navigation")
		redirect("/dashboard")
	}

	return (
		<div className="flex min-h-screen flex-col bg-white">
			<nav className="border-gray-200 border-b">
				<div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
					<div className="font-semibold text-lg">Votion</div>
					<div className="flex items-center gap-8">
						<div className="hidden gap-6 sm:flex">
							<Link
								href="#"
								className="text-gray-600 text-sm hover:text-gray-900"
							>
								Features
							</Link>
							<Link
								href="#"
								className="text-gray-600 text-sm hover:text-gray-900"
							>
								Pricing
							</Link>
						</div>
						<div className="flex gap-3">
							<Link href="/login">
								<Button variant="ghost" size="sm">
									Sign in
								</Button>
							</Link>
							<Link href="/signup">
								<Button size="sm">Get started</Button>
							</Link>
						</div>
					</div>
				</div>
			</nav>

			<main className="flex-1">
				<div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-3xl text-center">
						<p className="mb-4 font-medium text-gray-600 text-sm">
							The collaborative workspace for modern teams
						</p>

						<h1 className="mb-6 font-bold text-5xl text-gray-900 tracking-tight sm:text-6xl lg:text-7xl">
							Build better together
						</h1>

						<p className="mb-10 text-gray-600 text-lg leading-relaxed">
							A beautiful, fast, and intuitive platform for teams to create,
							organize, and collaborate on documents in real-time.
						</p>

						<div className="mb-16 flex flex-col justify-center gap-4 sm:flex-row">
							<Link href="/signup">
								<Button size="lg" className="min-w-32">
									Get started
								</Button>
							</Link>
							<Link href="/login">
								<Button size="lg" variant="outline" className="min-w-32">
									Sign in
								</Button>
							</Link>
						</div>

						<div className="border-gray-200 border-t pt-12">
							<p className="mb-8 text-gray-500 text-xs">TRUSTED BY TEAMS AT</p>
							<div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
								<div className="font-semibold text-gray-400 text-sm">
									Company 1
								</div>
								<div className="font-semibold text-gray-400 text-sm">
									Company 2
								</div>
								<div className="font-semibold text-gray-400 text-sm">
									Company 3
								</div>
								<div className="font-semibold text-gray-400 text-sm">
									Company 4
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="border-gray-200 border-t bg-gray-50">
					<div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
						<div className="grid gap-12 md:grid-cols-3">
							<div>
								<h3 className="mb-3 font-semibold text-gray-900">
									Powerful collaboration
								</h3>
								<p className="text-gray-600 text-sm leading-relaxed">
									Work together in real-time with live cursors, comments, and
									version history.
								</p>
							</div>
							<div>
								<h3 className="mb-3 font-semibold text-gray-900">
									Built for speed
								</h3>
								<p className="text-gray-600 text-sm leading-relaxed">
									Optimized for performance with instant syncing and zero lag
									across all devices.
								</p>
							</div>
							<div>
								<h3 className="mb-3 font-semibold text-gray-900">
									Simple and elegant
								</h3>
								<p className="text-gray-600 text-sm leading-relaxed">
									A clean interface that gets out of your way so you can focus
									on what matters.
								</p>
							</div>
						</div>
					</div>
				</div>
			</main>

			<footer className="border-gray-200 border-t bg-white">
				<div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
					<div className="text-center text-gray-600 text-sm">
						<p>© 2025 Votion. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</div>
	)
}

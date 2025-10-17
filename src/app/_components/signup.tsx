"use client"

import { api } from "@/trpc/react"
import { signIn } from "next-auth/react"
import { useState } from "react"

export function SignupForm() {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [name, setName] = useState("")
	const [email, setEmail] = useState("")
	const [error, setError] = useState("")

	const signupMutation = api.post.signup.useMutation({
		onSuccess: async () => {
			// Auto sign in after signup
			const result = await signIn("credentials", {
				username,
				password,
				redirect: false,
			})
			if (result?.ok) {
				window.location.href = "/"
			} else {
				setError("Sign in failed after signup")
			}
		},
		onError: (err) => {
			setError(err.message)
		},
	})

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		setError("")
		signupMutation.mutate({
			username,
			password,
			name: name || undefined,
			email: email || undefined,
		})
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white"
		>
			<h3 className="font-bold text-xl">Sign Up</h3>
			{error && <p className="text-red-500">{error}</p>}
			<input
				type="text"
				placeholder="Username"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				className="rounded bg-black/20 px-2 py-1 text-white placeholder-gray-300"
				required
			/>
			<input
				type="password"
				placeholder="Password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				className="rounded bg-black/20 px-2 py-1 text-white placeholder-gray-300"
				required
			/>
			<input
				type="text"
				placeholder="Name (optional)"
				value={name}
				onChange={(e) => setName(e.target.value)}
				className="rounded bg-black/20 px-2 py-1 text-white placeholder-gray-300"
			/>
			<input
				type="email"
				placeholder="Email (optional)"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				className="rounded bg-black/20 px-2 py-1 text-white placeholder-gray-300"
			/>
			<button
				type="submit"
				className="rounded bg-[hsl(280,100%,70%)] px-4 py-2 text-white transition hover:bg-[hsl(280,100%,80%)]"
				disabled={signupMutation.isPending}
			>
				{signupMutation.isPending ? "Signing up..." : "Sign Up"}
			</button>
		</form>
	)
}

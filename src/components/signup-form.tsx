"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import type { FormEvent } from "react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { api } from "@/trpc/react"

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [passwordMatch, setPasswordMatch] = useState(true)

	const signupMutation = api.user.signup.useMutation()

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		setIsLoading(true)
		setError(null)
		setPasswordMatch(true)

		const formData = new FormData(e.currentTarget)
		const name = formData.get("name") as string
		const email = formData.get("email") as string
		const username = formData.get("username") as string
		const password = formData.get("password") as string
		const confirmPassword = formData.get("confirm-password") as string

		if (password !== confirmPassword) {
			setPasswordMatch(false)
			setIsLoading(false)
			return
		}

		try {
			await signupMutation.mutateAsync({
				name,
				email,
				username,
				password,
			})

			const result = await signIn("credentials", {
				username,
				password,
				redirect: false,
			})

			if (result?.ok) {
				router.push("/dashboard")
			} else {
				setError("Signup successful but login failed. Please login manually.")
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred")
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Card {...props}>
			<CardHeader>
				<CardTitle>Create an account</CardTitle>
				<CardDescription>
					Enter your information to create your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit}>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="name">Full Name</FieldLabel>
							<Input
								id="name"
								name="name"
								type="text"
								placeholder="John Doe"
								required
								disabled={isLoading}
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="email">Email</FieldLabel>
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="m@example.com"
								required
								disabled={isLoading}
							/>
							<FieldDescription>
								We&apos;ll use this to contact you. We will not share your email
								with anyone else.
							</FieldDescription>
						</Field>
						<Field>
							<FieldLabel htmlFor="username">Username</FieldLabel>
							<Input
								id="username"
								name="username"
								type="text"
								placeholder="your username"
								required
								disabled={isLoading}
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="password">Password</FieldLabel>
							<Input
								id="password"
								name="password"
								type="password"
								required
								disabled={isLoading}
							/>
							<FieldDescription>
								Must be at least 8 characters long.
							</FieldDescription>
						</Field>
						<Field>
							<FieldLabel htmlFor="confirm-password">
								Confirm Password
							</FieldLabel>
							<Input
								id="confirm-password"
								name="confirm-password"
								type="password"
								required
								disabled={isLoading}
							/>
							<FieldDescription>Please confirm your password.</FieldDescription>
							{!passwordMatch && (
								<div className="text-destructive text-sm">
									Passwords do not match
								</div>
							)}
						</Field>
						{error && <div className="text-destructive text-sm">{error}</div>}
						<FieldGroup>
							<Field>
								<Button type="submit" disabled={isLoading} className="w-full">
									{isLoading ? "Creating account..." : "Create Account"}
								</Button>
								<FieldDescription className="text-center">
									Already have an account? <a href="/login">Sign in</a>
								</FieldDescription>
							</Field>
						</FieldGroup>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	)
}

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
import { cn } from "@/lib/utils"

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		setIsLoading(true)
		setError(null)

		const formData = new FormData(e.currentTarget)
		const username = formData.get("username") as string
		const password = formData.get("password") as string

		try {
			const result = await signIn("credentials", {
				username,
				password,
				redirect: false,
			})

			if (result?.error) {
				setError("Invalid username or password")
			} else if (result?.ok) {
				router.push("/dashboard")
			}
		} catch (err) {
			setError("An error occurred. Please try again.")
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle>Login to your account</CardTitle>
					<CardDescription>Enter your credentials to login</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<FieldGroup>
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
								<div className="flex items-center">
									<FieldLabel htmlFor="password">Password</FieldLabel>
									<a
										href="/forgot-password"
										className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
									>
										Forgot your password?
									</a>
								</div>
								<Input
									id="password"
									name="password"
									type="password"
									required
									disabled={isLoading}
								/>
							</Field>
							{error && <div className="text-destructive text-sm">{error}</div>}
							<Field>
								<Button type="submit" disabled={isLoading} className="w-full">
									{isLoading ? "Logging in..." : "Login"}
								</Button>
								<FieldDescription className="text-center">
									Don&apos;t have an account? <a href="/signup">Sign up</a>
								</FieldDescription>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}

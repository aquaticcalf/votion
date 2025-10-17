import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs"
import type { DefaultSession, NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import { db } from "@/server/db"
import type { User } from "@prisma/client"

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string
			username?: string
			// ...other properties
			// role: UserRole;
		} & DefaultSession["user"]
	}

	// interface User {
	//   // ...other properties
	//   // role: UserRole;
	// }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				username: { label: "Username", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const username = credentials?.username as string
				const password = credentials?.password as string

				if (!username || !password) {
					return null
				}

				const user = await db.user.findUnique({
					where: { username },
				})

				if (!user || !user.password) {
					return null
				}

				const isPasswordValid = await bcrypt.compare(password, user.password)

				if (!isPasswordValid) {
					return null
				}

				return {
					id: user.id,
					email: user.email,
					name: user.name,
					username: user.username,
				}
			},
		}),
	],
	callbacks: {
		session: ({ session, token }) => ({
			...session,
			user: {
				...session.user,
				id: token.sub as string,
				username: token.username as string,
			},
		}),
		jwt: ({ token, user }) => {
			if (user) {
				token.username = (user as User).username
			}
			return token
		},
	},
} satisfies NextAuthConfig

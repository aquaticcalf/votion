import "@testing-library/jest-dom"
import { cleanup } from "@testing-library/react"
import { afterEach, expect } from "vitest"

afterEach(() => {
	cleanup()
})

expect.extend({
	toBeWithinRange(received: number, floor: number, ceiling: number) {
		const pass = received >= floor && received <= ceiling
		if (pass) {
			return {
				message: () =>
					`expected ${received} not to be within range ${floor} - ${ceiling}`,
				pass: true,
			}
		}
		return {
			message: () =>
				`expected ${received} to be within range ${floor} - ${ceiling}`,
			pass: false,
		}
	},
})

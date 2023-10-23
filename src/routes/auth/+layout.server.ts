import type { LayoutServerLoad } from "../$types"

export const load: LayoutServerLoad = async ({ locals: { getSession } }) => {
	const { session, user } = await getSession()

	// This is the data that will be available to the client as pageData, pulled via hooks.server.ts.
	return {
		session,
		user
	}
}

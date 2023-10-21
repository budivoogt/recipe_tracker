import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async ({ locals: { getSession } }) => {
	const { session, initialUser } = await getSession()

	return {
		session,
		initialUser
	}
}

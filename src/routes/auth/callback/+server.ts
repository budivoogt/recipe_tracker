import { redirect } from "@sveltejs/kit"

export const GET = async ({ url, locals: { supabase } }) => {
	const code = url.searchParams.get("code")

	if (code) {
		await supabase.auth.exchangeCodeForSession(code)
	}
	console.log("Callback code is", code)

	const next: string | null = url.searchParams.get("next") || null
	console.log("Next URL is: ", next)

	throw redirect(303, `${next || "/"}`)
}

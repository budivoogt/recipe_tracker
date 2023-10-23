import type { SupabaseClient, User } from "@supabase/supabase-js"
import { writable } from "svelte/store"

export const user = writable<User | null>()
export const supabaseStore = writable<SupabaseClient | null>()

let supabaseClient: SupabaseClient | null = null

supabaseStore.subscribe((value) => {
	supabaseClient = value
})

export const handleSignUp = async (email: string, password: string) => {
	if (!supabaseClient) return console.error("Supabase client not initialized")

	await supabaseClient.auth.signUp({
		email,
		password,
		options: {
			emailRedirectTo: `${location.origin}/auth/callback`
		}
	})
	console.log("User signed up with: ", email, password)
}

export const handleSignIn = async (email: string, password: string) => {
	if (!supabaseClient) return console.error("Supabase client not initialized")

	await supabaseClient.auth.signInWithPassword({
		email,
		password
	})
	email = ""
	console.log("User logged in with: ", email)
}

export const handleSignOut = async () => {
	if (!supabaseClient) return console.error("Supabase client not initialized")

	await supabaseClient.auth.signOut()
	console.log("User logged out")
}

import type { SupabaseClient, User } from "@supabase/supabase-js"
import { writable } from "svelte/store"

export const user = writable<User | null>()

export const handleSignUp = async (email: string, password: string, supabase: SupabaseClient) => {
	await supabase.auth.signUp({
		email,
		password,
		options: {
			emailRedirectTo: `${location.origin}/auth/callback`
		}
	})
	console.log("User signed up with: ", email, password)
}

export const handleSignIn = async (email: string, password: string, supabase: SupabaseClient) => {
	await supabase.auth.signInWithPassword({
		email,
		password
	})
	email = ""
	console.log("User logged in with: ", email)
}

export const handleSignOut = async (supabase: SupabaseClient) => {
	await supabase.auth.signOut()
	console.log("User logged out")
}

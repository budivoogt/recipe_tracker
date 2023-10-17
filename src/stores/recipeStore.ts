import { supabaseClient } from "$lib/supabaseClient"
import { writable } from "svelte/store"

export const recipes = writable<Recipe[]>([])

export async function load() {
	const { data, error } = await supabaseClient
		.from("recipes")
		.select("*")
		.order("id", { ascending: true })

	if (error) return console.error(error)
	recipes.set(data as Recipe[])
}

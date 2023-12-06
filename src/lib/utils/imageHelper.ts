import type { SupabaseClient } from "@supabase/supabase-js"
import { v4 as uuidv4 } from "uuid"

export function toSlug(str: string) {
	return (
		str
			// Convert to lowercase
			.toLowerCase()
			// Replace spaces with hyphens
			.replace(/\s+/g, "-")
			// Remove all non-word chars
			.replace(/[^\w\-]+/g, "")
			// Replace multiple hyphens with a single hyphen
			.replace(/\-\-+/g, "-")
	)
}

export async function handleFileInput(event, recipeName: string, supabase: SupabaseClient) {
	const recipeSlug: string = toSlug(recipeName)

	const file = event.target.files[0]
	if (!file) {
		console.error("No file uploaded.")
		return
	}

	const { data, error } = await supabase.storage
		.from("meal-pics")
		.upload(recipeSlug + "-" + uuidv4(), file)

	if (data) {
		// something to pull the image and upload it on the recipe.
		console.log("File uploaded successfully. Data: ", data)
		return data
	}
	if (error) {
		console.error(error)
		return
	}
}

export async function getImage(path: string, supabase: SupabaseClient) {
	const { data } = await supabase.storage.from("meal-pics").getPublicUrl(path)

	if (data) {
		return { publicUrl: data.publicUrl, path: path }
	}
}

export async function deleteImage(imagePath: string, SupabaseClient: SupabaseClient) {
	const { data, error } = await SupabaseClient.storage.from("meal-pics").remove([imagePath])

	if (data) {
		console.log("Image with path ", imagePath, " has been deleted. Data: ", data)
		return data
	}

	if (error) {
		console.error(error)
		return error
	}
}

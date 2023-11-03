// Global types that aren't specific to SvelteKit.

type Recipe = {
	id?: number
	name: string
	mealType: string
	cuisine: string
	description: string | null
	instructions: string | null
	ingredients: Ingredient[] | null
	rating: number | null
	order: number | null
}

type Ingredient = {
	item: string
	quantity: string
	acquired: boolean
}

// Global types that aren't specific to SvelteKit.

type Recipe = {
	id?: number
	name: string
	mealType: string
	cuisine: string
	description: string | null
	instructions: string | null
	servingSize: number | null
	ingredients: Ingredient[] | null
	rating: number | null
	order: number | null
	imageUrl: string | null
}

type Ingredient = {
	item: string
	quantity: string
	acquired: boolean
}

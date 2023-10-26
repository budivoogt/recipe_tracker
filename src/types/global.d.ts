// Global types that aren't specific to SvelteKit.

type Recipe = {
	id: number
	name: string
	description: string | null
	instructions: string | null
	acquired: boolean
	ingedients: {
		item: string
		quantity: string
	} | null
	order: number | null
}

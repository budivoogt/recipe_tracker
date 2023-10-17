type Recipe = {
	name: Text
	description: Text | null
	instructions: Text | null
	acquired: boolean
	ingedients: {
		item: Text
		quantity: Text
	} | null
	id: number
	order: number | null
}

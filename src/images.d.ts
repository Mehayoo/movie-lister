// handle imports that end in .png
declare module '*.png' {
	// when a .png file is imported, treate it as if it exports a string
	const content: string
	export default content
}

// handle imports that end in .jpg
declare module '*.jpg' {
	// when a .jpg file is imported, treat it as if it exports a string
	const content: string
	export default content
}

// handle imports that end in .webp
declare module '*.webp' {
	// when a .webp file is imported, treat it as if it exports a string
	const content: string
	export default content
}

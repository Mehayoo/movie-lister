export const createSearchUrl = (term: string, contextPath: string): string =>
	`/search-results?query=${encodeURIComponent(term)}&context=${contextPath}`

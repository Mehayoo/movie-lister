import { ContextSearchEnum, PathContext, PathEnum } from '../constants'

export type PathContextMappingType = {
	[P in Exclude<ContextSearchEnum, ContextSearchEnum.ALL>]: PathEnum
}
// [P in ...] iterates over each member of the type produced by Exclude<ContextSearchEnum, ContextSearchEnum.ALL>
// For each member P, the type of the property is set to PathEnum.

export const pathContextMapping: PathContextMappingType = {
	[ContextSearchEnum.CATEGORY]: PathEnum.CATEGORY,
	[ContextSearchEnum.FAVORITES]: PathEnum.FAVORITES,
	[ContextSearchEnum.SEARCH]: PathEnum.SEARCH,
}

export const getContextFromPath = (pathname: string): PathContext => {
	let context: string = ContextSearchEnum.ALL
	let dynamicValue: string | null = null

	for (const [ctx, pathPattern] of Object.entries(pathContextMapping)) {
		const regex: RegExp = new RegExp(`^${pathPattern}$`)
		const match: RegExpExecArray | null = regex.exec(pathname)

		if (match) {
			context = ctx
			dynamicValue = match[1]
			break
		}
	}

	return { context, dynamicValue }
}

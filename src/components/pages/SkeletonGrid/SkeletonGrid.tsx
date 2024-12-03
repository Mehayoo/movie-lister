import { Grid, Skeleton } from '../..'
import { SkeletonGridProps } from './types'

const SkeletonGrid = ({ count = 12 }: SkeletonGridProps) => {
	return (
		<Grid>
			{Array.from({ length: count }).map((_, index: number) => (
				<Skeleton key={index} />
			))}
		</Grid>
	)
}

export default SkeletonGrid

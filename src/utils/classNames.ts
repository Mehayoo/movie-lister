import { ClassNameInitilizer, withNaming } from '@bem-react/classname'

const cn: ClassNameInitilizer = withNaming({
	n: 'ema-',
	e: '__',
	m: '--',
	v: '--',
})

export default cn

import Dynamic from '../Dynamic'
import Caret from '../Caret'
import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import styles from './index.module.scss'

function Parsed({
	parsed,
	caret,
	onSetCaret,
	onScroll,
	onPointerEnter,
}, _ref) {
	const ref = useRef(null)
	useImperativeHandle(_ref, () => ref.current)

	useEffect(() => {
		const {current} = ref
		current.addEventListener('select:range', onSetCaret)
		return () => {
			current.removeEventListener('select:range', onSetCaret)
		}
	}, [onSetCaret])

	const preventFocusSteal = (e) => {
		e.preventDefault()
	}

	return (
		<div
			ref={ref}
			className={styles.parsed}
			onMouseDown={preventFocusSteal}
			onScroll={onScroll}
			onPointerEnter={onPointerEnter}
		>
			<Caret caret={caret}>
				<Dynamic {...parsed}/>
			</Caret>
		</div>
	)
}

export default forwardRef(Parsed)
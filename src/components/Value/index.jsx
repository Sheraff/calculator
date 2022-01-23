import styles from './index.module.scss'
import classNames from 'classnames'
import { useContext, useEffect, useRef, useState } from 'react'
import { CaretContext } from '../Caret'

export default function Value({
	value = null,
	children,
	inputRange,
	outputRange,
	invalid = false
}) {
	const [selfHover, setSelfHover] = useState(false)
	const [childHover, setChildHover] = useState(false)
	const caret = useContext(CaretContext)
	const hover = selfHover && !childHover
	const active = caret && outputRange && outputRange[0] === caret[0] && outputRange[1] === caret[1]
	const ref = useRef(null)

	const onMouseEnter = (e) => {
		setSelfHover(true)
		const self = e.target.closest(`.${CSS.escape(styles.value)}`) === e.currentTarget
		if (self) {
			e.stopPropagation()
			ref.current.dispatchEvent(new CustomEvent('hover:start', {bubbles: true}))
		}
	}
	const onMouseLeave = () => {
		setSelfHover(false)
		ref.current.dispatchEvent(new CustomEvent('hover:end', {bubbles: true}))
	}

	useEffect(() => {
		const {current} = ref
		const onHoverStart = (e) => {
			if (e.target !== current) {
				setChildHover(true)
			}
		}
		const onHoverEnd = (e) => {
			if (e.target !== current) {
				setChildHover(false)
				e.stopPropagation()
			}
		}
		current.addEventListener('hover:start', onHoverStart)
		current.addEventListener('hover:end', onHoverEnd)
		return () => {
			current.removeEventListener('hover:start', onHoverStart)
			current.removeEventListener('hover:end', onHoverEnd)
		}
	}, [])

	const onClick = () => {
		if (hover) {
			ref.current.dispatchEvent(new CustomEvent('select:range', {
				bubbles: true,
				detail: inputRange
			}))
		}
	}

	return (
		<span
			ref={ref}
			className={classNames(styles.value, {
				[styles.hover]: hover,
				[styles.active]: active,
				[styles.invalid]: invalid,
			})}
			title={value ? String(value) : null}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onClick={onClick}
		>
			{children}
		</span>
	)
}
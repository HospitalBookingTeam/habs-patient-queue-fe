import { ReactNode, useCallback, useEffect, useState } from 'react'
import { atom, useRecoilState } from 'recoil'

export type ToastState = {
	message: ReactNode
	title: ReactNode
	variant: 'success' | 'error'
	open?: boolean
}

export const toastAtom = atom<ToastState>({
	key: 'toast',
	default: {
		message: '',
		title: 'Lỗi',
		variant: 'error',
		open: false,
	},
})

const useToast = () => {
	const [toastData, setToastData] = useRecoilState(toastAtom)

	const closeToast = useCallback(() => {
		setToastData((toast) => ({ ...toast, open: false }))
	}, [])

	const toastError = useCallback(
		({ message, title }: { message: ReactNode; title?: ReactNode }) => {
			console.log('message', message)
			setToastData({
				message,
				title: title ?? 'Lỗi',
				variant: 'error',
				open: true,
			})
		},
		[]
	)

	useEffect(() => {
		let timeout: NodeJS.Timeout
		if (toastData?.open) timeout = setTimeout(() => closeToast(), 5000)

		return () => clearTimeout(timeout)
	}, [toastData?.open, closeToast])

	return { open: toastData?.open, closeToast, toastData, toastError }
}

export default useToast

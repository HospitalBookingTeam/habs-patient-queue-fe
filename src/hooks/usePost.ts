import { useEffect, useState } from 'react'
import apiHelper from '../utils/apiHelper'
import useToast from './useToast'

type PostProps = {
	endpoint: string
	payload?: { [key: string]: any }
	onSuccess?: (data: any) => void
}
const usePost = <T>({ endpoint, payload, onSuccess }: PostProps) => {
	const [isLoading, setIsLoading] = useState(false)
	const [isSuccess, setIsSuccess] = useState(false)

	const { toastError } = useToast()

	const post = async () => {
		try {
			setIsLoading(true)
			const result = await apiHelper.post(endpoint, { ...payload })
			setIsSuccess(true)
			onSuccess?.(result?.data as T)
		} catch (error) {
			console.error(error)
			toastError({ message: error as string })
			setIsSuccess(false)
		} finally {
			setIsLoading(false)
		}
	}

	return { isLoading, isSuccess, post }
}

export default usePost

import { useEffect, useState } from 'react'
import apiHelper from '../utils/apiHelper'

type QueryProps = {
	endpoint: string
	params?: { [key: string]: any }
	enabled?: boolean
}
const useQuery = <T>({ endpoint, params, enabled = true }: QueryProps) => {
	const [isLoading, setIsLoading] = useState(false)
	const [isSuccess, setIsSuccess] = useState(false)

	const [data, setData] = useState<T | undefined>(undefined)

	const query = async () => {
		try {
			setIsLoading(true)
			const result = await apiHelper.get(endpoint, { params })
			setData(result?.data as T)
			setIsSuccess(true)
		} catch (error) {
			console.error(error)
			setIsSuccess(false)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (!enabled) return
		query()
	}, [enabled])

	return { isLoading, isSuccess, data, query }
}

export default useQuery

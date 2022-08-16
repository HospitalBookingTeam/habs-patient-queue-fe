import axios from 'axios'

const apiHelper = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API,
	timeout: 120000,
})

export default apiHelper

export const doctorApiHelper = axios.create({
	baseURL: process.env.NEXT_PUBLIC_DOCTOR_API,
	timeout: 120000,
})

apiHelper.interceptors.request.use((config) => {
	if (!config?.headers) return
	if (typeof window !== 'undefined') {
		const { auth: authData } = JSON.parse(
			window.localStorage?.getItem('recoil-persist') ?? '{}'
		)
		if (!authData?.token) return config
		config.headers.Authorization = `Bearer ${authData?.token as string}`
		console.log('config', config)
	}
	return config
})

apiHelper.interceptors.response.use(
	(response) => {
		return response
	},
	(error) => {
		return Promise.reject(error?.response?.data)
	}
)

doctorApiHelper.interceptors.response.use(
	(response) => {
		return response
	},
	(error) => {
		return Promise.reject(error?.response?.data)
	}
)

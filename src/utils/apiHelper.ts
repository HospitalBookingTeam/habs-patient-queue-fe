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

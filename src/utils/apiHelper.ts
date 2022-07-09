import axios from 'axios'

const apiHelper = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API,
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

export default apiHelper

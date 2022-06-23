import axios from 'axios'

const apiHelper = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API,
	timeout: 5000,
})

apiHelper.interceptors.response.use((response) => {
	return response
})

export default apiHelper

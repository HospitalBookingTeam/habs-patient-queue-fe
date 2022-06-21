import { useEffect, useState } from 'react'
import { NAME_CONFIG } from '../utils/constants'
import { getStorageItem, setStorageItem } from '../utils/storage'

const useAuth = () => {
	const tokenStorage =
		typeof window !== undefined ? getStorageItem(NAME_CONFIG.TOKEN) : null
	const [token, setToken] = useState(tokenStorage)
	const [isAuthenticated, setIsAuthenticated] = useState(!!tokenStorage)

	const logout = () => {
		setStorageItem(NAME_CONFIG.TOKEN, '')
		setToken('')
		setIsAuthenticated(false)
	}

	const login = (_token: string) => {
		setToken(_token)
		setStorageItem(NAME_CONFIG.TOKEN, _token)
	}

	useEffect(() => {
		setIsAuthenticated(!!token && token !== '')
	}, [token, setIsAuthenticated])

	return { isAuthenticated, token, logout, login }
}

export default useAuth

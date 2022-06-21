import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import apiHelper from '../../utils/apiHelper'
import { NAME_CONFIG } from '../../utils/constants'
import { getStorageItem, setStorageItem } from '../../utils/storage'
import { useRouter } from 'next/router'
import { recoilPersist } from 'recoil-persist'
import { atom } from 'recoil'

const { persistAtom } = recoilPersist()

export type AuthData = {
	token: string
	isAuthenticated: boolean
}

export const authAtom = atom<AuthData>({
	key: 'auth',
	default: {
		token: '',
		isAuthenticated: false,
	},
	effects_UNSTABLE: [persistAtom],
})

const useAuth = () => {
	const router = useRouter()
	const [loading, setLoading] = useState(true)
	const [authData, setAuthData] = useRecoilState(authAtom)

	const logout = () => {
		setAuthData({ token: '', isAuthenticated: false })
	}

	const login = (_token: string) => {
		setAuthData({ token: _token, isAuthenticated: true })
	}

	useEffect(() => {
		if (!authData.isAuthenticated) {
			return
		}
		apiHelper.interceptors.request.use((config) => {
			if (!config?.headers) return
			config.headers.Authorization = `Bearer ${authData.token}`
			return config
		})
	}, [authData, router])

	return { ...authData, logout, login, loading }
}

export default useAuth

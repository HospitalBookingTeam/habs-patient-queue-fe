import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import apiHelper from '../utils/apiHelper'
import { NAME_CONFIG } from '../utils/constants'
import { useRouter } from 'next/router'
import { recoilPersist } from 'recoil-persist'
import { atom } from 'recoil'

const { persistAtom } = recoilPersist()

export type AuthInformation = {
	id: number
	username: string
	type: number
	name: string
	phoneNo: string
}

export type AuthData = {
	token: string
	isAuthenticated: boolean
	roomId?: number
	information?: AuthInformation
}

const DEFAULT_STATE: AuthData = {
	token: '',
	isAuthenticated: false,
	roomId: undefined,
	information: undefined,
}
export const authAtom = atom<AuthData>({
	key: 'auth',
	default: DEFAULT_STATE,
	effects_UNSTABLE: [persistAtom],
})

const useAuth = () => {
	const router = useRouter()
	const [loading, setLoading] = useState(true)
	const [authData, setAuthData] = useRecoilState(authAtom)

	const logout = () => {
		setAuthData(DEFAULT_STATE)
	}

	const login = (
		_token: string,
		_roomId: number,
		_information: AuthInformation
	) => {
		setAuthData({
			token: _token,
			isAuthenticated: true,
			roomId: _roomId,
			information: _information,
		})
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

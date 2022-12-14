import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import apiHelper from '../utils/apiHelper'
import { NAME_CONFIG } from '../utils/constants'
import { useRouter } from 'next/router'
import { recoilPersist } from 'recoil-persist'
import { atom } from 'recoil'
import { setCookies } from 'cookies-next'
import { RoomData } from '../entities/room'

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
	room?: RoomData
	information?: AuthInformation
}

const DEFAULT_STATE: AuthData = {
	token: '',
	isAuthenticated: false,
	roomId: undefined,
	room: undefined,
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
		// apiHelper.interceptors.request.use((config) => {
		// 	if (!config?.headers) return
		// 	config.headers.Authorization = false
		// 	return config
		// })
	}

	const login = (
		_token: string,
		_roomId: number,
		_room: RoomData,
		_information: AuthInformation
	) => {
		setAuthData({
			token: _token,
			isAuthenticated: true,
			roomId: _roomId,
			room: _room,
			information: _information,
		})
		// apiHelper.interceptors.request.use((config) => {
		// 	if (!config?.headers) return
		// 	config.headers.Authorization = `Bearer ${_token}`
		// 	console.log('config', config)
		// 	return config
		// })
		router.push('/')
	}

	return { ...authData, logout, login, loading }
}

export default useAuth

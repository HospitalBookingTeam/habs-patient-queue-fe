import { NAME_CONFIG } from './constants'

export const getStorageItem = (item: string) => {
	return window.localStorage.getItem(item)
}

export const setStorageItem = (item: string, value: string) => {
	return window.localStorage.setItem(item, value)
}

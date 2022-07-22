import { atom, useRecoilState } from 'recoil'

export type CheckupState = {
	isLoading: boolean
}

const DEFAULT_STATE: CheckupState = {
	isLoading: false,
}

export const checkupAtom = atom<CheckupState>({
	key: 'checkup',
	default: DEFAULT_STATE,
})

export const useCheckupState = () => {
	const [checkupState, setCheckupState] = useRecoilState(checkupAtom)

	return { checkupState, setCheckupState }
}

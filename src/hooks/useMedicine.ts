import { atom, useRecoilState } from 'recoil'

export type MedicineState = {
	isLoading: boolean
}

const DEFAULT_STATE: MedicineState = {
	isLoading: false,
}

export const medicineAtom = atom<MedicineState>({
	key: 'medicine',
	default: DEFAULT_STATE,
})

export const useMedicineState = () => {
	const [medicineState, setMedicineState] = useRecoilState(medicineAtom)

	return { medicineState, setMedicineState }
}

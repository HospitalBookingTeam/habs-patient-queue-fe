export interface MedicineData {
	id: number
	name: string
	usage: string
	status: number
	unit: string
	note: string
	manufacturer: string
	manufacturingCountry: string
	medicineCategoryId: number
	medicineCategory: string
}

export interface MedicineDetailData {
	quantity: number
	usage: string
	morningDose: number
	middayDose: number
	eveningDose: number
	nightDose: number
	medicineId: number
	medicineName: string
}

export interface MedicineRequestData {
	note: string
	details: MedicineDetailData[]
}

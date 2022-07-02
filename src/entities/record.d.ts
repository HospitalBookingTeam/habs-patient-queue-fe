import { CheckupRecordStatus } from '../utils/renderEnums'

export interface PatientData {
	id: number
	phoneNumber: string
	name: string
	gender: number
	dateOfBirth: string
	address: string
	bhyt: string
}

export interface TestRecordData {
	id: number
	date: string
	numericalOrder: number
	status: number
	resultFileLink: string
	patientName: string
	operationId: number
	operationName: string
	roomNumber: string
	floor: string
	roomId: number
	patientId: number
	checkupRecordId: number
	doctorName: any
	doctorId: any
}

export interface DetailData {
	id: number
	quantity: number
	usage: string
	unit: string
	morningDose: number
	middayDose: number
	eveningDose: number
	nightDose: number
	medicineName: string
	prescriptionId: number
	medicineId: number
}

export interface PrescriptionData {
	id: number
	timeCreated: string
	note: string
	checkupRecordId: number
	details: DetailData[]
}

export interface CheckupRecordData {
	patientData: PatientData
	testRecords: TestRecordData[]
	prescription: PrescriptionData
	id: number
	status: number
	numericalOrder: number
	estimatedStartTime: string
	reExamDate: string
	date: string
	clinicalSymptom: string
	diagnosis: string
	doctorAdvice: string
	pulse: number
	bloodPressure: number
	temperature: number
	doctorName: string
	patientName: string
	departmentName: string
	patientId: number
	doctorId: number
	departmentId: number
	icdDiseaseId: number
	icdDiseaseName: string
	icdCode: string
	isReExam: boolean
}

export type RecordItemData = {
	id: number
	status: CheckupRecordStatus
	numericalOrder: any
	date: any
	doctorName: any
	patientName: string
	departmentName: any
	isReExam: boolean
}

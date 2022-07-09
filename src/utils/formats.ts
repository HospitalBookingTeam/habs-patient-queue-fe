import moment from 'moment'
import { MedData } from '../pages/queue/components/CheckupTab/Medicine'

export const formatDate = (date: string, format = 'DD/MM/YYYY') => {
	return moment(date).format(format)
}

export const formatCurrency = (amount: number | string) => {
	return new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
	}).format(Number(amount))
}

export const renderDoseContent = (med: MedData) => {
	let morning = ''
	let midday = ''
	let evening = ''
	let night = ''

	if (med.morningDose > 0) {
		morning = `${med.morningDose} sáng`
	}
	if (med.middayDose > 0) {
		midday = `${med.middayDose} trưa`
	}
	if (med.eveningDose > 0) {
		evening = `${med.eveningDose} chiều`
	}
	if (med.nightDose > 0) {
		night = `${med.nightDose} tối`
	}
	return [morning, midday, evening, night]
		.filter((day) => day !== '')
		.join(', ')
}

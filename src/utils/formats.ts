import moment from 'moment'

export const formatDate = (date: string, format = 'DD/MM/YYYY') => {
	return moment(date).format(format)
}

export const formatCurrency = (amount: number | string) => {
	return new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
	}).format(Number(amount))
}

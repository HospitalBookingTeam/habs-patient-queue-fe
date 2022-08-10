import moment, { Moment } from 'moment'
import { ClipboardEvent } from 'react'

export const formatDate = (date: string, format = 'DD/MM/YYYY') => {
	return moment(date).format(format)
}

export const formatCurrency = (amount: number | string) => {
	return new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
	}).format(Number(amount))
}

export function getGreetingTime(m: Moment) {
	var g = null //return g

	if (!m || !m.isValid()) {
		return
	} //if we can't find a valid or filled moment, we return.

	var split_afternoon = 12 //24hr time to split the afternoon
	var split_evening = 17 //24hr time to split the evening
	var currentHour = parseFloat(m.format('HH'))

	if (currentHour >= split_afternoon && currentHour <= split_evening) {
		g = 'Chiều'
	} else if (currentHour >= split_evening) {
		g = 'Tối'
	} else {
		g = 'Sáng'
	}

	return g
}

// export const isCustomEvent = (event: Event): event is ClipboardEvent<any> => {
// 	return 'detail' in event
// }

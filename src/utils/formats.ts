import moment, { Moment } from 'moment'
import { ClipboardEvent } from 'react'
import { Option } from '../components/FormElements/ControlledAutocomplete'
import { RoomData } from '../entities/room'

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

export const formatRoomListToOptionList = (rooms: RoomData[]): Option[] =>
	rooms.map((room: RoomData) => ({
		label: `${room.roomTypeName}${
			room?.departmentName ? ` ${room.departmentName.toLowerCase()}` : ''
		} ${room.roomNumber} - Tầng ${room.floor}`,
		value: room.id?.toString(),
		...room,
	}))

// export const isCustomEvent = (event: Event): event is ClipboardEvent<any> => {
// 	return 'detail' in event
// }

import type { NextPage } from 'next'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Link from '../../Link'
import PageLayout from '../../components/PageLayout'
import BasicMeta from '../../components/meta/BasicMeta'
import OpenGraphMeta from '../../components/meta/OpenGraphMeta'
import { PaginationData } from '../../entities/base'
import { atom, selectorFamily, useRecoilState, useRecoilValue } from 'recoil'
import { useEffect } from 'react'
import apiHelper from '../../../utils/apiHelper'
import Error from 'next/error'
import { authAtom } from '../../hooks/useAuth'

export type QueueDetailData = {
	id: number
	status: number
	numericalOrder: number
	estimatedStartTime: string
	patientName: string
	patientId: number
}
export type QueueData = {
	data: QueueDetailData[]
} & PaginationData

const DEFAULT_STATE: QueueData = {
	data: [],
	pageIndex: 0,
	pageSize: 0,
	totalItem: 0,
	totalPage: 0,
}

export const queueAtom = atom<QueueData>({
	key: 'queue',
	default: DEFAULT_STATE,
})

const queueQuery = selectorFamily({
	key: 'queue',
	get: (roomId: number) => async () => {
		try {
			const response = await apiHelper.get('checkup-queue', {
				params: { 'room-id': roomId },
			})
			return response
		} catch (error) {
			console.log(error)
		}
	},
})

const Queue: NextPage = () => {
	const url = '/queue'
	const title = 'Hàng chờ'

	const authData = useRecoilValue(authAtom)
	const queueData = useRecoilValue(queueQuery(authData?.roomId ?? 0))

	return (
		<PageLayout>
			<BasicMeta url={url} title={title} />
			<OpenGraphMeta url={url} title={title} />
			<Typography variant="h4" component="h1" gutterBottom>
				Hàng chờ bệnh nhân
			</Typography>
		</PageLayout>
	)
}

export default Queue

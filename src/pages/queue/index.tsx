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
import { useEffect, useState } from 'react'
import apiHelper from '../../utils/apiHelper'
import Error from 'next/error'
import { authAtom } from '../../hooks/useAuth'
import { Divider, Paper, Stack } from '@mui/material'
import styled from '@emotion/styled'
import { renderEnumCheckupRecordStatus } from '../../utils/renderEnums'
import { getCookie } from 'cookies-next'

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

const DEFAULT_QUEUE_STATE: QueueData = {
	data: [],
	pageIndex: 0,
	pageSize: 0,
	totalItem: 0,
	totalPage: 0,
}

export const queueAtom = atom<QueueData>({
	key: 'queue',
	default: DEFAULT_QUEUE_STATE,
})

const Item = styled(Paper)(({ theme }) => ({
	textAlign: 'center',
	color: '#1C1B1F',
	height: 60,
	lineHeight: '60px',
	background: '#f9f9f9',
	padding: '12px 1rem',
	cursor: 'pointer',
	position: 'relative',
	'&:hover': {
		background: '#fff',
	},
}))

const CustomLink = styled(Link)`
	position: absolute;
	top: 0;
	right: 0;
	width: 100%;
	height: 100%;
`

const Queue: NextPage = () => {
	const url = '/queue'
	const title = 'Hàng chờ'

	const [queueData, setQueueData] = useState<QueueData>(DEFAULT_QUEUE_STATE)
	const authData = useRecoilValue(authAtom)

	useEffect(() => {
		const queryQueueData = async () => {
			try {
				const response = await apiHelper.get('checkup-queue', {
					params: { 'room-id': authData?.roomId },
				})
				setQueueData(response?.data)
			} catch (error) {
				console.log(error)
			}
		}
		if (!authData?.roomId) return
		queryQueueData()
	}, [authData])

	return (
		<PageLayout>
			<BasicMeta url={url} title={title} />
			<OpenGraphMeta url={url} title={title} />
			<Typography variant="h4" component="h1" gutterBottom>
				Hàng chờ bệnh nhân
			</Typography>

			<Box mt={3}>
				<Stack
					direction="column"
					divider={<Divider orientation="horizontal" flexItem />}
					spacing={2}
				>
					{queueData &&
						queueData?.data?.map((queue: QueueDetailData) => (
							<Item key={queue?.numericalOrder}>
								<Stack
									width={'100%'}
									height={'100%'}
									alignItems={'center'}
									justifyContent={'space-between'}
									direction="row"
								>
									<Typography>{queue?.numericalOrder}</Typography>
									<Typography fontWeight={'bold'}>
										{queue?.patientName}
									</Typography>
									<Typography>
										{renderEnumCheckupRecordStatus(queue?.status)}
									</Typography>
								</Stack>
								<CustomLink href={`/queue/${queue?.patientId}`} />
							</Item>
						))}
				</Stack>
			</Box>
		</PageLayout>
	)
}

export default Queue

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
import useAuth, { authAtom } from '../../hooks/useAuth'
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
	isReExam: boolean
}

const DEFAULT_QUEUE_STATE: QueueDetailData[] = []

export const queueAtom = atom<QueueDetailData[]>({
	key: 'queue',
	default: DEFAULT_QUEUE_STATE,
})

const Item = styled(Link)(({ theme }) => ({
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
	textDecoration: 'none',
}))

const Queue: NextPage = () => {
	const url = '/queue'
	const title = 'Hàng chờ'

	const [queueData, setQueueData] =
		useState<QueueDetailData[]>(DEFAULT_QUEUE_STATE)
	const { roomId } = useAuth()

	useEffect(() => {
		const queryQueueData = async () => {
			try {
				const response = await apiHelper.get('checkup-queue', {
					params: { 'room-id': roomId },
				})
				setQueueData(response?.data)
			} catch (error) {
				console.log(error)
			}
		}
		if (!roomId) return
		queryQueueData()
	}, [roomId])

	return (
		<PageLayout>
			<BasicMeta url={url} title={title} />
			<OpenGraphMeta url={url} title={title} />
			<Typography variant="h4" component="h1" gutterBottom>
				Bệnh nhân chờ khám
			</Typography>

			<Box mt={3}>
				<Stack
					width={'100%'}
					height={'100%'}
					alignItems={'center'}
					justifyContent={'space-between'}
					direction="row"
					padding="12px 1rem"
					color="GrayText"
				>
					<Typography flex="1 1 10%">STT</Typography>
					<Typography textAlign={'left'} flex="1 1 60%">
						Họ Tên
					</Typography>
					<Typography flex="1 1 30%">Trạng thái</Typography>
				</Stack>

				{/* List */}
				<Stack
					direction="column"
					divider={<Divider orientation="horizontal" flexItem />}
					spacing={2}
				>
					{queueData &&
						queueData?.map((queue: QueueDetailData) => (
							<Item key={queue?.numericalOrder} href={`/queue/${queue?.id}`}>
								<Stack
									width={'100%'}
									height={'100%'}
									alignItems={'center'}
									justifyContent={'space-between'}
									direction="row"
								>
									<Typography flex="1 1 10%" textAlign={'left'}>
										{queue?.numericalOrder}
									</Typography>
									<Typography
										fontWeight={'bold'}
										textAlign={'left'}
										flex="1 1 60%"
									>
										{queue?.patientName}
									</Typography>
									<Typography flex="1 1 30%" textAlign={'left'}>
										{renderEnumCheckupRecordStatus(queue?.status)}
									</Typography>
								</Stack>
							</Item>
						))}
				</Stack>
			</Box>
		</PageLayout>
	)
}

export default Queue

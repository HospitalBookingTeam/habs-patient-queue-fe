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
import {
	CheckupRecordStatus,
	renderEnumCheckupRecordStatus,
	translateCheckupRecordStatus,
} from '../../utils/renderEnums'
import { getCookie } from 'cookies-next'
import moment from 'moment'
import { formatDate, getGreetingTime } from '../../utils/formats'
import { RoomData } from '../../entities/room'

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
	transition: 'background 0.3s ease',
	'&:hover': {
		background: 'rgb(135, 234, 177)',
	},
	textDecoration: 'none',
}))

const Queue: NextPage = () => {
	const url = '/queue'
	const title = 'Hàng chờ'

	const [queueData, setQueueData] =
		useState<QueueDetailData[]>(DEFAULT_QUEUE_STATE)
	const [roomData, setRoomData] = useState<RoomData | undefined>(undefined)
	const { roomId, room } = useAuth()

	const isQueueNotEmpty = queueData && queueData?.length

	useEffect(() => {
		const queryQueueData = async () => {
			try {
				const response = await apiHelper.get('checkup-queue', {
					params: { 'room-id': roomId },
				})
				setQueueData(response?.data)
			} catch (error) {
				console.error(error)
			}
		}
		if (!roomId) return
		queryQueueData()
	}, [roomId])

	useEffect(() => {
		setRoomData(room)
	}, [room])

	return (
		<PageLayout>
			<BasicMeta url={url} title={title} />
			<OpenGraphMeta url={url} title={title} />

			<Paper sx={{ p: 3 }}>
				<StyledGradientTypo fontWeight="medium" mb={3}>
					Bệnh nhân chờ khám - {roomData?.roomTypeName ?? '---'}{' '}
					{roomData?.departmentName?.toLowerCase()}{' '}
					{roomData?.roomNumber ?? '---'} - Tầng {roomData?.floor ?? '---'}
				</StyledGradientTypo>
				<Stack
					width={'100%'}
					height={'100%'}
					alignItems={'center'}
					justifyContent={'space-between'}
					direction="row"
					padding="12px 1rem"
					color="GrayText"
					display={isQueueNotEmpty ? 'flex' : 'none'}
				>
					<Typography flex="0 1 5%" textAlign={'center'}>
						STT
					</Typography>
					<Typography textAlign={'left'} flex={'2 1 auto'} pl={2}>
						Họ Tên
					</Typography>
					<Typography flex="0 1 30%">Trạng thái</Typography>
					{roomData?.isGeneralRoom && (
						<Typography flex="0 1 20%">Thời gian dự kiến</Typography>
					)}
				</Stack>

				{/* List */}
				<Stack
					direction="column"
					divider={<Divider orientation="horizontal" flexItem />}
					spacing={2}
				>
					{isQueueNotEmpty ? (
						queueData?.map((queue: QueueDetailData) => (
							<Item key={queue?.numericalOrder} href={`/queue/${queue?.id}`}>
								<Stack
									width={'100%'}
									height={'100%'}
									alignItems={'center'}
									justifyContent={'space-between'}
									direction="row"
								>
									<Typography flex="0 1 5%" textAlign={'center'}>
										{queue?.numericalOrder}
									</Typography>
									<Typography
										fontWeight={'bold'}
										textAlign={'left'}
										flex={'2 1 auto'}
										pl={2}
									>
										{queue?.patientName}
									</Typography>
									<Typography flex="0 1 30%" textAlign={'left'}>
										{translateCheckupRecordStatus(
											queue?.status,
											queue?.isReExam
										)}
									</Typography>
									{roomData?.isGeneralRoom && (
										<Typography flex="0 1 20%" textAlign={'left'}>
											{formatDate(queue?.estimatedStartTime, 'HH:mm')}
										</Typography>
									)}
								</Stack>
							</Item>
						))
					) : (
						<Box p={6} mx="auto">
							<Typography>Chưa có dữ liệu</Typography>
						</Box>
					)}
				</Stack>
			</Paper>
		</PageLayout>
	)
}

const StyledGradientTypo = styled(Typography)`
	font-size: 32px;
	background: -webkit-linear-gradient(#1ac88a, #2f9d67);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
`

export default Queue

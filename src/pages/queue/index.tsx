import type { NextPage } from 'next'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import PageLayout from '../../components/PageLayout'
import BasicMeta from '../../components/meta/BasicMeta'
import OpenGraphMeta from '../../components/meta/OpenGraphMeta'
import { useEffect, useRef, useState } from 'react'
import apiHelper from '../../utils/apiHelper'
import useAuth from '../../hooks/useAuth'
import { Divider, Paper, Skeleton, Stack } from '@mui/material'
import { translateCheckupRecordStatus } from '../../utils/renderEnums'
import { formatDate } from '../../utils/formats'
import { RoomData } from '../../entities/room'
import {
	HiddenForm,
	Item,
	StyledGradientTypo,
} from '../../components/views/queue/styled'
import { useForm } from 'react-hook-form'
import { TestRecordData } from '../../entities/record'
import {
	TestQueueTitle,
	QueueItem,
	QueueTitle,
	TestQueueItem,
} from '../../components/views/queue'
import { ROOM_TYPE } from '../../utils/constants'

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

const SkeletonItems = () => (
	<>
		<Skeleton height={40} width="100%"></Skeleton>
		{Array(3)
			.fill(0)
			.map((_, index) => (
				<Skeleton width="100%" height="100%" key={index}>
					<Item />
				</Skeleton>
			))}
	</>
)

const Queue: NextPage = () => {
	const url = '/queue'
	const title = 'Hàng chờ'

	const [queueData, setQueueData] =
		useState<QueueDetailData[]>(DEFAULT_QUEUE_STATE)
	const [testQueueData, setTestQueueData] = useState<TestRecordData[]>([])

	const [isLoadingQueue, setIsLoadingQueue] = useState(false)
	const [roomData, setRoomData] = useState<RoomData | undefined>(undefined)
	const { roomId, room, logout } = useAuth()

	const isExamRoom = room?.roomTypeId === ROOM_TYPE.EXAM
	const { handleSubmit, register, setFocus, reset } = useForm({
		defaultValues: {
			qrCode: '',
		},
	})

	const isQueueNotEmpty = isExamRoom
		? queueData && !!queueData?.length
		: testQueueData && !!testQueueData?.length

	const getQueueData = async () => {
		if (isExamRoom) {
			const resp = await apiHelper.get('checkup-queue', {
				params: { 'room-id': roomId },
			})

			setQueueData(resp?.data)
			return
		}
		const testQueueResp = await apiHelper.get('test-queue')

		setTestQueueData(testQueueResp?.data)
	}
	const onSubmit = async (values: { qrCode: string }) => {
		const { qrCode } = values
		try {
			await apiHelper.post('checkin', {
				qrCode,
			})
			if (!roomId) return

			await getQueueData()
		} catch (error) {
			console.error(error)
		} finally {
			reset()
		}
	}

	useEffect(() => {
		const queryQueueData = async () => {
			try {
				setIsLoadingQueue(true)

				await getQueueData()
			} catch (error) {
				console.error(error)
			} finally {
				setIsLoadingQueue(false)
			}
		}
		if (!roomId) return
		queryQueueData()
	}, [roomId])

	useEffect(() => {
		setRoomData(room)
	}, [room])

	useEffect(() => {
		if (!setFocus) return
		setFocus('qrCode')
	}, [setFocus])

	return (
		<PageLayout>
			<BasicMeta url={url} title={title} />
			<OpenGraphMeta url={url} title={title} />
			<HiddenForm onSubmit={handleSubmit(onSubmit)}>
				<input
					{...register('qrCode')}
					type="text"
					onBlur={() => setFocus('qrCode')}
					autoFocus
					autoComplete="off"
				/>
				<button hidden type="submit" />
			</HiddenForm>
			<Paper sx={{ p: 3, minHeight: '100%' }}>
				<Stack
					justifyContent={'space-between'}
					direction="row"
					alignItems={'center'}
					mb={3}
				>
					<StyledGradientTypo fontWeight="medium">
						{roomData?.roomTypeName ?? '---'}{' '}
						{roomData?.departmentName?.toLowerCase()}{' '}
						{roomData?.roomNumber ?? '---'} - Tầng {roomData?.floor ?? '---'}
					</StyledGradientTypo>

					<Button
						color="inherit"
						variant="contained"
						size="small"
						onClick={logout}
					>
						Đăng xuất
					</Button>
				</Stack>
				{isExamRoom ? (
					<QueueTitle
						isQueueNotEmpty={isQueueNotEmpty}
						isGeneralRoom={room?.isGeneralRoom}
					/>
				) : (
					<TestQueueTitle />
				)}

				{/* List */}
				<Stack
					direction="column"
					divider={<Divider orientation="horizontal" flexItem />}
					spacing={2}
				>
					{isQueueNotEmpty ? (
						isExamRoom ? (
							queueData?.map((queue: QueueDetailData, index) => (
								<QueueItem
									key={queue.id}
									item={queue}
									isFirst={index === 0}
									showStartTime={!!room?.isGeneralRoom}
								/>
							))
						) : (
							testQueueData?.map((item, index) => (
								<TestQueueItem
									key={item.id}
									item={item}
									isFirst={index === 0}
								/>
							))
						)
					) : isLoadingQueue ? (
						<SkeletonItems />
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

export default Queue

/*
[
  "4c6f6c05-f331-4ac3-86d5-4aa17b2317cc",
  "cdbda38f-0eca-428a-bc9b-b585282d98aa",
  "683c4ad9-33b6-4d1e-a687-0704cfb287a2"
]
*/

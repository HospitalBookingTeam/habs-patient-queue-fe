import { Stack, Typography } from '@mui/material'
import { TestRecordData } from '../../../entities/record'
import { QueueDetailData } from '../../../pages/queue'
import { formatDate } from '../../../utils/formats'
import {
	translateCheckupRecordStatus,
	translateTestRecordStatus,
} from '../../../utils/renderEnums'
import { Item } from './styled'

export const QueueItem = ({
	item,
	isFirst,
	showStartTime,
}: {
	item: QueueDetailData
	isFirst: boolean
	showStartTime: boolean
}) => (
	<Item key={item?.numericalOrder} isFirst={isFirst}>
		<Stack
			width={'100%'}
			height={'100%'}
			alignItems={'center'}
			justifyContent={'space-between'}
			direction="row"
		>
			<Typography flex="0 1 5%" textAlign={'center'}>
				{item?.numericalOrder}
			</Typography>
			<Typography
				fontWeight={'bold'}
				textAlign={'left'}
				flex={'2 1 auto'}
				pl={2}
			>
				{item?.patientName}
			</Typography>
			<Typography flex="0 1 30%" textAlign={'left'}>
				{translateCheckupRecordStatus(item?.status, item?.isReExam)}
			</Typography>
			{showStartTime && (
				<Typography flex="0 1 20%" textAlign={'left'}>
					{formatDate(item?.estimatedStartTime, 'HH:mm')}
				</Typography>
			)}
		</Stack>
	</Item>
)
export const TestQueueItem = ({
	item,
	isFirst,
}: {
	item: TestRecordData
	isFirst: boolean
}) => (
	<Item key={item?.numericalOrder} isFirst={isFirst}>
		<Stack
			width={'100%'}
			height={'100%'}
			alignItems={'center'}
			justifyContent={'space-between'}
			direction="row"
		>
			<Typography flex="1 1 10%" textAlign={'left'}>
				{item?.numericalOrder}
			</Typography>
			<Typography fontWeight={'bold'} textAlign={'left'} flex="1 1 40%">
				{item?.patientName}
			</Typography>
			<Typography flex="1 1 30%" textAlign={'left'}>
				{item?.operationName}
			</Typography>
			<Typography flex="1 1 20%" textAlign={'left'}>
				{translateTestRecordStatus(item?.status)}
			</Typography>
		</Stack>
	</Item>
)

export const TestQueueTitle = () => (
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
		<Typography textAlign={'left'} flex="1 1 40%">
			Họ Tên
		</Typography>
		<Typography flex="1 1 30%">Tên xét nghiệm</Typography>
		<Typography flex="1 1 20%">Tình trạng</Typography>
	</Stack>
)

export const QueueTitle = ({
	isGeneralRoom,
	isQueueNotEmpty,
}: {
	isGeneralRoom: boolean
	isQueueNotEmpty: boolean
}) => (
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
		{isGeneralRoom && <Typography flex="0 1 20%">Thời gian dự kiến</Typography>}
	</Stack>
)

import {
	Autocomplete,
	Button,
	Stack,
	TextField,
	Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { CheckupRecordData } from '../../../../entities/record'
import Checkup from './Checkup'
import Medicine from './Medicine'
import TestRecords from './TestRecords'

const CheckupTab = ({ data }: { data?: CheckupRecordData }) => {
	return (
		<div>
			<Stack
				spacing={4}
				p={2}
				borderRadius={'4px'}
				sx={{ boxShadow: '2px 2px 2px 2px #00000040' }}
				mb={4}
			>
				<Stack spacing={2}>
					<Typography color={'GrayText'} fontWeight={'bold'}>
						Thông tin khám bệnh
					</Typography>
					<Stack direction="row" spacing={2}>
						<Typography color={'GrayText'} width={'15%'}>
							Tình trạng:
						</Typography>
						<Typography>
							{data?.isReExam ? 'Tái khám' : 'Khám thường'}
						</Typography>
					</Stack>
					<Stack direction="row" spacing={2}>
						<Typography color={'GrayText'} width={'15%'}>
							Khoa:
						</Typography>
						<Typography>{data?.departmentName}</Typography>
					</Stack>
					<Stack direction="row" spacing={2}>
						<Typography color={'GrayText'} width={'15%'}>
							Bác sĩ:
						</Typography>
						<Typography>{data?.doctorName}</Typography>
					</Stack>
				</Stack>

				<Checkup data={data} />
			</Stack>

			<Stack
				spacing={4}
				p={2}
				borderRadius={'4px'}
				sx={{
					boxShadow: '2px 2px 2px 2px #00000040',
					display:
						!data?.testRecords || data?.testRecords?.length > 0
							? 'flex'
							: 'none !important',
				}}
			>
				<TestRecords testRecords={data?.testRecords} />
			</Stack>

			<Box
				id="medicine"
				mt={4}
				display={
					data?.prescription &&
					data?.prescription?.details &&
					data?.prescription?.details?.length
						? 'block'
						: 'none !important'
				}
			>
				<Medicine data={data} />
			</Box>
		</div>
	)
}

export default CheckupTab

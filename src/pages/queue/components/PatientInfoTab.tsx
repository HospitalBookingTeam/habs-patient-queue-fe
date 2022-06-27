import {
	Avatar,
	Card,
	CardContent,
	CardHeader,
	Stack,
	Typography,
} from '@mui/material'
import React from 'react'
import { PatientData } from '../../../entities/record'
import { green } from '@mui/material/colors'

const PatientInfoTab = ({ patientData }: { patientData?: PatientData }) => {
	return (
		<Card>
			<CardHeader
				avatar={
					<Avatar sx={{ bgcolor: green[500] }} aria-label="patient">
						{patientData?.name?.substring(0, 1)}
					</Avatar>
				}
				title={patientData?.name ?? ''}
			/>
			<CardContent>
				<Stack spacing={2}>
					<Stack direction="row" spacing={4} alignItems={'baseline'}>
						<Typography variant="body2" color="text.secondary" minWidth={'20%'}>
							Ngày sinh
						</Typography>
						<Typography variant="body2">{patientData?.dateOfBirth}</Typography>
					</Stack>

					<Stack direction="row" spacing={4} alignItems={'baseline'}>
						<Typography variant="body2" color="text.secondary" minWidth={'20%'}>
							SĐT
						</Typography>
						<Typography variant="body2">{patientData?.phoneNumber}</Typography>
					</Stack>

					<Stack direction="row" spacing={4} alignItems={'baseline'}>
						<Typography variant="body2" color="text.secondary" minWidth={'20%'}>
							Quê quán
						</Typography>
						<Typography variant="body2">{patientData?.address}</Typography>
					</Stack>

					<Stack direction="row" spacing={4} alignItems={'baseline'}>
						<Typography variant="body2" color="text.secondary" minWidth={'20%'}>
							Giới tính
						</Typography>
						<Typography variant="body2">
							{patientData?.gender === 0 ? 'Nam' : 'Nữ'}
						</Typography>
					</Stack>

					<Stack direction="row" spacing={4} alignItems={'baseline'}>
						<Typography variant="body2" color="text.secondary" minWidth={'20%'}>
							BHYT
						</Typography>
						<Typography variant="body2">
							{patientData?.bhyt === '0' ? 'Có' : 'Không'}
						</Typography>
					</Stack>
				</Stack>
			</CardContent>
		</Card>
	)
}

export default PatientInfoTab

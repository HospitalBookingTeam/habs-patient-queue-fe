import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import React, { ReactNode, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { CheckupRecordData } from '../../../../entities/record'
import apiHelper from '../../../../utils/apiHelper'

const Checkup = ({ data }: { data?: CheckupRecordData }) => {
	return (
		<Stack spacing={4} mb={4}>
			<Stack direction="row" flex={'1 1 auto'} spacing={4}>
				<ReadonlyField label={'Nhịp tim'} value={data?.pulse} />
				<ReadonlyField label="Huyết áp" value={data?.bloodPressure} />
				<ReadonlyField label="Nhiệt độ" value={data?.temperature} />
			</Stack>

			<ReadonlyField label="Chẩn đoán cận lâm sàng" value={data?.diagnosis} />
			<ReadonlyField label="Lời khuyên bác sĩ" value={data?.doctorAdvice} />
		</Stack>
	)
}

const ReadonlyField = ({
	label,
	value,
}: {
	label: ReactNode
	value: ReactNode
}) => {
	return (
		<Stack spacing={2}>
			<Typography color="GrayText" fontSize={'14px'}>
				{label}
			</Typography>
			<Typography maxWidth={500}>{value ?? '---'}</Typography>
		</Stack>
	)
}
export default Checkup

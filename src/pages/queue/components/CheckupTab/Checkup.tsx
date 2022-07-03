import { Box, Button, Stack, TextField } from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { CheckupRecordData } from '../../../../entities/record'
import apiHelper from '../../../../utils/apiHelper'

const Checkup = ({
	data,
	isSave,
}: {
	data?: CheckupRecordData
	isSave: boolean
}) => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { isDirty },
	} = useForm({
		defaultValues: {
			bloodPressure: 0,
			temperature: 0,
			pulse: 0,
			doctorAdvice: '',
			diagnosis: '',
		},
	})

	const handleUpdateCheckupRecord = useCallback(
		async (values: any) => {
			const {
				bloodPressure,
				pulse,
				temperature,
				doctorAdvice,
				diagnosis,
			}: CheckupRecordData = values
			try {
				await apiHelper.put(`checkup-records/${data?.id}`, {
					bloodPressure,
					pulse,
					temperature,
					doctorAdvice,
					diagnosis,
					id: data?.id,
					patientId: data?.patientId,
				})
			} catch (err) {
				console.log(err)
			}
		},
		[data]
	)

	useEffect(() => {
		reset(
			{
				...data,
			},
			{ keepDirty: true }
		)
	}, [data])

	useEffect(() => {
		if (!isSave) return
		handleSubmit(handleUpdateCheckupRecord)()
	}, [isSave])

	return (
		<form onSubmit={handleSubmit(handleUpdateCheckupRecord)}>
			<Stack spacing={4} mb={4}>
				<Stack direction="row" flex={'1 1 auto'} spacing={4}>
					<TextField
						label="Nhịp tim"
						type="number"
						{...register('bloodPressure', { required: true })}
					/>
					<TextField
						label="Huyết áp"
						type="number"
						{...register('pulse', { required: true })}
					/>
					<TextField
						label="Nhiệt độ"
						type="number"
						{...register('temperature', { required: true })}
					/>
				</Stack>

				<TextField
					label="Lời khuyên bác sĩ"
					multiline
					type="text"
					rows={3}
					{...register('doctorAdvice', { required: true })}
				/>
				<TextField
					label="Chẩn đoán cận lâm sàng"
					multiline
					type="text"
					rows={3}
					{...register('diagnosis', { required: true })}
				/>
			</Stack>
		</form>
	)
}

export default Checkup

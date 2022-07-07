import { Autocomplete, Box, Button, Stack, TextField } from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { AutocompleteOption } from '../../../../entities/base'
import { CheckupRecordData } from '../../../../entities/record'
import apiHelper from '../../../../utils/apiHelper'

const Checkup = ({
	isSave,
	data,
	icdList,
}: {
	isSave: boolean
	data?: CheckupRecordData
	icdList?: AutocompleteOption[]
}) => {
	const {
		register,
		handleSubmit,
		reset,
		control,
		formState: { isDirty },
	} = useForm({
		defaultValues: {
			bloodPressure: 0,
			temperature: 0,
			pulse: 0,
			doctorAdvice: '',
			diagnosis: '',
			icdDisease: { label: '', value: 0 },
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
					icdDiseaseId: values?.icdDisease?.value,
				})
			} catch (err) {
				console.log(err)
			}
		},
		[data]
	)

	const getOpObj = (option: any) => {
		if (!option?.value) option = icdList?.find((op) => op.label === option)
		return option
	}

	useEffect(() => {
		reset(
			{
				...data,
				icdDisease: {
					value: data?.icdDiseaseId,
					label: `${data?.icdCode} - ${data?.icdDiseaseName}`,
				},
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
						{...register('bloodPressure', {})}
					/>
					<TextField
						label="Huyết áp"
						type="number"
						{...register('pulse', {})}
					/>
					<TextField
						label="Nhiệt độ"
						type="number"
						{...register('temperature', {})}
					/>
				</Stack>

				<Controller
					name="icdDisease"
					render={({ field: { ref, ...field }, fieldState: { error } }) => {
						return (
							<Autocomplete
								{...field}
								options={icdList ?? []}
								getOptionLabel={(option) =>
									getOpObj(option) ? getOpObj(option)?.label : ''
								}
								isOptionEqualToValue={(option, value) => {
									return option.value === getOpObj(value)?.value
								}}
								sx={{ width: '100%' }}
								renderInput={(params) => {
									return (
										<TextField
											{...params}
											inputRef={ref}
											label="Chuẩn đoán"
											error={!!error}
											helperText={error?.message}
										/>
									)
								}}
								onChange={(e, value) => field.onChange(value)}
								onInputChange={(_, data) => {
									if (data) field.onChange(data)
								}}
							/>
						)
					}}
					rules={{}}
					control={control}
				/>

				<TextField
					label="Chẩn đoán cận lâm sàng"
					multiline
					type="text"
					rows={3}
					{...register('diagnosis', {})}
				/>
				<TextField
					label="Lời khuyên bác sĩ"
					multiline
					type="text"
					rows={3}
					{...register('doctorAdvice', {})}
				/>
			</Stack>
		</form>
	)
}

export default Checkup

import { Autocomplete, Stack, TextField } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
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
		formState: { isDirty, errors },
	} = useForm({
		defaultValues: {
			bloodPressure: 0,
			temperature: 0,
			pulse: 0,
			doctorAdvice: '',
			diagnosis: '',
		},
		mode: 'onChange',
	})

	const [icdDisease, setIcdDisease] = useState<AutocompleteOption | null>(null)

	useEffect(() => {
		if (!data) return
		const option = icdList?.find((op) => op.value === data.icdDiseaseId)
		setIcdDisease(!!option ? option : null)
	}, [data])

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
					bloodPressure: Number(bloodPressure),
					pulse: Number(pulse) || null,
					temperature: Number(temperature) || null,
					doctorAdvice,
					diagnosis,
					id: data?.id,
					patientId: data?.patientId,
					icdDiseaseId: Number(icdDisease?.value),
				})
			} catch (err) {
				console.error(err)
			}
		},
		[data, icdDisease]
	)

	useEffect(() => {
		let _data = {
			...data,
			bloodPressure: data?.bloodPressure || undefined,
			pulse: data?.pulse || undefined,
			temperature: data?.temperature || undefined,
		}

		reset(
			{
				..._data,
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
						error={!!errors?.bloodPressure}
						{...register('bloodPressure', { min: 0 })}
					/>
					<TextField
						label="Huyết áp"
						type="number"
						error={!!errors?.pulse}
						{...register('pulse', { min: 0 })}
					/>
					<TextField
						label="Nhiệt độ"
						type="number"
						error={!!errors?.temperature}
						{...register('temperature', { min: 0 })}
					/>
				</Stack>

				<Autocomplete
					value={icdDisease}
					onChange={(_, value) => {
						setIcdDisease(value)
					}}
					options={icdList ?? []}
					sx={{ width: '100%' }}
					getOptionLabel={(option) => option.label}
					renderInput={(params) => {
						return <TextField {...params} label="Chẩn đoán" />
					}}
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

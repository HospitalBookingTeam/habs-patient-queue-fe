import { Autocomplete, Stack, TextField } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import ControlledAutocomplete, {
	Option,
} from '../../../../components/FormElements/ControlledAutocomplete'
import { CheckupRecordData } from '../../../../entities/record'
import { useCheckupState } from '../../../../hooks/useCheckup'
import apiHelper from '../../../../utils/apiHelper'

type CheckupFormData = {
	bloodPressure: number
	temperature: number
	pulse: number
	doctorAdvice: string
	diagnosis: string
	icdDisease: Option
}
const Checkup = ({
	isSave,
	data,
	icdList,
}: {
	isSave: boolean
	data?: CheckupRecordData
	icdList?: Option[]
}) => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, ...formState },
		...methods
	} = useForm<CheckupFormData>({
		defaultValues: {
			bloodPressure: undefined,
			temperature: undefined,
			pulse: undefined,
			doctorAdvice: '',
			diagnosis: '',
			icdDisease: undefined,
		},
		mode: 'onChange',
	})

	const { setCheckupState } = useCheckupState()
	const handleUpdateCheckupRecord = useCallback(
		async (values: CheckupFormData) => {
			const {
				bloodPressure,
				pulse,
				temperature,
				doctorAdvice,
				diagnosis,
				icdDisease,
			} = values
			try {
				setCheckupState((state) => ({ ...state, isLoading: true }))
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
			} finally {
				setCheckupState((state) => ({ ...state, isLoading: false }))
			}
		},
		[data]
	)

	useEffect(() => {
		let _data = {
			...data,
			bloodPressure: data?.bloodPressure || undefined,
			pulse: data?.pulse || undefined,
			temperature: data?.temperature || undefined,
			icdDisease: data?.icdDiseaseId
				? {
						value: data?.icdDiseaseId?.toString(),
						label: `${data?.icdCode} - ${data?.icdDiseaseName}`,
				  }
				: undefined,
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
		<FormProvider
			{...methods}
			formState={{ ...formState, errors }}
			reset={reset}
			register={register}
			handleSubmit={handleSubmit}
		>
			<form onSubmit={handleSubmit(handleUpdateCheckupRecord)}>
				<Stack spacing={4} mb={4}>
					<Stack direction="row" flex={'1 1 auto'} spacing={4}>
						<TextField
							label="Nhịp tim"
							type="number"
							error={!!errors?.bloodPressure}
							{...register('bloodPressure', { min: '0' })}
						/>
						<TextField
							label="Huyết áp"
							type="number"
							error={!!errors?.pulse}
							{...register('pulse', { min: '0' })}
						/>
						<TextField
							label="Nhiệt độ"
							type="number"
							error={!!errors?.temperature}
							{...register('temperature', { min: '0' })}
						/>
					</Stack>

					<ControlledAutocomplete
						name="icdDisease"
						label={'Chẩn đoán'}
						style={{ width: '100%' }}
						rules={{}}
						options={icdList ?? []}
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
		</FormProvider>
	)
}

export default Checkup

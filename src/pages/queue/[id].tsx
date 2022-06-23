import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import PageLayout from '../../components/PageLayout'
import { atom, selectorFamily } from 'recoil'
import { CheckupRecordData } from '../../entities/record'
import apiHelper from '../../utils/apiHelper'
import {
	Autocomplete,
	Button,
	Stack,
	TextareaAutosize,
	TextField,
	Typography,
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { IcdData } from '../../entities/icd'

const ATOM_KEY = 'checkup-record'

export const checkUpAtom = atom<CheckupRecordData>({
	key: ATOM_KEY,
	default: undefined,
})

const QueueDetailPage = () => {
	const router = useRouter()
	const { id } = router.query

	const [data, setData] = useState<CheckupRecordData | undefined>(undefined)
	const [icdList, setIcdList] = useState<IcdData[] | undefined>(undefined)

	const { register, handleSubmit, control, reset } = useForm({
		defaultValues: {
			bloodPressure: 0,
			temperature: 0,
			pulse: 0,
			icdDiseaseId: 0,
			doctorAdvice: '',
		},
	})

	useEffect(() => {
		const queryData = async () => {
			try {
				const [dataResponse, IcdResponse] = await Promise.all([
					apiHelper.get(`checkup-records/${id}`),
					apiHelper.get(`icd`),
				])
				setIcdList(IcdResponse?.data)
				setData(dataResponse?.data)
				reset(dataResponse?.data)
			} catch (error) {
				console.log(error)
			}
		}
		if (!id || !!data) return
		queryData()
	}, [id, data])

	console.log('icdList', icdList)
	return (
		<PageLayout>
			<Stack
				spacing={4}
				direction={'row'}
				alignItems={'center'}
				justifyContent={'space-between'}
				mb={5}
			>
				<Typography variant="h5">
					Bệnh nhân <span style={{ color: 'green' }}>{data?.patientName}</span>
				</Typography>
				<Button type="button" variant="contained">
					Bắt đầu khám
				</Button>
			</Stack>

			<Stack
				spacing={4}
				p={2}
				borderRadius={'4px'}
				sx={{ boxShadow: '2px 2px 2px 2px #00000040' }}
			>
				<Typography color={'GrayText'}>Thông tin khám bệnh</Typography>

				<Stack spacing={4} direction={'row'} alignItems={'center'}>
					<Button
						type="button"
						color={'secondary'}
						variant="contained"
						disabled
					>
						Chuyển khoa
					</Button>
					<Button type="button" color={'info'} variant="contained" disabled>
						Kê đơn
					</Button>
					<Button type="button" color={'info'} variant="outlined" disabled>
						Đặt thêm xét nghiệm
					</Button>
				</Stack>
				<Stack spacing={4}>
					<Stack direction="row" flex={'1 1 auto'} spacing={4}>
						<TextField
							inputProps={{ readOnly: true }}
							label="Nhịp tim"
							type="text"
							{...register('bloodPressure', { required: true })}
						/>
						<TextField
							inputProps={{ readOnly: true }}
							label="Huyết áp"
							type="text"
							{...register('pulse', { required: true })}
						/>
						<TextField
							inputProps={{ readOnly: true }}
							label="Nhiệt độ"
							type="text"
							{...register('temperature', { required: true })}
						/>
					</Stack>

					<Controller
						name="icdDiseaseId"
						render={({ field: { ref, ...field }, fieldState: { error } }) => {
							return (
								<Autocomplete
									{...field}
									options={icdList?.map((icd) => icd.id) ?? []}
									// getOptionLabel={(option) => {
									// 	return getOpObj(option) ? getOpObj(option)?.label : ''
									// }}
									// isOptionEqualToValue={(option, value) => {
									// 	return option.value === getOpObj(value)?.value
									// }}
									readOnly
									sx={{ width: '100%' }}
									renderInput={(params) => (
										<TextField
											{...params}
											value={
												icdList?.find(
													(icd) => icd.id?.toString() === params?.id
												)?.name
											}
											inputRef={ref}
											label="Icd"
											error={!!error}
											helperText={error?.message}
										/>
									)}
									onChange={(e, value) => field.onChange(value)}
									onInputChange={(_, data) => {
										if (data) field.onChange(data)
									}}
								/>
							)
						}}
						rules={{ required: true }}
						control={control}
					/>

					<TextField
						inputProps={{ readOnly: true }}
						label="Lời khuyên bác sĩ"
						multiline
						value=" "
						type="text"
						rows={3}
						{...register('doctorAdvice', { required: true })}
					/>
				</Stack>
			</Stack>
		</PageLayout>
	)
}

export default QueueDetailPage

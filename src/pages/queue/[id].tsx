import React, { useCallback, useEffect, useState } from 'react'
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
import { Box } from '@mui/system'
import PdfViewer from '../../components/PdfViewer'
import RequestDepartmentDialog from './components/RequestDepartmentsDialog'

const ATOM_KEY = 'checkup-record'

export const checkUpAtom = atom<CheckupRecordData>({
	key: ATOM_KEY,
	default: undefined,
})

const QueueDetailPage = () => {
	const router = useRouter()
	const { id } = router.query

	const [data, setData] = useState<CheckupRecordData | undefined>(undefined)
	const [icdList, setIcdList] = useState<
		{ value: number; label: string }[] | undefined
	>(undefined)

	const [isEdit, setIsEdit] = useState(false)
	const [isRequestDepartmentsOpen, setIsRequestDepartmentsOpen] =
		useState(false)

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { isDirty },
	} = useForm({
		defaultValues: {
			bloodPressure: 0,
			temperature: 0,
			pulse: 0,
			icdDisease: { value: 0, label: ' ' },
			doctorAdvice: ' ',
		},
	})

	const handleConfirmQueue = useCallback(async () => {
		if (isEdit) {
			setIsEdit(false)
			return
		}

		try {
			await apiHelper.put(`checkup-queue/${data?.id}`)
			setIsEdit(true)
		} catch (err) {
			console.log(err)
		}
	}, [isEdit, data])

	const handleUpdateCheckupRecord = useCallback(
		async (values: any) => {
			const {
				bloodPressure,
				pulse,
				temperature,
				doctorAdvice,
				icdDisease: { value: icdDiseaseId },
			}: CheckupRecordData & { icdDisease: { value: string } } = values
			try {
				await apiHelper.put(`checkup-records/${data?.id}`, {
					bloodPressure,
					pulse,
					temperature,
					doctorAdvice,
					icdDiseaseId,
				})
			} catch (err) {
				console.log(err)
			}
		},
		[isEdit, data]
	)

	useEffect(() => {
		const queryData = async () => {
			try {
				const [dataResponse, IcdResponse] = await Promise.all([
					apiHelper.get(`checkup-records/${id}`),
					apiHelper.get(`icd`),
				])
				setIcdList(
					IcdResponse?.data?.map((icd: IcdData) => ({
						value: icd.id,
						label: `${icd.code} - ${icd.name}`,
					}))
				)
				setData(dataResponse?.data)

				reset(
					{
						...dataResponse?.data,
						icdDisease: {
							value: dataResponse?.data?.icdDiseaseId,
							label: `${dataResponse?.data?.icdCode} - ${dataResponse?.data?.icdDiseaseName}`,
						},
					},
					{ keepDirty: true }
				)
			} catch (error) {
				console.log(error)
			}
		}
		if (!id || !!data) return
		queryData()
	}, [id, data])

	const getOpObj = (option: any) => {
		if (!option?.value) option = icdList?.find((op) => op.label === option)
		return option
	}
	return (
		<PageLayout>
			<Stack
				spacing={4}
				direction={'row'}
				alignItems={'center'}
				justifyContent={'space-between'}
				mb={3}
			>
				<Typography variant="h5">
					Bệnh nhân <span style={{ color: 'green' }}>{data?.patientName}</span>
				</Typography>
				<Button
					type="button"
					variant="contained"
					color={isEdit ? 'warning' : 'primary'}
					onClick={handleConfirmQueue}
					disabled={!data}
				>
					{isEdit ? 'Huỷ' : 'Bắt đầu khám'}
				</Button>
			</Stack>

			<Stack spacing={4} direction={'row'} alignItems={'center'} mb={4}>
				<Button
					type="button"
					color={'secondary'}
					variant="contained"
					disabled={!isEdit}
					onClick={() => setIsRequestDepartmentsOpen(true)}
				>
					Chuyển khoa
				</Button>
				<Button
					type="button"
					color={'info'}
					variant="contained"
					disabled={!isEdit}
				>
					Kê đơn
				</Button>
				<Button
					type="button"
					color={'info'}
					variant="outlined"
					disabled={!isEdit}
				>
					Đặt thêm xét nghiệm
				</Button>
			</Stack>
			<Stack
				spacing={4}
				p={2}
				borderRadius={'4px'}
				sx={{ boxShadow: '2px 2px 2px 2px #00000040' }}
				mb={4}
			>
				<Typography color={'GrayText'}>Thông tin khám bệnh</Typography>

				<form onSubmit={handleSubmit(handleUpdateCheckupRecord)}>
					<Stack spacing={4} mb={4}>
						<Stack direction="row" flex={'1 1 auto'} spacing={4}>
							<TextField
								inputProps={{ readOnly: !isEdit }}
								label="Nhịp tim"
								type="text"
								{...register('bloodPressure', { required: true })}
							/>
							<TextField
								inputProps={{ readOnly: !isEdit }}
								label="Huyết áp"
								type="text"
								{...register('pulse', { required: true })}
							/>
							<TextField
								inputProps={{ readOnly: !isEdit }}
								label="Nhiệt độ"
								type="text"
								{...register('temperature', { required: true })}
							/>
						</Stack>

						<Controller
							name="icdDisease"
							render={({ field: { ref, ...field }, fieldState: { error } }) => {
								return (
									<Autocomplete
										{...field}
										options={icdList ?? []}
										getOptionLabel={(option) => {
											console.log('option', getOpObj(option))
											return getOpObj(option) ? getOpObj(option)?.label : ''
										}}
										isOptionEqualToValue={(option, value) => {
											return option.value === getOpObj(value)?.value
										}}
										readOnly={!isEdit}
										sx={{ width: '100%' }}
										renderInput={(params) => {
											console.log('params', params?.inputProps)
											console.log(
												icdList?.find(
													(icd) =>
														icd.value?.toString() === params?.inputProps?.value
												)?.value
											)
											return (
												<TextField
													{...params}
													// value={
													// 	icdList?.find(
													// 		(icd) =>
													// 			icd.value?.toString() ===
													// 			params?.inputProps?.value
													// 	)?.value
													// }
													inputRef={ref}
													label="Icd"
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
							rules={{ required: true }}
							control={control}
						/>

						<TextField
							inputProps={{ readOnly: !isEdit }}
							label="Lời khuyên bác sĩ"
							multiline
							type="text"
							rows={3}
							{...register('doctorAdvice', { required: true })}
						/>
					</Stack>

					<Box textAlign="right">
						<Button
							type="submit"
							color={'primary'}
							disabled={!isEdit || !isDirty}
							variant="contained"
						>
							Cập nhật
						</Button>
					</Box>
				</form>
			</Stack>
			<Stack
				spacing={4}
				p={2}
				borderRadius={'4px'}
				sx={{ boxShadow: '2px 2px 2px 2px #00000040' }}
			>
				<Typography color={'GrayText'}>Thông tin xét nghiệm</Typography>
				<Stack spacing={4} mb={4}>
					{data?.testRecords?.map((test) => (
						<Stack key={test.id} spacing={2} direction="row">
							<Typography>{test?.operationName}</Typography>
							<Typography>{test?.roomNumber}</Typography>
						</Stack>
					))}
				</Stack>
				<PdfViewer url="/data/testRecord.pdf" width={720} pageNumber={1} />
			</Stack>

			{!!data && (
				<RequestDepartmentDialog
					id={data.id}
					open={isRequestDepartmentsOpen}
					closeModal={() => setIsRequestDepartmentsOpen(false)}
				/>
			)}
		</PageLayout>
	)
}

export default QueueDetailPage

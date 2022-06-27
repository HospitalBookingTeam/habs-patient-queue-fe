import {
	Autocomplete,
	Button,
	Stack,
	TextField,
	Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import PdfViewer from '../../../components/PdfViewer'
import { AutocompleteOption } from '../../../entities/base'
import { IcdData } from '../../../entities/icd'
import { CheckupRecordData } from '../../../entities/record'
import apiHelper from '../../../utils/apiHelper'
import RequestDepartmentDialog from './RequestDepartmentsDialog'
import RequestMedicinesDialog from './RequestMedicinesDialog'
import RequestOperationsDialog from './RequestOperationsDialog'

const CheckupTab = ({
	data,
	icdList,
}: {
	data?: CheckupRecordData
	icdList?: AutocompleteOption[]
}) => {
	const [isEdit, setIsEdit] = useState(false)
	const [isRequestDepartmentsOpen, setIsRequestDepartmentsOpen] =
		useState(false)
	const [isRequestOperationsOpen, setIsRequestOperationsOpen] = useState(false)
	const [isRequestMedicinesOpen, setIsRequestMedicinesOpen] = useState(false)

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

	return (
		<div>
			<Button
				type="button"
				variant="contained"
				color={isEdit ? 'warning' : 'primary'}
				onClick={handleConfirmQueue}
				disabled={!data}
			>
				{isEdit ? 'Huỷ' : 'Bắt đầu khám'}
			</Button>
			<Box display={isEdit ? 'block' : 'none'}>
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
						onClick={() => setIsRequestMedicinesOpen(true)}
					>
						Kê đơn
					</Button>
					<Button
						type="button"
						color={'info'}
						variant="outlined"
						disabled={!isEdit}
						onClick={() => setIsRequestOperationsOpen(true)}
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
								render={({
									field: { ref, ...field },
									fieldState: { error },
								}) => {
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
											readOnly={!isEdit}
											sx={{ width: '100%' }}
											renderInput={(params) => {
												console.log('params', params?.inputProps)
												console.log(
													icdList?.find(
														(icd) =>
															icd.value?.toString() ===
															params?.inputProps?.value
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
			</Box>

			{!!data && (
				<>
					<RequestDepartmentDialog
						id={data.id}
						open={isRequestDepartmentsOpen}
						closeModal={() => setIsRequestDepartmentsOpen(false)}
					/>
					<RequestOperationsDialog
						id={data.id}
						open={isRequestOperationsOpen}
						closeModal={() => setIsRequestOperationsOpen(false)}
					/>
					<RequestMedicinesDialog
						id={data.id}
						open={isRequestMedicinesOpen}
						closeModal={() => setIsRequestMedicinesOpen(false)}
					/>
				</>
			)}
		</div>
	)
}

export default CheckupTab

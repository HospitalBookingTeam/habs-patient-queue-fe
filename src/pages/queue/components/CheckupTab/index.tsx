import {
	Autocomplete,
	Button,
	Stack,
	TextField,
	Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import PdfViewer from '../../../../components/PdfViewer'
import { AutocompleteOption } from '../../../../entities/base'
import { CheckupRecordData } from '../../../../entities/record'
import apiHelper from '../../../../utils/apiHelper'
import { CheckupRecordStatus } from '../../../../utils/renderEnums'
import RequestDepartmentDialog from '../RequestDepartmentsDialog'
import RequestOperationsDialog from '../RequestOperationsDialog'
import Medicine from './Medicine'
import TestRecords from './TestRecords'

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

	const medicineRef = useRef<HTMLDivElement>(null)
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
		},
	})

	const handleConfirmQueue = useCallback(async () => {
		if (isEdit) {
			setIsEdit(false)
			return
		}

		try {
			await apiHelper.post(`checkup-queue/confirm/${data?.id}`)
			setIsEdit(true)
		} catch (err) {
			console.log(err)
		}
	}, [isEdit, data])

	const handleUpdateCheckupRecord = useCallback(
		async (values: any) => {
			const { bloodPressure, pulse, temperature }: CheckupRecordData = values
			try {
				await apiHelper.put(`checkup-records/${data?.id}`, {
					bloodPressure,
					pulse,
					temperature,
				})
			} catch (err) {
				console.log(err)
			}
		},
		[isEdit, data]
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
		if (data?.status === CheckupRecordStatus.DANG_KHAM) {
			setIsEdit(true)
		}
	}, [data])

	return (
		<div>
			<Button
				type="button"
				variant="contained"
				color={isEdit ? 'warning' : 'primary'}
				onClick={handleConfirmQueue}
				disabled={!data}
				sx={{ display: isEdit ? 'none !important' : 'block' }}
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
						onClick={() => {
							if (medicineRef) {
								medicineRef.current?.scrollIntoView({ behavior: 'smooth' })
							}
						}}
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
									type="number"
									{...register('bloodPressure', { required: true })}
								/>
								<TextField
									inputProps={{ readOnly: !isEdit }}
									label="Huyết áp"
									type="number"
									{...register('pulse', { required: true })}
								/>
								<TextField
									inputProps={{ readOnly: !isEdit }}
									label="Nhiệt độ"
									type="number"
									{...register('temperature', { required: true })}
								/>
							</Stack>
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
					<TestRecords testRecords={data?.testRecords} />
				</Stack>
				<Box id="medicine" mt={4} ref={medicineRef}>
					<Medicine data={data} icdList={icdList} />
				</Box>
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
				</>
			)}
		</div>
	)
}

export default CheckupTab

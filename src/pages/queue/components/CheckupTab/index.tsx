import { LoadingButton } from '@mui/lab'
import {
	Autocomplete,
	Button,
	Stack,
	TextField,
	Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Option } from '../../../../components/FormElements/ControlledAutocomplete'
import { AutocompleteOption } from '../../../../entities/base'
import { CheckupRecordData } from '../../../../entities/record'
import { useCheckupState } from '../../../../hooks/useCheckup'
import { useMedicineState } from '../../../../hooks/useMedicine'
import useToast from '../../../../hooks/useToast'
import apiHelper from '../../../../utils/apiHelper'
import { ERROR_TRANSLATIONS } from '../../../../utils/constants'
import { CheckupRecordStatus } from '../../../../utils/renderEnums'
import EmergencyConfirmDialog from '../EmergencyConfirmDialog'
import FinishRecordDialog from '../FinishRecordDialog'
import RequestDepartmentDialog from '../RequestDepartmentsDialog'
import RequestReExamDialog from '../RequestReExamDialog'
import Checkup from './Checkup'
import Medicine from './Medicine'
import TestRecords from './TestRecords'

const CheckupTab = ({
	data,
	icdList,
}: {
	data?: CheckupRecordData
	icdList?: Option[]
}) => {
	const [isEdit, setIsEdit] = useState(false)
	const [isLoadingEdit, setIsLoadingEdit] = useState(false)

	const [isRequestDepartmentsOpen, setIsRequestDepartmentsOpen] =
		useState(false)
	const [isFinishRecordOpen, setIsFinishRecordOpen] = useState(false)
	const [isEmergencyOpen, setIsEmergencyOpen] = useState(false)
	const [isReExamOpen, setIsReExamOpen] = useState(false)

	const [isSave, setIsSave] = useState(false)
	const { toastError } = useToast()

	const {
		medicineState: { isLoading: isMedicineLoading },
	} = useMedicineState()
	const {
		checkupState: { isLoading: isCheckupLoading },
	} = useCheckupState()

	const handleConfirmQueue = useCallback(async () => {
		if (isEdit) {
			setIsEdit(false)
			return
		}

		try {
			setIsLoadingEdit(true)
			await apiHelper.post(`checkup-queue/confirm/${data?.id}`)
			setIsEdit(true)
		} catch (err) {
			console.error(err)
			toastError({
				message: ERROR_TRANSLATIONS[err as keyof typeof ERROR_TRANSLATIONS],
			})
		} finally {
			setIsLoadingEdit(false)
		}
	}, [isEdit, data])

	useEffect(() => {
		if (
			data?.status === CheckupRecordStatus.DANG_KHAM ||
			data?.status === CheckupRecordStatus.DA_CO_KET_QUA_XN
		) {
			setIsEdit(true)
		}
	}, [data])

	useEffect(() => {
		if (!isSave) return
		const timeout = setTimeout(() => setIsSave(false), 0)

		return () => clearTimeout(timeout)
	}, [isSave])

	const isBtnLoading = isCheckupLoading || isMedicineLoading || isLoadingEdit
	return (
		<div>
			<Box textAlign="right" ml="auto" mb={2}>
				<LoadingButton
					type="button"
					variant="contained"
					color={'primary'}
					loading={isBtnLoading}
					onClick={() => {
						if (!isEdit) {
							handleConfirmQueue()
							return
						}
						setIsSave(true)
					}}
					disabled={!data}
				>
					{isEdit ? 'Lưu' : 'Bắt đầu khám'}
				</LoadingButton>
			</Box>
			<Box display={isEdit ? 'block' : 'none'}>
				<Stack
					spacing={4}
					p={2}
					borderRadius={'4px'}
					sx={{ boxShadow: '2px 2px 2px 2px #00000040' }}
					mb={4}
				>
					<Typography color={'GrayText'} fontWeight="bold">
						Thông tin khám bệnh
					</Typography>
					<Stack spacing={2}>
						<Stack direction="row" spacing={4}>
							<Typography color={'GrayText'} flex="0 1 15%">
								Khoa:
							</Typography>
							<Typography fontWeight="bold" flex="1">
								{data?.departmentName}
							</Typography>
						</Stack>
						<Stack direction="row" spacing={4}>
							<Typography color={'GrayText'} flex="0 1 15%">
								Triệu chứng:
							</Typography>
							<Typography flex="1">{data?.clinicalSymptom ?? '---'}</Typography>
						</Stack>
					</Stack>
					<Checkup data={data} icdList={icdList} isSave={isSave} />
				</Stack>

				<Stack
					spacing={4}
					p={2}
					borderRadius={'4px'}
					sx={{
						boxShadow: '2px 2px 2px 2px #00000040',
					}}
				>
					<TestRecords testRecords={data?.testRecords} data={data} />
				</Stack>

				<Box id="medicine" mt={4}>
					<Medicine data={data} icdList={icdList} isSave={isSave} />
				</Box>
				<Stack direction={'row'} justifyContent={'flex-end'} spacing={2} mt={4}>
					<Button
						type="button"
						color={'info'}
						variant="contained"
						onClick={() => setIsReExamOpen(true)}
					>
						Đặt lịch tái khám
					</Button>
					<Button
						type="button"
						color={'secondary'}
						variant="contained"
						onClick={() => setIsRequestDepartmentsOpen(true)}
					>
						Chuyển khoa
					</Button>

					<Button
						type="button"
						color={'error'}
						variant="contained"
						onClick={() => setIsEmergencyOpen(true)}
					>
						Nhập viện
					</Button>
					<Button
						type="button"
						color={'warning'}
						variant="contained"
						onClick={() => setIsFinishRecordOpen(true)}
					>
						Kết thúc khám
					</Button>
				</Stack>
			</Box>

			{!!data && (
				<>
					<RequestReExamDialog
						data={data}
						open={isReExamOpen}
						closeModal={() => setIsReExamOpen(false)}
					/>
					<RequestDepartmentDialog
						id={data.id}
						open={isRequestDepartmentsOpen}
						closeModal={() => {
							setIsRequestDepartmentsOpen(false)
						}}
						saveProgress={() => setIsSave(true)}
					/>

					<FinishRecordDialog
						data={data}
						open={isFinishRecordOpen}
						closeModal={() => {
							setIsFinishRecordOpen(false)
						}}
						saveProgress={() => setIsSave(true)}
					/>
					<EmergencyConfirmDialog
						data={data}
						open={isEmergencyOpen}
						closeModal={() => {
							setIsEmergencyOpen(false)
						}}
						saveProgress={() => setIsSave(true)}
					/>
				</>
			)}
		</div>
	)
}

export default CheckupTab

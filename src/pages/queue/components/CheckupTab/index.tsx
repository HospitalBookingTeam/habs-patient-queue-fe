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
import EmergencyConfirmDialog from '../EmergencyConfirmDialog'
import FinishRecordDialog from '../FinishRecordDialog'
import RequestDepartmentDialog from '../RequestDepartmentsDialog'
import RequestOperationsDialog from '../RequestOperationsDialog'
import Checkup from './Checkup'
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
	const [isFinishRecordOpen, setIsFinishRecordOpen] = useState(false)
	const [isEmergencyOpen, setIsEmergencyOpen] = useState(false)

	const medicineRef = useRef<HTMLDivElement>(null)

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

	useEffect(() => {
		if (data?.status === CheckupRecordStatus['Đang khám']) {
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
				<Stack direction={'row'} justifyContent={'space-between'}>
					<Stack spacing={4} direction={'row'} alignItems={'center'} mb={4}>
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
							color={'info'}
							variant="contained"
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
							onClick={() => setIsRequestOperationsOpen(true)}
						>
							Đặt thêm xét nghiệm
						</Button>
					</Stack>

					<Stack direction="row" spacing={2} height="fit-content">
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
				</Stack>
				<Stack
					spacing={4}
					p={2}
					borderRadius={'4px'}
					sx={{ boxShadow: '2px 2px 2px 2px #00000040' }}
					mb={4}
				>
					<Typography color={'GrayText'}>Thông tin khám bệnh</Typography>
					<Typography color={'GrayText'}>
						Khoa: <span style={{ color: 'black' }}>{data?.departmentName}</span>
					</Typography>

					<Checkup data={data} />
				</Stack>

				<Stack
					spacing={4}
					p={2}
					borderRadius={'4px'}
					sx={{
						boxShadow: '2px 2px 2px 2px #00000040',
						display:
							!data?.testRecords || data?.testRecords?.length > 0
								? 'flex'
								: 'none !important',
					}}
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
					<FinishRecordDialog
						data={data}
						open={isFinishRecordOpen}
						closeModal={() => setIsFinishRecordOpen(false)}
					/>
					<EmergencyConfirmDialog
						data={data}
						open={isEmergencyOpen}
						closeModal={() => setIsEmergencyOpen(false)}
					/>
				</>
			)}
		</div>
	)
}

export default CheckupTab

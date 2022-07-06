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
	const [isFinishRecordOpen, setIsFinishRecordOpen] = useState(false)
	const [isEmergencyOpen, setIsEmergencyOpen] = useState(false)
	const [isSave, setIsSave] = useState(false)

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
		if (
			data?.status === CheckupRecordStatus['Đang khám'] ||
			data?.status === CheckupRecordStatus['Đã có KQXN']
		) {
			setIsEdit(true)
		}
	}, [data])

	useEffect(() => {
		if (!isSave) return
		const timeout = setTimeout(() => setIsSave(false), 0)

		return () => clearTimeout(timeout)
	}, [isSave])

	return (
		<div>
			<Box textAlign="right" ml="auto" mb={2}>
				<Button
					type="button"
					variant="contained"
					color={'primary'}
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
				</Button>
			</Box>
			<Box display={isEdit ? 'block' : 'none'}>
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
					<RequestDepartmentDialog
						id={data.id}
						open={isRequestDepartmentsOpen}
						closeModal={() => setIsRequestDepartmentsOpen(false)}
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

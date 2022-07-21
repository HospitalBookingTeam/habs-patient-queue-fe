import { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import apiHelper from '../../../utils/apiHelper'
import {
	Alert,
	Autocomplete,
	Card,
	CardContent,
	Snackbar,
	Stack,
	Typography,
} from '@mui/material'
import { OperationData } from '../../../entities/operation'
import { Box } from '@mui/system'
import { renderEnumInsuranceStatus } from '../../../utils/renderEnums'
import { formatCurrency } from '../../../utils/formats'
import { StyledDialogTitle } from '../../../components/StyledModal'
import { useRouter } from 'next/router'
import { TestResponseData } from '../../../entities/test'
import ControlledAutocomplete, {
	Option,
} from '../../../components/FormElements/ControlledAutocomplete'
import ControlledDatepicker from '../../../components/FormElements/ControlledDatepicker'
import moment from 'moment'
import { CheckupRecordData } from '../../../entities/record'
import { LoadingButton } from '@mui/lab'

type ExamOperationIdsData = OperationData & Option

type FormData = {
	examOperations: ExamOperationIdsData[]
	note: string
	reExamDate: string
}
const RequestReExamDialog = ({
	data: checkupData,
	open,
	closeModal,
}: {
	data: CheckupRecordData
	open: boolean
	closeModal: () => void
}) => {
	const [data, setData] = useState<ExamOperationIdsData[] | undefined>(
		undefined
	)
	const [totalPrice, setTotalPrice] = useState<number | undefined>(undefined)

	const [isLoading, setIsLoading] = useState(false)
	const [isConfirmed, setIsConfirmed] = useState(false)
	const { handleSubmit, trigger, watch, reset, register, ...methods } =
		useForm<FormData>({
			defaultValues: {
				examOperations: undefined,
				note: '',
				reExamDate: undefined,
			},
			mode: 'onChange',
		})

	const examOperationsWatch = watch('examOperations')

	const onSubmit = async ({ examOperations, note, reExamDate }: FormData) => {
		try {
			setIsLoading(true)
			await apiHelper.post(`patient/${checkupData.id}/reexam`, {
				patientId: checkupData.patientId,
				requiredTest: {
					examOperationIds: examOperations?.map((e) => Number(e.value)),
				},
				note,
				reExamDate,
				departmentId: checkupData.departmentId,
			})
		} catch (error) {
			console.error(error)
		} finally {
			setIsConfirmed(false)
			setIsLoading(false)
			closeModal()
		}
	}

	useEffect(() => {
		const queryData = async () => {
			try {
				const { data: _data }: { data: OperationData[] } = await apiHelper.get(
					`operations`
				)

				setData(
					_data.map((item) => ({
						...item,
						value: item.id?.toString(),
						label: item.name,
					}))
				)
			} catch (error) {
				console.error(error)
			}
		}
		queryData()
	}, [])

	useEffect(() => {
		setIsConfirmed(false)
		reset()
	}, [open, reset])

	useEffect(() => {
		if (examOperationsWatch?.length && Array.isArray(examOperationsWatch)) {
			setTotalPrice(
				examOperationsWatch?.reduce((prev, curr) => {
					return Number(Number(prev + Number(curr.price)).toFixed(0))
				}, 0)
			)
		}
	}, [examOperationsWatch])

	return (
		<Dialog
			open={open}
			onClose={() => {
				closeModal()
			}}
			maxWidth="md"
			fullWidth
		>
			<StyledDialogTitle>
				{isConfirmed ? 'Xác nhận tái khám' : 'Thông tin tái khám'}
			</StyledDialogTitle>
			<Box width="100%">
				<FormProvider
					{...methods}
					watch={watch}
					trigger={trigger}
					handleSubmit={handleSubmit}
					reset={reset}
					register={register}
				>
					<form onSubmit={handleSubmit(onSubmit)}>
						<DialogContent>
							<DialogContentText mb={4}>
								{isConfirmed
									? 'Vui lòng xác nhận tái khám dưới đây'
									: 'Vui lòng điền thông tin tái khám'}
							</DialogContentText>

							<Stack spacing={2}>
								<Box>
									<ControlledDatepicker
										name="reExamDate"
										label={'Ngày tái khám dự kiến'}
										rules={{ required: true }}
										dateProps={{
											disablePast: true,
											minDate: moment().add(1, 'days').toDate(),
											readOnly: isConfirmed,
										}}
									/>
								</Box>
								<Box width={'100%'} display={!isConfirmed ? 'block' : 'none'}>
									<ControlledAutocomplete
										name="examOperations"
										multiple
										label={'Loại xét nghiệm'}
										style={{ width: '100%' }}
										rules={{ required: true }}
										options={data ?? []}
									/>
								</Box>

								<Box mt={'40px !important'} />
								<Stack
									direction="row"
									spacing={4}
									sx={{
										mb: 4,
										display: examOperationsWatch?.length > 0 ? 'flex' : 'none',
										pb: 2,
									}}
									alignItems={'center'}
									borderBottom={'1px solid lightgray'}
									color="GrayText"
								>
									<Typography width={'5%'} textAlign="right">
										STT
									</Typography>
									<Typography width={'25%'}>Tên</Typography>
									<Typography width={'25%'}>BHYT</Typography>
									<Typography width={'30%'}>Ghi chú</Typography>
									<Typography width={'15%'} textAlign="right">
										Giá
									</Typography>
								</Stack>
								{!!examOperationsWatch?.length &&
									Array.isArray(examOperationsWatch) &&
									examOperationsWatch?.map((item, index) => (
										<Stack
											direction="row"
											spacing={4}
											key={`${item.id}`}
											alignItems={'center'}
										>
											<Typography width={'5%'} textAlign="right">
												{index + 1}
											</Typography>
											<Typography width={'25%'}>{item.name}</Typography>
											<Typography width={'25%'}>
												{renderEnumInsuranceStatus(item.insuranceStatus)}
											</Typography>
											<Typography width={'30%'}>{item.note}</Typography>
											<Typography
												fontWeight={'bold'}
												width={'15%'}
												textAlign="right"
											>
												{formatCurrency(item.price)}
											</Typography>
										</Stack>
									))}

								<Stack
									direction="row"
									spacing={4}
									sx={{
										mb: 4,
										display:
											examOperationsWatch?.length > 0
												? 'flex'
												: 'none !important',
										py: 2,
									}}
									alignItems={'center'}
									justifyContent={'flex-end'}
									borderTop={'1px solid lightgray'}
								>
									<Typography textAlign="right">Tổng cộng</Typography>
									<Typography
										width={'200px'}
										fontWeight="bold"
										fontSize="20px"
										textAlign="right"
									>
										{formatCurrency(totalPrice ?? 0)}
									</Typography>
								</Stack>

								<TextField
									label="Ghi chú"
									multiline
									type="text"
									rows={3}
									disabled={isConfirmed}
									{...register('note', {})}
								/>
							</Stack>
						</DialogContent>
						<DialogActions>
							<Button
								onClick={closeModal}
								color="warning"
								type="button"
								disabled={isLoading}
							>
								Huỷ
							</Button>
							<Button
								type="submit"
								variant="contained"
								sx={{ display: isConfirmed ? 'block' : 'none' }}
							>
								Xác nhận
							</Button>
							<LoadingButton
								type="button"
								variant="contained"
								loading={isLoading}
								sx={{ display: !isConfirmed ? 'block' : 'none' }}
								onClick={async () => {
									const result = await trigger(['examOperations', 'reExamDate'])
									if (!result) {
										return
									}
									setIsConfirmed(true)
								}}
							>
								Tiếp tục
							</LoadingButton>
						</DialogActions>
					</form>
				</FormProvider>
			</Box>
		</Dialog>
	)
}

export default RequestReExamDialog

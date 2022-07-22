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
	Autocomplete,
	Card,
	CardContent,
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
import { TestRecordData } from '../../../entities/record'
import { LoadingButton } from '@mui/lab'

type ExamOperationIdsData = OperationData & Option
const RequestOperationsDialog = ({
	id,
	data: testRecords,
	open,
	closeModal,
	saveProgress,
}: {
	id: number
	open: boolean
	data: TestRecordData[]
	closeModal: () => void
	saveProgress?: () => void
}) => {
	const [data, setData] = useState<ExamOperationIdsData[] | undefined>(
		undefined
	)
	const [totalPrice, setTotalPrice] = useState<number | undefined>(undefined)

	const [responseData, setResponseData] = useState<TestResponseData[]>([])
	const [showResponse, setShowResponse] = useState(false)

	const [isConfirmed, setIsConfirmed] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const router = useRouter()
	const { handleSubmit, trigger, watch, reset, ...methods } = useForm<{
		examOperations: ExamOperationIdsData[]
	}>({
		defaultValues: {
			examOperations: undefined,
		},
		mode: 'onChange',
	})

	const examOperationsWatch = watch('examOperations')

	const onSubmit = async ({ examOperations }: { examOperations: Option[] }) => {
		try {
			setIsLoading(true)
			const resp = await apiHelper.post(`checkup-records/${id}/tests`, {
				id,
				examOperationIds: examOperations?.map((e) => Number(e.value)),
			})

			setResponseData(resp?.data)
		} catch (error) {
			console.error(error)
		} finally {
			setIsLoading(false)
			setIsConfirmed(false)
			saveProgress?.()
			setShowResponse(true)
		}
	}

	useEffect(() => {
		const queryData = async () => {
			try {
				const { data: _data }: { data: OperationData[] } = await apiHelper.get(
					`operations`
				)

				setData(
					_data
						.filter(
							(item) =>
								testRecords?.findIndex((r) => r.operationId === item.id) < 0
						)
						.map((item) => ({
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
	}, [testRecords])

	useEffect(() => {
		setIsConfirmed(false)
		setShowResponse(false)
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
				if (showResponse) {
					router.push('/queue')
				}
			}}
			maxWidth="md"
			fullWidth={!showResponse}
		>
			<StyledDialogTitle>
				{showResponse
					? 'Thông tin xét nghiệm'
					: isConfirmed
					? 'Xác nhận xét nghiệm'
					: 'Chọn xét nghiệm'}
			</StyledDialogTitle>
			<DialogContent>
				<Box display={showResponse ? 'none' : 'block'} width="100%">
					<DialogContentText mb={4}>
						{showResponse
							? 'Người bệnh cần hoàn thành các xét nghiệm sau'
							: isConfirmed
							? 'Vui lòng xác nhận xét nghiệm cho phiên khám này'
							: 'Vui lòng chọn loại xét nghiệm cho người bệnh'}
					</DialogContentText>
					<FormProvider
						{...methods}
						watch={watch}
						trigger={trigger}
						handleSubmit={handleSubmit}
						reset={reset}
					>
						<form onSubmit={handleSubmit(onSubmit)}>
							<Stack spacing={2}>
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
							</Stack>
						</form>
					</FormProvider>
				</Box>
				<Box display={showResponse ? 'block' : 'none'}>
					<Stack spacing={2}>
						{!!responseData &&
							!!responseData?.length &&
							responseData?.map((item) => (
								<Card key={item.operationId}>
									<CardContent>
										<Typography fontWeight={'bold'} mb={2}>
											{item.operationName}
										</Typography>
										<Stack spacing={2}>
											<Stack direction="row" spacing={2}>
												<Typography width={80}>STT:</Typography>
												<Typography>{item.numericalOrder}</Typography>
											</Stack>
											<Stack direction="row" spacing={2}>
												<Typography width={80}>Nơi khám:</Typography>
												<Typography>
													Phòng {item.roomNumber} - Tầng {item.floor}
												</Typography>
											</Stack>
										</Stack>
									</CardContent>
								</Card>
							))}
					</Stack>
				</Box>
			</DialogContent>
			<DialogActions style={{ display: showResponse ? 'none' : 'flex' }}>
				<Button
					onClick={closeModal}
					color="warning"
					type="button"
					disabled={isLoading}
				>
					Huỷ
				</Button>
				<LoadingButton
					loading={isLoading}
					type="submit"
					variant="contained"
					onClick={() => handleSubmit(onSubmit)()}
					sx={{ display: isConfirmed ? 'block' : 'none' }}
				>
					Xác nhận
				</LoadingButton>
				<Button
					type="button"
					variant="contained"
					sx={{ display: !isConfirmed ? 'block' : 'none' }}
					onClick={async () => {
						const result = await trigger('examOperations')
						if (!result) {
							return
						}
						setIsConfirmed(true)
					}}
				>
					Tiếp tục
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default RequestOperationsDialog

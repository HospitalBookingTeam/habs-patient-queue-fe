import { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { Controller, useForm } from 'react-hook-form'
import apiHelper from '../../../utils/apiHelper'
import { DepartmentData } from '../../../entities/department'
import { AutocompleteOption } from '../../../entities/base'
import {
	Autocomplete,
	Card,
	CardContent,
	CardHeader,
	Checkbox,
	FormControlLabel,
	FormGroup,
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

type ExamOperationIdsData = OperationData & { value: number; label: string }
const RequestOperationsDialog = ({
	id,
	open,
	closeModal,
}: {
	id: number
	open: boolean
	closeModal: () => void
}) => {
	const [data, setData] = useState<ExamOperationIdsData[] | undefined>(
		undefined
	)
	const [totalPrice, setTotalPrice] = useState<number | undefined>(undefined)

	const [responseData, setResponseData] = useState<TestResponseData[]>([])
	const [showResponse, setShowResponse] = useState(false)

	const [examOperationIds, setExamOperationIds] = useState<
		ExamOperationIdsData[]
	>([])

	const [isConfirmed, setIsConfirmed] = useState(false)
	const router = useRouter()
	const {
		handleSubmit,

		formState: { isDirty },
	} = useForm()

	const onSubmit = async () => {
		try {
			const resp = await apiHelper.post(`checkup-records/${id}/tests`, {
				examOperationIds: examOperationIds?.map((e) => e.id),
			})

			setResponseData(resp?.data)
		} catch (error) {
			console.error(error)
		} finally {
			setIsConfirmed(false)
			setShowResponse(true)
		}
	}

	const getOpObj = (option: any) => {
		if (!option?.value) option = data?.find((op) => op.name === option)
		return option
	}

	useEffect(() => {
		const queryData = async () => {
			try {
				const { data: _data }: { data: OperationData[] } = await apiHelper.get(
					`operations`
				)

				setData(
					_data.map((item) => ({ ...item, value: item.id, label: item.name }))
				)
			} catch (error) {
				console.log(error)
			}
		}
		if (!id || !!data) return
		queryData()
	}, [id, data])

	useEffect(() => {
		setIsConfirmed(false)
		setShowResponse(false)
		setExamOperationIds([])
	}, [open])

	useEffect(() => {
		if (examOperationIds?.length && Array.isArray(examOperationIds)) {
			setTotalPrice(
				examOperationIds?.reduce((prev, curr) => {
					return Number(Number(prev + Number(curr.price)).toFixed(0))
				}, 0)
			)
		}
	}, [examOperationIds])

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
			<Box display={showResponse ? 'none' : 'block'} width="100%">
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogContent>
						<DialogContentText mb={4}>
							{isConfirmed
								? 'Vui lòng xác nhận xét nghiệm cho phiên khám này'
								: 'Vui lòng chọn loại xét nghiệm cho người bệnh'}
						</DialogContentText>

						<Stack spacing={2}>
							{/* <Controller
							name={'examOperationIds'}
							control={control}
							rules={{
								 ,
							}}
							render={({ field }) => (
								<>
									{data?.map((item) => (
										<FormControlLabel
											key={item.id}
											control={
												<Checkbox
													{...field}
													color="primary"
													onChange={() => {
														console.log('field.value', field.value)
														if (!(field.value as number[]).includes(item.id)) {
															field.onChange([...field.value, item.id])
															return
														}
														const newTopics = field.value.filter(
															(topic) => topic !== item.id
														)
														field.onChange(newTopics)
													}}
												/>
											}
											label={item.name}
										/>
									))}
								</>
							)}
						/> */}
							<Box width={'100%'} display={!isConfirmed ? 'block' : 'none'}>
								<Autocomplete
									multiple
									options={data ?? []}
									getOptionLabel={(option) => {
										return getOpObj(option) ? getOpObj(option)?.name : ''
									}}
									sx={{ width: '100%' }}
									renderInput={(params) => {
										return <TextField {...params} label="Loại xét nghiệm" />
									}}
									value={examOperationIds}
									onChange={(e, value) => {
										console.log('value', value)
										setExamOperationIds(value)
									}}
								/>
							</Box>

							<Box mt={'40px !important'} />
							<Stack
								direction="row"
								spacing={4}
								sx={{
									mb: 4,
									display: examOperationIds?.length > 0 ? 'flex' : 'none',
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
							{!!examOperationIds?.length &&
								Array.isArray(examOperationIds) &&
								examOperationIds?.map((item, index) => (
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
										examOperationIds?.length > 0 ? 'flex' : 'none !important',
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
					</DialogContent>
					<DialogActions>
						<Button onClick={closeModal} color="warning" type="button">
							Huỷ
						</Button>
						<Button
							type="submit"
							variant="contained"
							sx={{ display: isConfirmed ? 'block' : 'none' }}
						>
							Xác nhận
						</Button>
						<Button
							type="button"
							variant="contained"
							sx={{ display: !isConfirmed ? 'block' : 'none' }}
							onClick={() => setIsConfirmed(true)}
						>
							Tiếp tục
						</Button>
					</DialogActions>
				</form>
			</Box>

			<Box display={showResponse ? 'block' : 'none'}>
				<DialogContent>
					<Stack mb={4}>
						<DialogContentText>
							Người bệnh cần hoàn thành các xét nghiệm sau
						</DialogContentText>
					</Stack>
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
				</DialogContent>
			</Box>
		</Dialog>
	)
}

export default RequestOperationsDialog

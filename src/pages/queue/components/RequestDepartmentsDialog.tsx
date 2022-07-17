import { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import apiHelper from '../../../utils/apiHelper'
import {
	DepartmentData,
	DepartmentResponseData,
} from '../../../entities/department'
import { AutocompleteOption } from '../../../entities/base'
import {
	Alert,
	Autocomplete,
	Card,
	CardContent,
	Snackbar,
	Stack,
	Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import styled from '@emotion/styled'
import { StyledDialogTitle } from '../../../components/StyledModal'
import { useRouter } from 'next/router'
import ControlledAutocomplete from '../../../components/FormElements/ControlledAutocomplete'

const RequestDepartmentDialog = ({
	id,
	open,
	closeModal,
	saveProgress,
}: {
	id: number
	open: boolean
	closeModal: () => void
	saveProgress?: () => void
}) => {
	const [data, setData] = useState<
		(AutocompleteOption & { symptom?: string })[] | undefined
	>(undefined)
	const [isConfirmed, setIsConfirmed] = useState(false)
	const [showResponse, setShowResponse] = useState(false)

	const [responseData, setResponseData] = useState<DepartmentResponseData[]>([])
	const [toastOpen, setToastOpen] = useState(false)
	const router = useRouter()
	const { handleSubmit, reset, setValue, watch, trigger, ...methods } =
		useForm<{
			redirectDepartments: (AutocompleteOption & { symptom?: string })[]
		}>({
			defaultValues: {
				redirectDepartments: [],
			},
		})

	useEffect(() => {
		const queryData = async () => {
			try {
				const { data: _data }: { data: DepartmentData[] } = await apiHelper.get(
					`departments`
				)

				const redirectDepartments = _data?.map((d) => ({
					value: d.id,
					label: d.name,
					symptom: '',
				}))
				setData(redirectDepartments)
			} catch (error) {
				console.error(error)
			}
		}
		if (!id || !!data) return
		queryData()
	}, [id, data])

	useEffect(() => {
		setIsConfirmed(false)
		setShowResponse(false)
		reset()
	}, [open])

	const onSubmit = async ({
		redirectDepartments,
	}: {
		redirectDepartments: (AutocompleteOption & { symptom?: string })[]
	}) => {
		const redirectDepartmentIds = redirectDepartments?.map((item) => ({
			departmentId: Number(item.value),
			clinicalSymptom: item?.symptom ?? '',
		}))
		try {
			const resp = await apiHelper.post(`checkup-records/${id}/redirect`, {
				id,
				details: redirectDepartmentIds,
			})
			setResponseData(resp?.data)
			setToastOpen(true)
		} catch (error) {
			console.error(error)
		} finally {
			setIsConfirmed(false)
			saveProgress?.()
			setShowResponse(true)
		}
	}

	const redirectDepartmentsWatch = watch('redirectDepartments')
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
					? 'Thông tin chuyển khoa'
					: isConfirmed
					? 'Xác nhận chuyển khoa'
					: 'Chọn chuyên khoa'}
			</StyledDialogTitle>

			<Box display={showResponse ? 'none' : 'block'} width="100%">
				<FormProvider
					{...methods}
					watch={watch}
					trigger={trigger}
					handleSubmit={handleSubmit}
					setValue={setValue}
					reset={reset}
				>
					<form onSubmit={handleSubmit(onSubmit)}>
						<DialogContent>
							<DialogContentText mb={4}>
								{isConfirmed
									? 'Vui lòng xác nhận thông tin chuyển khoa'
									: 'Vui lòng chọn chuyên khoa để bàn giao người bệnh'}
							</DialogContentText>
							<Box width={'100%'} display={isConfirmed ? 'none' : 'block'}>
								<ControlledAutocomplete
									name="redirectDepartments"
									label={'Chuyên khoa'}
									style={{ minWidth: '100%' }}
									rules={{ required: true }}
									options={data ?? []}
									multiple
								/>
							</Box>

							<Box mt={3}></Box>

							<Stack
								direction="row"
								spacing={4}
								mb={2}
								alignItems={'center'}
								sx={{
									display:
										redirectDepartmentsWatch?.length > 0 ? 'flex' : 'none',
								}}
							>
								<Typography width={'20%'} color="GrayText">
									Tên khoa
								</Typography>
								<Typography width={'80%'} color="GrayText">
									Triệu chứng ban đầu
								</Typography>
							</Stack>
							{redirectDepartmentsWatch?.map(({ value, label, symptom }) => (
								<Stack
									direction="row"
									spacing={4}
									mb={2}
									key={`${value}`}
									alignItems={'baseline'}
								>
									<Typography width={'20%'}>{label}</Typography>
									{isConfirmed ? (
										<Typography width={'80%'}>{symptom}</Typography>
									) : (
										<StyledInput
											rows={3}
											value={symptom}
											onChange={(e) => {
												setValue(
													'redirectDepartments',
													redirectDepartmentsWatch?.map((d: any) => {
														if (d.value === value) {
															return {
																...d,
																symptom: e.target.value?.toString(),
															}
														}
														return d
													})
												)
											}}
										/>
									)}
								</Stack>
							))}
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
								onClick={async () => {
									const result = await trigger('redirectDepartments')
									if (!result) {
										return
									}
									setIsConfirmed(true)
								}}
								sx={{ display: !isConfirmed ? 'block' : 'none' }}
							>
								Tiếp tục
							</Button>
						</DialogActions>
					</form>
				</FormProvider>
			</Box>

			<Box display={showResponse ? 'block' : 'none'}>
				<DialogContent>
					<Stack mb={4}>
						<DialogContentText>
							Người bệnh được chuyển qua các khoa sau
						</DialogContentText>
					</Stack>
					<Stack spacing={2}>
						{!!responseData &&
							!!responseData?.length &&
							responseData?.map((item) => (
								<Card key={item.roomId}>
									<CardContent>
										<Typography fontWeight={'bold'} mb={2}>
											{item.departmentName}
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

			<Snackbar
				open={toastOpen}
				autoHideDuration={6000}
				onClose={() => setToastOpen(false)}
			>
				<Alert
					onClose={() => setToastOpen(false)}
					severity="success"
					sx={{ width: '100%' }}
				>
					Thành công
				</Alert>
			</Snackbar>
		</Dialog>
	)
}

export default RequestDepartmentDialog

const StyledInput = styled.textarea`
	padding: 12px 16px;
	width: 80%;
	resize: none;
	border-radius: 8px;
	font-family: 'Roboto';
`

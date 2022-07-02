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
import { Alert, Autocomplete, Snackbar, Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import styled from '@emotion/styled'
import { StyledDialogTitle } from '../../../components/StyledModal'
import { useRouter } from 'next/router'

// export interface RedirectData {
// 	departmentId: number
// 	clinicalSymptom: string
// }

const RequestDepartmentDialog = ({
	id,
	open,
	closeModal,
}: {
	id: number
	open: boolean
	closeModal: () => void
}) => {
	const [data, setData] = useState<
		(AutocompleteOption & { symptom?: string })[] | undefined
	>(undefined)
	const [isConfirmed, setIsConfirmed] = useState(false)

	const [toastOpen, setToastOpen] = useState(false)
	const router = useRouter()
	const {
		register,
		handleSubmit,
		control,
		reset,
		getValues,
		setValue,
		watch,
		formState: { isDirty },
	} = useForm<{
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
				console.log(error)
			}
		}
		if (!id || !!data) return
		queryData()
	}, [id, data])

	useEffect(() => {
		setIsConfirmed(false)
		reset()
	}, [open])

	const getOpObj = (option: any) => {
		if (!option?.value) option = data?.find((op) => op.label === option)
		return option
	}

	const onSubmit = async ({
		redirectDepartments,
	}: {
		redirectDepartments: (AutocompleteOption & { symptom?: string })[]
	}) => {
		console.log('redirectDepartments', redirectDepartments)
		const redirectDepartmentIds = redirectDepartments?.map((item) => ({
			departmentId: /*item.value */ 10003,
			clinicalSymptom: item?.symptom ?? '',
		}))
		try {
			await apiHelper.post(`checkup-records/${id}/redirect`, {
				details: redirectDepartmentIds?.slice(0, 1),
			})
			setToastOpen(true)
		} catch (error) {
			console.log(error)
		} finally {
			setIsConfirmed(false)
			closeModal()
			router.push('/queue')
		}
	}

	const redirectDepartmentsWatch = watch('redirectDepartments')
	return (
		<Dialog open={open} onClose={closeModal} maxWidth="md" fullWidth>
			<StyledDialogTitle>
				{isConfirmed ? 'Xác nhận chuyển khoa' : 'Chọn chuyên khoa'}
			</StyledDialogTitle>
			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogContent>
					<DialogContentText mb={4}>
						{isConfirmed
							? 'Vui lòng xác nhận thông tin chuyển khoa'
							: 'Vui lòng chọn chuyên khoa để bàn giao người bệnh'}
					</DialogContentText>
					<Box width={'100%'} display={isConfirmed ? 'none' : 'block'}>
						<Controller
							name="redirectDepartments"
							render={({ field: { ref, ...field }, fieldState: { error } }) => {
								return (
									<Autocomplete
										{...field}
										multiple
										options={data ?? []}
										getOptionLabel={(option) => {
											return getOpObj(option) ? getOpObj(option)?.label : ''
										}}
										isOptionEqualToValue={(option, value) => {
											return option.value === getOpObj(value)?.value
										}}
										sx={{ width: '100%' }}
										renderInput={(params) => {
											return (
												<TextField
													{...params}
													inputRef={ref}
													label="Chuyên khoa"
													error={!!error}
													helperText={error?.message}
												/>
											)
										}}
										onChange={(e, value) => {
											console.log('value', value)
											field.onChange(value)
										}}
										onInputChange={(_, data) => {
											if (data) field.onChange(data)
										}}
									/>
								)
							}}
							rules={{ required: true }}
							control={control}
						/>
					</Box>

					<Box mt={3}></Box>

					<Stack
						direction="row"
						spacing={4}
						mb={2}
						alignItems={'center'}
						sx={{
							display: redirectDepartmentsWatch?.length > 0 ? 'flex' : 'none',
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
							alignItems={'center'}
						>
							<Typography width={'20%'} color="GrayText">
								{label}
							</Typography>
							{isConfirmed ? (
								<Typography width={'80%'}>{symptom}</Typography>
							) : (
								<StyledInput
									rows={3}
									value={symptom}
									onChange={(e) => {
										setValue(
											'redirectDepartments',
											getValues('redirectDepartments')?.map((d: any) => {
												if (d.value === value) {
													return {
														...d,
														symptom: e.target.value?.toString().trim(),
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
						onClick={() => setIsConfirmed(true)}
						sx={{ display: !isConfirmed ? 'block' : 'none' }}
					>
						Tiếp tục
					</Button>
				</DialogActions>
			</form>

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
`

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

export interface RedirectData {
	departmentId: number
	clinicalSymptom: string
}

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
	const [redirectData, setRedirectData] = useState<RedirectData[]>([])

	const [toastOpen, setToastOpen] = useState(false)
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
			departmentId: item.value,
			clinicalSymptom: item?.symptom ?? '',
		}))
		try {
			await apiHelper.post(`checkup-records/${id}/redirect`, {
				details: redirectDepartmentIds,
			})
		} catch (error) {
			console.log(error)
		} finally {
			closeModal()
		}
	}

	console.log('get values', watch('redirectDepartments'))

	return (
		<Dialog open={open} onClose={closeModal} maxWidth="md" fullWidth>
			<DialogTitle>Chọn chuyên khoa</DialogTitle>
			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogContent>
					<DialogContentText mb={4}>
						Vui lòng chọn chuyên khoa để bàn giao người bệnh.
					</DialogContentText>
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

					<Box mt={3}></Box>
					{watch('redirectDepartments')?.map(({ value, label, symptom }) => (
						<Stack
							direction="row"
							spacing={4}
							mb={2}
							key={`${value}`}
							alignItems={'center'}
						>
							<Typography>{label}</Typography>
							<StyledInput
								type="text"
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
						</Stack>
					))}
				</DialogContent>
				<DialogActions>
					<Button onClick={closeModal} color="warning" type="button">
						Huỷ
					</Button>
					<Button type="submit" variant="contained">
						Xác nhận
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

const StyledInput = styled.input`
	padding: 12px 16px;
`

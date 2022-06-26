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
import { Autocomplete } from '@mui/material'

const RequestDepartmentDialog = ({
	id,
	open,
	closeModal,
}: {
	id: number
	open: boolean
	closeModal: () => void
}) => {
	const [data, setData] = useState<AutocompleteOption[] | undefined>(undefined)

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { isDirty },
	} = useForm({
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
		redirectDepartments: AutocompleteOption[]
	}) => {
		const redirectDepartmentIds = redirectDepartments?.map((item) => item.value)
		try {
			await apiHelper.post(`checkup-records/${id}/redirect`, {
				redirectDepartmentIds,
			})
		} catch (error) {
			console.log(error)
		} finally {
			closeModal()
		}
	}

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
										console.log('option', getOpObj(option))
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
									onChange={(e, value) => field.onChange(value)}
									onInputChange={(_, data) => {
										if (data) field.onChange(data)
									}}
								/>
							)
						}}
						rules={{ required: true }}
						control={control}
					/>
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
		</Dialog>
	)
}

export default RequestDepartmentDialog

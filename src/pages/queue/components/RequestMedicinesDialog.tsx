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
	Box,
	Checkbox,
	FormControlLabel,
	FormGroup,
	Stack,
	Typography,
} from '@mui/material'
import { OperationData } from '../../../entities/operation'
import { MedicineData } from '../../../entities/medicine'

const RequestMedicinesDialog = ({
	id,
	open,
	closeModal,
}: {
	id: number
	open: boolean
	closeModal: () => void
}) => {
	const [data, setData] = useState<MedicineData[] | undefined>(undefined)

	const [isMorning, setIsMorning] = useState(false)
	const [isMidday, setIsMidday] = useState(false)
	const [isEvening, setIsEvening] = useState(false)
	const [isNight, setIsNight] = useState(false)

	const {
		register,
		handleSubmit,
		control,
		reset,
		setValue,
		formState: { isDirty },
	} = useForm({
		defaultValues: {
			medicine: { id: 0, name: '' },
			quantity: 1,
			morningDose: 0,
			middayDose: 0,
			eveningDose: 0,
			nightDose: 0,
			usage: '',
		},
	})

	useEffect(() => {
		const queryData = async () => {
			try {
				const { data: _data }: { data: MedicineData[] } = await apiHelper.get(
					`medicines`
				)

				setData(_data)
			} catch (error) {
				console.log(error)
			}
		}
		if (!id || !!data) return
		queryData()
	}, [id, data])

	const onSubmit = async (values: any) => {
		try {
			await apiHelper.post(`checkup-records/${id}/prescription`, {
				note: values?.usage,
				details: [
					{
						usage: values?.usage,
						quantity: Number(values?.quantity),
						morningDose: Number(values?.morningDose),
						middayDose: Number(values?.middayDose),
						eveningDose: Number(values?.eveningDose),
						nightDose: Number(values?.nightDose),
						medicineId: Number(values?.medicine?.id),
					},
				],
			})
		} catch (error) {
			console.log(error)
		} finally {
			closeModal()
		}
	}

	const getOpObj = (option: any) => {
		if (!option?.name) option = data?.find((op) => op.id === option)
		return option
	}

	return (
		<Dialog open={open} onClose={closeModal} maxWidth="md" fullWidth>
			<DialogTitle>Chọn đơn thuốc</DialogTitle>
			<DialogContent>
				<DialogContentText mb={4}>
					Vui lòng chọn đơn thuốc phù hợp.
				</DialogContentText>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Stack spacing={4}>
						<Controller
							name="medicine"
							render={({ field: { ref, ...field }, fieldState: { error } }) => {
								return (
									<Autocomplete
										{...field}
										options={
											data?.map((option) => ({
												id: option.id,
												name: option.name,
											})) ?? []
										}
										getOptionLabel={(option) =>
											getOpObj(option) ? getOpObj(option)?.name : ''
										}
										isOptionEqualToValue={(option, value) => {
											return option.id === getOpObj(value)?.id
										}}
										sx={{ width: '100%' }}
										renderInput={(params) => {
											return (
												<TextField
													{...params}
													inputRef={ref}
													label="Thuốc"
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

						<Box maxWidth={250}>
							<TextField
								label="Số lượng"
								type="number"
								{...register('quantity', { required: true })}
							/>
						</Box>

						<Stack spacing={2}>
							<Stack direction={'row'} spacing={2} alignItems={'center'}>
								<Checkbox
									value={isMorning}
									onChange={(_, checked) => {
										setIsMorning(checked)
										if (!checked) {
											setValue('morningDose', 0)
										}
									}}
								/>

								<Typography>Buổi sáng</Typography>

								<TextField
									sx={{
										display: isMorning ? 'block' : 'none !important',
										maxWidth: '100px',
									}}
									type="number"
									hiddenLabel
									size="small"
									{...register('morningDose', { required: true })}
								/>
								<Typography
									sx={{
										display: isMorning ? 'block' : 'none !important',
									}}
								>
									viên
								</Typography>
							</Stack>

							<Stack direction={'row'} spacing={2} alignItems={'center'}>
								<Checkbox
									value={isMidday}
									onChange={(_, checked) => {
										setIsMidday(checked)
										if (!checked) {
											setValue('middayDose', 0)
										}
									}}
								/>

								<Typography>Buổi trưa</Typography>

								<TextField
									sx={{
										display: isMidday ? 'block' : 'none !important',
										maxWidth: '100px',
									}}
									type="number"
									hiddenLabel
									size="small"
									{...register('middayDose', { required: true })}
								/>
								<Typography
									sx={{
										display: isMidday ? 'block' : 'none !important',
									}}
								>
									viên
								</Typography>
							</Stack>
							<Stack direction={'row'} spacing={2} alignItems={'center'}>
								<Checkbox
									value={isEvening}
									onChange={(_, checked) => {
										setIsEvening(checked)
										if (!checked) {
											setValue('eveningDose', 0)
										}
									}}
								/>

								<Typography>Buổi chiều</Typography>

								<TextField
									sx={{
										display: isEvening ? 'block' : 'none !important',
										maxWidth: '100px',
									}}
									type="number"
									hiddenLabel
									size="small"
									{...register('eveningDose', { required: true })}
								/>
								<Typography
									sx={{
										display: isEvening ? 'block' : 'none !important',
									}}
								>
									viên
								</Typography>
							</Stack>

							<Stack direction={'row'} spacing={2} alignItems={'center'}>
								<Checkbox
									value={isNight}
									onChange={(_, checked) => {
										setIsNight(checked)
										if (!checked) {
											setValue('nightDose', 0)
										}
									}}
								/>

								<Typography>Buổi tối</Typography>

								<TextField
									sx={{
										display: isNight ? 'block' : 'none !important',
										maxWidth: '100px',
									}}
									type="number"
									hiddenLabel
									size="small"
									{...register('nightDose', { required: true })}
								/>
								<Typography
									sx={{
										display: isNight ? 'block' : 'none !important',
									}}
								>
									viên
								</Typography>
							</Stack>
						</Stack>

						<TextField
							label="Hướng dẫn"
							multiline
							type="text"
							rows={3}
							{...register('usage')}
						/>
					</Stack>
				</form>
			</DialogContent>
			<DialogActions>
				<Button onClick={closeModal} color="warning" type="button">
					Huỷ
				</Button>
				<Button
					type="submit"
					variant="contained"
					onClick={() => handleSubmit(onSubmit)()}
				>
					Xác nhận
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default RequestMedicinesDialog

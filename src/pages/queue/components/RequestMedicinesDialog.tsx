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
import {
	MedicineData,
	MedicineDetailData,
	MedicineRequestData,
} from '../../../entities/medicine'
import { DetailData } from '../../../entities/record'
import { StyledDialogTitle } from '../../../components/StyledModal'

const DEFAULT_VALUES = {
	medicine: { id: 0, name: '' },
	quantity: 1,
	morningDose: 0,
	middayDose: 0,
	eveningDose: 0,
	nightDose: 0,
	usage: '',
}
const RequestMedicinesDialog = ({
	id,
	open,
	closeModal,
	onAdd,
	medicineData,
}: {
	id: number
	open: boolean
	closeModal: () => void
	onAdd: (details: MedicineDetailData & Partial<MedicineData>) => void
	medicineData?: MedicineDetailData & Partial<MedicineData>
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
		defaultValues: DEFAULT_VALUES,
	})

	const usageRef = register('usage')
	const onSubmit = async (values: any) => {
		try {
			const medicine = data?.find(
				(item) => item.id === Number(values?.medicine?.id)
			)
			console.log('values', values)
			console.log('medicine', medicine)
			onAdd({
				...medicine,
				medicineName: medicine?.name ?? '',
				usage: values?.usage,
				quantity: Number(values?.quantity),
				morningDose: Number(values?.morningDose),
				middayDose: Number(values?.middayDose),
				eveningDose: Number(values?.eveningDose),
				nightDose: Number(values?.nightDose),
				medicineId: Number(values?.medicine?.id ?? values?.medicineId),
			})
			// await apiHelper.post(`checkup-records/${id}/prescription`, {
			// 	note: values?.usage,
			// 	details: [
			// 		{
			// 			usage: medicine?.usage,
			// 			quantity: Number(values?.quantity),
			// 			morningDose: Number(values?.morningDose),
			// 			middayDose: Number(values?.middayDose),
			// 			eveningDose: Number(values?.eveningDose),
			// 			nightDose: Number(values?.nightDose),
			// 			medicineId: Number(values?.medicine?.id),
			// 		},
			// 	],
			// })
		} catch (error) {
			console.log(error)
		} finally {
			closeModal()
		}
	}

	const getOpObj = (option: any) => {
		if (!option?.name) option = data?.find((op) => op.name === option)
		return option
	}

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
		queryData()
	}, [])

	useEffect(() => {
		if (!open) return
		if (!medicineData) {
			reset({ ...DEFAULT_VALUES })
			setIsMorning(false)
			setIsMidday(false)
			setIsEvening(false)
			setIsNight(false)
			return
		}

		console.log('medicineData', {
			...medicineData,
			medicine: { id: medicineData?.id, name: medicineData?.name },
		})
		if (Number(medicineData?.morningDose)) {
			setIsMorning(true)
		}
		if (Number(medicineData?.middayDose)) {
			setIsMidday(true)
		}
		if (Number(medicineData?.eveningDose)) {
			setIsEvening(true)
		}
		if (Number(medicineData?.nightDose)) {
			setIsNight(true)
		}
		reset({
			...medicineData,
			usage: medicineData?.usage,
			quantity: Number(medicineData?.quantity),
			morningDose: Number(medicineData?.morningDose),
			middayDose: Number(medicineData?.middayDose),
			eveningDose: Number(medicineData?.eveningDose),
			nightDose: Number(medicineData?.nightDose),
			medicine: { id: medicineData?.id ?? 0, name: medicineData?.name ?? '' },
		})
	}, [open])

	return (
		<Dialog open={open} onClose={closeModal} maxWidth="md" fullWidth>
			<StyledDialogTitle>Chọn đơn thuốc</StyledDialogTitle>
			<DialogContent>
				<DialogContentText mb={4}>
					Vui lòng chọn đơn thuốc phù hợp.
				</DialogContentText>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Stack spacing={4}>
						<Stack spacing={2} direction="row">
							<Controller
								name="medicine"
								render={({
									field: { ref, ...field },
									fieldState: { error },
								}) => {
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
								rules={{}}
								control={control}
							/>

							<Box maxWidth={250}>
								<TextField
									label="Số lượng"
									type="number"
									{...register('quantity', {})}
								/>
							</Box>
						</Stack>

						<Stack spacing={4} direction="row">
							<Stack direction={'row'} spacing={2} alignItems={'center'}>
								<Checkbox
									value={isMorning}
									checked={isMorning}
									onChange={(_, checked) => {
										setIsMorning(checked)
										if (!checked) {
											setValue('morningDose', 0)
										}
									}}
								/>

								<Typography>Sáng</Typography>

								<TextField
									sx={{
										display: isMorning ? 'block' : 'none !important',
										maxWidth: '100px',
									}}
									type="number"
									hiddenLabel
									size="small"
									{...register('morningDose', {})}
								/>
							</Stack>

							<Stack direction={'row'} spacing={2} alignItems={'center'}>
								<Checkbox
									value={isMidday}
									checked={isMidday}
									onChange={(_, checked) => {
										setIsMidday(checked)
										if (!checked) {
											setValue('middayDose', 0)
										}
									}}
								/>

								<Typography>Trưa</Typography>

								<TextField
									sx={{
										display: isMidday ? 'block' : 'none !important',
										maxWidth: '100px',
									}}
									type="number"
									hiddenLabel
									size="small"
									{...register('middayDose', {})}
								/>
							</Stack>
							<Stack direction={'row'} spacing={2} alignItems={'center'}>
								<Checkbox
									value={isEvening}
									checked={isEvening}
									onChange={(_, checked) => {
										setIsEvening(checked)
										if (!checked) {
											setValue('eveningDose', 0)
										}
									}}
								/>

								<Typography>Chiều</Typography>

								<TextField
									sx={{
										display: isEvening ? 'block' : 'none !important',
										maxWidth: '100px',
									}}
									type="number"
									hiddenLabel
									size="small"
									{...register('eveningDose', {})}
								/>
							</Stack>

							<Stack direction={'row'} spacing={2} alignItems={'center'}>
								<Checkbox
									value={isNight}
									checked={isNight}
									onChange={(_, checked) => {
										setIsNight(checked)
										if (!checked) {
											setValue('nightDose', 0)
										}
									}}
								/>

								<Typography>Tối</Typography>

								<TextField
									sx={{
										display: isNight ? 'block' : 'none !important',
										maxWidth: '100px',
									}}
									type="number"
									hiddenLabel
									size="small"
									{...register('nightDose', {})}
								/>
							</Stack>
						</Stack>

						<TextField
							label="Hướng dẫn"
							multiline
							type="text"
							rows={3}
							{...usageRef}
							onChange={(e) => usageRef?.onChange(e)}
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

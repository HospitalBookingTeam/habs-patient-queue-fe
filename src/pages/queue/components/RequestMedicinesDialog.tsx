import { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import {
	Controller,
	FieldValues,
	FormProvider,
	FormState,
	useForm,
	useFormContext,
	UseFormRegister,
	UseFormReset,
} from 'react-hook-form'
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
import ControlledAutocomplete, {
	Option,
} from '../../../components/FormElements/ControlledAutocomplete'

const DEFAULT_VALUES = {
	medicine: undefined,
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
		reset,
		setValue,
		formState: { errors, ...formState },
		...methods
	} = useForm<{
		medicine: Option
		quantity: number
		morningDose: number
		middayDose: number
		eveningDose: number
		nightDose: number
		usage: string
	}>({
		defaultValues: DEFAULT_VALUES,
		mode: 'onChange',
	})

	const usageRef = register('usage')
	const onSubmit = async (values: any) => {
		try {
			const medicine = data?.find(
				(item) =>
					item.id === Number(values?.medicine?.value ?? values?.medicineId)
			)

			onAdd({
				medicineName: medicine?.name ?? '',
				usage: values?.usage,
				quantity: Number(values?.quantity),
				morningDose: Number(values?.morningDose),
				middayDose: Number(values?.middayDose),
				eveningDose: Number(values?.eveningDose),
				nightDose: Number(values?.nightDose),
				medicineId: Number(values?.medicine?.value ?? values?.medicineId),
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
			console.error(error)
		} finally {
			closeModal()
		}
	}

	useEffect(() => {
		const queryData = async () => {
			try {
				const { data: _data }: { data: MedicineData[] } = await apiHelper.get(
					`medicines`
				)

				setData(_data)
			} catch (error) {
				console.error(error)
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
			usage: medicineData?.usage,
			quantity: Number(medicineData?.quantity),
			morningDose: Number(medicineData?.morningDose),
			middayDose: Number(medicineData?.middayDose),
			eveningDose: Number(medicineData?.eveningDose),
			nightDose: Number(medicineData?.nightDose),
			medicine: {
				value: medicineData?.medicineId?.toString(),
				label: medicineData?.medicineName,
			},
		})
	}, [open, medicineData])

	return (
		<Dialog open={open} onClose={closeModal} maxWidth="md" fullWidth>
			<StyledDialogTitle>Chọn đơn thuốc</StyledDialogTitle>
			<DialogContent>
				<DialogContentText mb={4}>
					Vui lòng chọn đơn thuốc phù hợp.
				</DialogContentText>
				<FormProvider
					{...methods}
					handleSubmit={handleSubmit}
					reset={reset}
					formState={{ ...formState, errors }}
					register={register}
					setValue={setValue}
				>
					<form>
						<Stack spacing={4}>
							<Stack spacing={2} direction="row">
								<ControlledAutocomplete
									name="medicine"
									label={'Thuốc'}
									style={{ width: '350px' }}
									rules={{ required: true }}
									options={
										data?.map((option) => ({
											value: option.id?.toString(),
											label: option.name,
										})) ?? []
									}
									disabled={!!medicineData}
								/>

								<Box maxWidth={250}>
									<TextField
										label="Số lượng"
										type="number"
										error={!!errors?.quantity}
										{...register('quantity', { min: 0 })}
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
										error={!!errors?.morningDose}
										{...register('morningDose', { min: 0 })}
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
										error={!!errors?.middayDose}
										{...register('middayDose', { min: 0 })}
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
										error={!!errors?.eveningDose}
										{...register('eveningDose', { min: 0 })}
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
										error={!!errors?.nightDose}
										{...register('nightDose', { min: 0 })}
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
				</FormProvider>
			</DialogContent>
			<DialogActions>
				<Button onClick={closeModal} color="warning">
					Huỷ
				</Button>
				<Button variant="contained" onClick={() => handleSubmit(onSubmit)()}>
					Xác nhận
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default RequestMedicinesDialog

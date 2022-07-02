import {
	Alert,
	Autocomplete,
	Button,
	Paper,
	Snackbar,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { AutocompleteOption } from '../../../../entities/base'
import {
	MedicineData,
	MedicineDetailData,
	MedicineRequestData,
} from '../../../../entities/medicine'
import { CheckupRecordData, DetailData } from '../../../../entities/record'
import apiHelper from '../../../../utils/apiHelper'
import RequestMedicinesDialog from '../RequestMedicinesDialog'

const Medicine = ({
	data,
	icdList,
}: {
	data?: CheckupRecordData
	icdList?: AutocompleteOption[]
}) => {
	const { register, control, handleSubmit } = useForm()
	const [isRequestMedicinesOpen, setIsRequestMedicinesOpen] = useState(false)

	console.log('data', data)
	const [toastOpen, setToastOpen] = useState(false)
	const [medicineList, setMedicineList] = useState<
		(MedicineDetailData & Partial<MedicineData>)[]
	>([])
	const onSubmit = async (values: any) => {
		try {
			await Promise.all([
				await apiHelper.put(`checkup-records/${data?.id}`, {
					icdDiseaseId: values?.icdDisease?.value,
				}),
				await apiHelper.post(`checkup-records/${data?.id}/prescription`, {
					note: values?.note,
					details: medicineList?.map((medicine) => ({
						usage: medicine?.usage,
						quantity: medicine.quantity,
						morningDose: medicine.morningDose,
						middayDose: medicine.middayDose,
						eveningDose: medicine.eveningDose,
						nightDose: medicine.nightDose,
						medicineId: medicine.medicineId,
					})),
				}),
			])

			setToastOpen(true)
		} catch (error) {
			console.log(error)
		}
	}

	const getOpObj = (option: any) => {
		if (!option?.value) option = icdList?.find((op) => op.label === option)
		return option
	}

	return (
		<Stack
			spacing={5}
			p={2}
			borderRadius={'4px'}
			sx={{ boxShadow: '2px 2px 2px 2px #00000040' }}
		>
			<Typography fontWeight="bold" color={'GrayText'}>
				Đơn thuốc
			</Typography>

			<form onSubmit={handleSubmit(onSubmit)}>
				<Stack spacing={2}>
					<Controller
						name="icdDisease"
						render={({ field: { ref, ...field }, fieldState: { error } }) => {
							return (
								<Autocomplete
									{...field}
									options={icdList ?? []}
									getOptionLabel={(option) =>
										getOpObj(option) ? getOpObj(option)?.label : ''
									}
									isOptionEqualToValue={(option, value) => {
										return option.value === getOpObj(value)?.value
									}}
									sx={{ width: '100%' }}
									renderInput={(params) => {
										return (
											<TextField
												{...params}
												inputRef={ref}
												label="Chuẩn đoán"
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
				</Stack>

				<Stack spacing={2} mt={4}>
					<Box maxWidth={200}>
						<Button
							type="button"
							color={'info'}
							variant="contained"
							onClick={() => setIsRequestMedicinesOpen(true)}
						>
							Thêm thuốc
						</Button>
					</Box>

					{medicineList && medicineList?.length > 0 && (
						<TableContainer component={Paper}>
							<Table sx={{ minWidth: 700 }} aria-label="customized table">
								<TableHead>
									<TableRow>
										<TableCell>Tên</TableCell>
										<TableCell align="right">Số lượng</TableCell>
										<TableCell>HDSD</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{medicineList?.map((medicine) => (
										<TableRow key={medicine.medicineId}>
											<TableCell component="th" scope="row">
												{medicine?.name}
											</TableCell>
											<TableCell align="right">{medicine.quantity}</TableCell>
											<TableCell>{medicine.usage}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					)}

					<TextField
						label="Ghi chú"
						multiline
						type="text"
						rows={3}
						{...register('note', { required: true })}
					/>

					<Box ml="auto !important">
						<Button type="submit" variant="contained">
							Lưu
						</Button>
					</Box>
				</Stack>
			</form>

			<RequestMedicinesDialog
				id={data?.id ?? 0}
				open={isRequestMedicinesOpen}
				closeModal={() => setIsRequestMedicinesOpen(false)}
				onAdd={(detail) => setMedicineList((list) => [...list, detail])}
			/>

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
		</Stack>
	)
}

export default Medicine

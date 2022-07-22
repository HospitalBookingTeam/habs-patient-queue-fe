import {
	Alert,
	Autocomplete,
	Button,
	IconButton,
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
import React, { useEffect, useState } from 'react'
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
import { uniq, filter, uniqBy } from 'lodash'
import { DeleteSharp, Edit } from '@mui/icons-material'
import { renderDoseContent } from '../../../../utils/formats'
import { useMedicineState } from '../../../../hooks/useMedicine'

export type MedData = MedicineDetailData & Partial<MedicineData>
const Medicine = ({
	data,
	icdList,
	isSave,
}: {
	data?: CheckupRecordData
	icdList?: AutocompleteOption[]
	isSave: boolean
}) => {
	const { register, handleSubmit, reset } = useForm()
	const [isRequestMedicinesOpen, setIsRequestMedicinesOpen] = useState(false)

	const [toastOpen, setToastOpen] = useState(false)
	const [medicineList, setMedicineList] = useState<MedData[]>([])
	const [currentEditMedData, setCurrentEditMedData] = useState<
		MedData | undefined
	>(undefined)

	const { setMedicineState } = useMedicineState()
	const onSubmit = async (values: any) => {
		try {
			setMedicineState((state) => ({ ...state, isLoading: true }))
			await apiHelper.post(`checkup-records/${data?.id}/prescription`, {
				id: data?.id,
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
				setToastOpen(true)
		} catch (error) {
			console.log(error)
		} finally {
			setMedicineState((state) => ({ ...state, isLoading: false }))
		}
	}

	useEffect(() => {
		if (!isSave) return
		handleSubmit(onSubmit)()
	}, [isSave])

	useEffect(() => {
		if (!data) return
		setMedicineList(data?.prescription?.details ?? [])
		reset({
			note: data?.prescription?.note,
			icdDisease: {
				value: data?.icdDiseaseId,
				label: `${data?.icdCode} - ${data?.icdDiseaseName}`,
			},
		})
	}, [data])

	return (
		<Stack
			spacing={5}
			p={2}
			borderRadius={'4px'}
			sx={{ boxShadow: '2px 2px 2px 2px #00000040' }}
		>
			<Stack direction="row" justifyContent="space-between" alignItems="center">
				<Typography color={'GrayText'} fontWeight="bold">
					Đơn thuốc
				</Typography>
				<Box maxWidth={200}>
					<Button
						type="button"
						color={'info'}
						variant="contained"
						onClick={() => {
							setIsRequestMedicinesOpen(true)
							setCurrentEditMedData(undefined)
						}}
					>
						Thêm thuốc
					</Button>
				</Box>
			</Stack>

			<form onSubmit={handleSubmit(onSubmit)}>
				<Stack spacing={2}>
					{medicineList && medicineList?.length > 0 && (
						<TableContainer component={Paper}>
							<Table sx={{ minWidth: 700 }} aria-label="customized table">
								<TableHead>
									<TableRow>
										<TableCell>Tên</TableCell>
										<TableCell align="right">Số lượng</TableCell>
										<TableCell>Liều dùng</TableCell>
										<TableCell>HDSD</TableCell>
										<TableCell></TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{medicineList?.map((medicine) => (
										<TableRow key={medicine.medicineId}>
											<TableCell component="th" scope="row">
												{medicine?.medicineName ?? medicine?.name}
											</TableCell>
											<TableCell align="right">{medicine.quantity}</TableCell>
											<TableCell>{renderDoseContent(medicine)}</TableCell>
											<TableCell>{medicine.usage}</TableCell>
											<TableCell>
												<Stack
													direction="row"
													spacing={2}
													alignItems="center"
													justifyContent="flex-end"
												>
													<IconButton
														onClick={() => {
															setCurrentEditMedData(medicine)
															setIsRequestMedicinesOpen(true)
														}}
													>
														<Edit />
													</IconButton>
													<IconButton
														onClick={() =>
															setMedicineList((list) =>
																filter(
																	list,
																	(item) =>
																		item.medicineId !== medicine.medicineId
																)
															)
														}
													>
														<DeleteSharp />
													</IconButton>
												</Stack>
											</TableCell>
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
						{...register('note', {})}
					/>
				</Stack>
			</form>

			<RequestMedicinesDialog
				id={data?.id ?? 0}
				open={isRequestMedicinesOpen}
				closeModal={() => setIsRequestMedicinesOpen(false)}
				onAdd={(detail) => {
					setMedicineList((list) => {
						const isExist = list?.findIndex(
							(item) => item.medicineId === detail.medicineId
						)
						if (isExist >= 0)
							return list?.map((item: MedData) => {
								if (item.medicineId === detail.medicineId) return detail
								return item
							})
						return [...list, detail]
					})
					setCurrentEditMedData(undefined)
				}}
				medicineData={currentEditMedData}
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

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
	Checkbox,
	FormControlLabel,
	FormGroup,
	Stack,
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

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { isDirty },
	} = useForm({
		defaultValues: {
			details: [],
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

	const onSubmit = async ({ details }: { details: number[] }) => {
		const mappedDetails = details?.map((detail) => ({
			medicineId: detail,
			quantity: 1,
			usage: ' ',
			morningDose: 1,
			middayDose: 1,
			eveningDose: 1,
			nightDose: 1,
		}))
		try {
			await apiHelper.post(`checkup-records/${id}/prescription`, {
				note: 'demo',
				details: mappedDetails,
			})
		} catch (error) {
			console.log(error)
		} finally {
			closeModal()
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Dialog
				open={open}
				onClose={closeModal}
				maxWidth="md"
				fullWidth
				scroll="paper"
			>
				<DialogTitle>Chọn đơn thuốc</DialogTitle>
				<DialogContent>
					<DialogContentText mb={4}>
						Vui lòng chọn chuyên khoa để bàn giao người bệnh.
					</DialogContentText>

					<Stack spacing={2}>
						<Controller
							name={'details'}
							control={control}
							rules={{
								required: true,
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
						/>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeModal} color="warning" type="button">
						Huỷ
					</Button>
					<Button type="submit" variant="contained">
						Xác nhận
					</Button>
				</DialogActions>
			</Dialog>
		</form>
	)
}

export default RequestMedicinesDialog

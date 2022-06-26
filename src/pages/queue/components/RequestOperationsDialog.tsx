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

const RequestOperationsDialog = ({
	id,
	open,
	closeModal,
}: {
	id: number
	open: boolean
	closeModal: () => void
}) => {
	const [data, setData] = useState<OperationData[] | undefined>(undefined)

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { isDirty },
	} = useForm({
		defaultValues: {
			examOperationIds: [],
		},
	})

	useEffect(() => {
		const queryData = async () => {
			try {
				const { data: _data }: { data: OperationData[] } = await apiHelper.get(
					`operations`
				)

				setData(_data)
			} catch (error) {
				console.log(error)
			}
		}
		if (!id || !!data) return
		queryData()
	}, [id, data])

	const onSubmit = async ({
		examOperationIds,
	}: {
		examOperationIds: number[]
	}) => {
		try {
			await apiHelper.post(`checkup-records/${id}/tests`, {
				examOperationIds,
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

					<Stack spacing={2}>
						<Controller
							name={'examOperationIds'}
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
														console.log('field.value', field.value)
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
			</form>
		</Dialog>
	)
}

export default RequestOperationsDialog

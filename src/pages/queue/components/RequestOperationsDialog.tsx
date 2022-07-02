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
	Typography,
} from '@mui/material'
import { OperationData } from '../../../entities/operation'
import { Box } from '@mui/system'
import { renderEnumInsuranceStatus } from '../../../utils/renderEnums'
import { formatCurrency } from '../../../utils/formats'
import { StyledDialogTitle } from '../../../components/StyledModal'

const RequestOperationsDialog = ({
	id,
	open,
	closeModal,
}: {
	id: number
	open: boolean
	closeModal: () => void
}) => {
	const [data, setData] = useState<
		(OperationData & { value: number; label: string })[] | undefined
	>(undefined)

	const [isConfirmed, setIsConfirmed] = useState(false)

	const {
		register,
		watch,
		handleSubmit,
		control,
		reset,
		formState: { isDirty },
	} = useForm<{
		examOperationIds: (OperationData & { value: number; label: string })[]
	}>({
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

				setData(
					_data.map((item) => ({ ...item, value: item.id, label: item.name }))
				)
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
	}, [])

	const onSubmit = async ({
		examOperationIds,
	}: {
		examOperationIds: (OperationData & { value: number; label: string })[]
	}) => {
		try {
			await apiHelper.post(`checkup-records/${id}/tests`, {
				examOperationIds: examOperationIds?.map((e) => e.id),
			})
		} catch (error) {
			console.log(error)
		} finally {
			closeModal()
			setIsConfirmed(false)
		}
	}

	const getOpObj = (option: any) => {
		if (!option?.value) option = data?.find((op) => op.name === option)
		return option
	}

	const examOperationsIdWatch = watch('examOperationIds')

	const totalPrice = examOperationsIdWatch?.reduce((prev, curr) => {
		return Number(Number(prev + Number(curr.price)).toFixed(0))
	}, 0)
	return (
		<Dialog open={open} onClose={closeModal} maxWidth="md" fullWidth>
			<StyledDialogTitle>
				{isConfirmed ? 'Xác nhận xét nghiệm' : 'Chọn xét nghiệm'}
			</StyledDialogTitle>
			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogContent>
					<DialogContentText mb={4}>
						{isConfirmed
							? 'Vui lòng xác nhận xét nghiệm cho phiên khám này'
							: 'Vui lòng chọn loại xét nghiệm cho người bệnh'}
					</DialogContentText>

					<Stack spacing={2}>
						{/* <Controller
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
						/> */}
						<Box width={'100%'} display={!isConfirmed ? 'block' : 'none'}>
							<Controller
								name="examOperationIds"
								render={({
									field: { ref, ...field },
									fieldState: { error },
								}) => {
									return (
										<Autocomplete
											{...field}
											multiple
											options={data ?? []}
											getOptionLabel={(option) => {
												return getOpObj(option) ? getOpObj(option)?.name : ''
											}}
											isOptionEqualToValue={(option, value) => {
												return option.id === getOpObj(value)?.id
											}}
											sx={{ width: '100%' }}
											renderInput={(params) => {
												return (
													<TextField
														{...params}
														inputRef={ref}
														label="Loại xét nghiệm"
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

						<Box mt={'40px !important'} />
						<Stack
							direction="row"
							spacing={4}
							sx={{
								mb: 4,
								display: examOperationsIdWatch?.length > 0 ? 'flex' : 'none',
								pb: 2,
							}}
							alignItems={'center'}
							borderBottom={'1px solid lightgray'}
							color="GrayText"
						>
							<Typography width={'5%'} textAlign="right">
								STT
							</Typography>
							<Typography width={'30%'}>Tên</Typography>
							<Typography width={'20%'}>BHYT</Typography>
							<Typography width={'30%'}>Ghi chú</Typography>
							<Typography width={'15%'} textAlign="right">
								Giá
							</Typography>
						</Stack>
						{examOperationsIdWatch?.map((item, index) => (
							<Stack
								direction="row"
								spacing={4}
								key={`${item.id}`}
								alignItems={'center'}
							>
								<Typography width={'5%'} textAlign="right">
									{index + 1}
								</Typography>
								<Typography width={'30%'}>{item.name}</Typography>
								<Typography width={'20%'}>
									{renderEnumInsuranceStatus(item.insuranceStatus)}
								</Typography>
								<Typography width={'30%'}>{item.note}</Typography>
								<Typography fontWeight={'bold'} width={'15%'} textAlign="right">
									{formatCurrency(item.price)}
								</Typography>
							</Stack>
						))}

						<Stack
							direction="row"
							spacing={4}
							sx={{
								mb: 4,
								display: examOperationsIdWatch?.length > 0 ? 'flex' : 'none',
								py: 2,
							}}
							alignItems={'center'}
							justifyContent={'flex-end'}
							borderTop={'1px solid lightgray'}
						>
							<Typography textAlign="right">Tổng cộng</Typography>
							<Typography
								width={'200px'}
								fontWeight="bold"
								fontSize="20px"
								textAlign="right"
							>
								{formatCurrency(totalPrice)}
							</Typography>
						</Stack>
					</Stack>
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
						sx={{ display: !isConfirmed ? 'block' : 'none' }}
						onClick={() => setIsConfirmed(true)}
					>
						Tiếp tục
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	)
}

export default RequestOperationsDialog

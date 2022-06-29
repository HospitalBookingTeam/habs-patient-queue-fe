import {
	Autocomplete,
	Button,
	Stack,
	TextField,
	Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { AutocompleteOption } from '../../../../entities/base'
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

	const onSubmit = async (values: any) => {
		console.log('values', values)
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
			<Typography bold color={'GrayText'}>
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

					<TextField
						label="Lời khuyên bác sĩ"
						multiline
						type="text"
						rows={3}
						{...register('doctorAdvice', { required: true })}
					/>
					<TextField
						label="Mô tả"
						multiline
						type="text"
						rows={3}
						{...register('diagnosis', { required: true })}
					/>
				</Stack>
			</form>

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

			{!!data && (
				<>
					<RequestMedicinesDialog
						id={data.id}
						open={isRequestMedicinesOpen}
						closeModal={() => setIsRequestMedicinesOpen(false)}
					/>
				</>
			)}
		</Stack>
	)
}

export default Medicine

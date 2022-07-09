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

import {
	CheckupRecordData,
	DetailData,
	PrescriptionData,
} from '../../../../entities/record'
import { renderDoseContent } from '../../../../utils/formats'

const Medicine = ({ data }: { data?: CheckupRecordData }) => {
	console.log('data', data)

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

			<Stack spacing={2} mt={2}>
				{!!data &&
					!!data?.prescription &&
					data?.prescription?.details?.length > 0 && (
						<TableContainer component={Paper}>
							<Table sx={{ minWidth: 700 }} aria-label="customized table">
								<TableHead>
									<TableRow>
										<TableCell>Tên</TableCell>
										<TableCell align="right">Số lượng</TableCell>
										<TableCell>Liều dùng</TableCell>
										<TableCell>HDSD</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{data?.prescription?.details?.map((medicine) => (
										<TableRow key={medicine.medicineId}>
											<TableCell component="th" scope="row">
												{medicine?.medicineName}
											</TableCell>
											<TableCell align="right">{medicine.quantity}</TableCell>
											<TableCell>{renderDoseContent(medicine)}</TableCell>
											<TableCell>{medicine.usage}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					)}
			</Stack>
		</Stack>
	)
}

export default Medicine

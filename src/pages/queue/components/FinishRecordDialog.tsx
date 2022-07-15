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
import { Alert, Autocomplete, Snackbar, Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import styled from '@emotion/styled'
import { CheckupRecordStatus } from '../../../utils/renderEnums'
import { useRouter } from 'next/router'
import { CheckupRecordData } from '../../../entities/record'
import { StyledDialogTitle } from '../../../components/StyledModal'

const FinishRecordDialog = ({
	data,
	open,
	closeModal,
}: {
	data: CheckupRecordData
	open: boolean
	closeModal: () => void
}) => {
	const [toastOpen, setToastOpen] = useState(false)
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const onConfirm = async () => {
		try {
			setLoading(true)
			await apiHelper.put(`checkup-records/${data.id}`, {
				status: CheckupRecordStatus['Kết thúc'],
				id: data.id,
				patientId: data.patientId,
			})
		} catch (error) {
			console.error(error)
		} finally {
			closeModal()
			setLoading(false)
			setToastOpen(true)
			router.push('/queue')
		}
	}

	return (
		<Dialog open={open} onClose={closeModal} maxWidth="sm">
			<StyledDialogTitle>Kết thúc khám</StyledDialogTitle>
			<DialogContent>
				<DialogContentText mb={4}>
					Vui lòng bấm xác nhận để kết thúc khám cho nguời bệnh.
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={closeModal}
					color="warning"
					type="button"
					disabled={loading}
				>
					Huỷ
				</Button>
				<Button onClick={onConfirm} variant="contained" disabled={loading}>
					{loading ? 'Đang xử lý' : 'Xác nhận'}
				</Button>
			</DialogActions>

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
		</Dialog>
	)
}

export default FinishRecordDialog

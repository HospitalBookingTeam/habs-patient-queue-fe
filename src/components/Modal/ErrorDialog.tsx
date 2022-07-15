import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Stack,
	Typography,
} from '@mui/material'
import { ReactNode } from 'react'
import { StyledDialogTitle } from '../StyledModal'

const ErrorDialog = ({
	open,
	handleClose,
	message,
	title = 'Lỗi',
}: {
	open: boolean
	handleClose: () => void
	message?: ReactNode
	title?: ReactNode
}) => {
	return (
		<Dialog onClose={handleClose} maxWidth="xs" open={open}>
			<StyledDialogTitle background="red" color="white">
				{title}
			</StyledDialogTitle>
			<DialogContent>
				<Stack width="100%" height="100%">
					<DialogContentText id="error-dialog">{message}</DialogContentText>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="error" size="small">
					Đã hiểu
				</Button>
			</DialogActions>
		</Dialog>
	)
}
export default ErrorDialog

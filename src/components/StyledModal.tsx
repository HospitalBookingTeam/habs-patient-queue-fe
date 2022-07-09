import styled from '@emotion/styled'
import { DialogTitle } from '@mui/material'

export const StyledDialogTitle = styled(DialogTitle)<{
	background?: string
	color?: string
}>`
	background: ${({ background }) => background ?? '#87eab1'};
	margin-bottom: 1em;
	color: ${({ color }) => color ?? 'black'};
`

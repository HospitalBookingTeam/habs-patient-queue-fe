import styled from '@emotion/styled'
import { Paper, Typography } from '@mui/material'

export const Item = styled(Paper)<{ isFirst?: boolean }>(
	({ theme, isFirst }) => ({
		textAlign: 'center',
		color: '#1C1B1F',
		height: 60,
		lineHeight: '60px',
		background: isFirst ? 'rgb(135, 234, 177)' : '#f9f9f9',
		padding: '12px 1rem',
		position: 'relative',
		textDecoration: 'none',
	})
)

export const StyledGradientTypo = styled(Typography)`
	font-size: 32px;
	background: -webkit-linear-gradient(#1ac88a, #2f9d67);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
`

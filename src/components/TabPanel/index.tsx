import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

interface TabPanelProps {
	children?: React.ReactNode
	index: number
	value: number
}
const TabPanel = (props: TabPanelProps) => {
	const { children, value, index, ...other } = props
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			<Box sx={{ p: 3 }}>{children}</Box>
		</div>
	)
}

export default TabPanel

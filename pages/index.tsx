import * as React from 'react'
import type { NextPage } from 'next'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Link from '../src/Link'
import Copyright from '../src/Copyright'
import ButtonAppBar from '../components/ButtonAppBar'

const Home: NextPage = () => {
	return (
		<Container maxWidth="lg">
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<ButtonAppBar />
				<Typography variant="h4" component="h1" gutterBottom>
					Trang chủ
				</Typography>
				<Link href="/about" color="secondary">
					Xem hàng chờ
				</Link>
				<Copyright />
			</Box>
		</Container>
	)
}

export default Home

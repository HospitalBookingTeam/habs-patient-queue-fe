import * as React from 'react'
import type { NextPage } from 'next'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Copyright from '../Copyright'
import ButtonAppBar from './ButtonAppBar'
import Sidebar from './Sidebar'
import { Toolbar } from '@mui/material'
import Head from 'next/head'
import useAuth from '../hooks/useAuth'
import Login from '../pages/login'
import { useRouter } from 'next/router'
import Image from 'next/image'
import useToast from '../hooks/useToast'
import { ErrorDialog } from './Modal'

type Props = {
	children: React.ReactNode
}

const PageLayout: NextPage<Props> = ({ children }: Props) => {
	const { isAuthenticated } = useAuth()
	const { open, closeToast, toastData } = useToast()

	const router = useRouter()

	React.useEffect(() => {
		if (!isAuthenticated) router.push('/login')
	}, [router, isAuthenticated])

	return (
		<div className="root">
			<nav>
				<ButtonAppBar />
			</nav>
			<main>
				<Container
					maxWidth="lg"
					sx={{
						padding: '0 !important',
					}}
				>
					<Box sx={{ display: 'flex' }}>
						<Box
							component="main"
							sx={{ flexGrow: 1, p: 4, minHeight: '100vh' }}
						>
							<Toolbar />
							{children}
						</Box>
					</Box>
				</Container>
			</main>
			<footer>
				<Copyright />
			</footer>

			<ErrorDialog
				open={!!open && toastData?.variant === 'error'}
				handleClose={closeToast}
				message={toastData?.message}
			/>
		</div>
	)
}

export default PageLayout

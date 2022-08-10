import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import useAuth, { AuthInformation } from '../hooks/useAuth'
import { Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function ButtonAppBar() {
	const { logout, information } = useAuth()
	const [doctorInfo, setDoctorInfo] = useState<AuthInformation | undefined>(
		undefined
	)
	const router = useRouter()

	useEffect(() => {
		if (!information) return
		setDoctorInfo(information)
	}, [information])

	return (
		<AppBar
			position="fixed"
			sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
		>
			<Toolbar>
				<Stack direction="row" justifyContent="space-between" width="100%">
					<Stack direction="row" spacing={2} alignItems="center">
						<Button onClick={() => router.push('/queue')}>
							<Image src="/images/logo.svg" width={40} height={40} />
						</Button>
						<Stack spacing={1}>
							<Typography
								fontWeight={'bold'}
								fontSize="14px"
								sx={{ flexGrow: 1 }}
							>
								Bệnh viện Nhi đồng 2
							</Typography>
							<Typography fontSize="12px">Bác sĩ</Typography>
						</Stack>
					</Stack>
					<Stack direction="row" spacing={4} alignItems="center">
						<Typography>BS. {doctorInfo?.name ?? '---'}</Typography>
						<Button color="inherit" variant="contained" onClick={logout}>
							Đăng xuất
						</Button>
					</Stack>
				</Stack>
			</Toolbar>
		</AppBar>
	)
}

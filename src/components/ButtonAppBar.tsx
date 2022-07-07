import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Link from '../Link'
import useAuth from '../hooks/useAuth'
import { Stack } from '@mui/material'

export default function ButtonAppBar() {
	const { logout, information } = useAuth()
	return (
		<AppBar
			position="fixed"
			sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
		>
			<Toolbar>
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
					Bệnh viện Nhi đồng 2 - Bác sĩ
				</Typography>
				<Stack direction="row" spacing={4} alignItems="center">
					<Typography>BS. {information?.name}</Typography>
					<Button color="inherit" variant="contained" onClick={logout}>
						Đăng xuất
					</Button>
				</Stack>
			</Toolbar>
		</AppBar>
	)
}

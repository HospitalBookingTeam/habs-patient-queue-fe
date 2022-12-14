import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import MailIcon from '@mui/icons-material/Mail'
import { useRouter } from 'next/router'

const drawerWidth = 240

export default function Sidebar() {
	const router = useRouter()
	return (
		<Drawer
			variant="permanent"
			sx={{
				width: drawerWidth,
				flexShrink: 0,
				[`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
			}}
		>
			<Toolbar />
			<Box sx={{ overflow: 'auto' }}>
				<List>
					{['Hàng chờ'].map((text, index) => (
						<ListItem key={text} disablePadding>
							<ListItemButton onClick={() => router.push('/queue')}>
								<ListItemIcon>
									{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
								</ListItemIcon>
								<ListItemText
									primary={text}
									primaryTypographyProps={{
										sx: { fontWeight: '600', fontSize: '0.8rem' },
									}}
								/>
								<ListItemText
									primary={'100+'}
									primaryTypographyProps={{
										sx: { fontWeight: '600', fontSize: '0.8rem' },
									}}
								/>
							</ListItemButton>
						</ListItem>
					))}
				</List>
				<Divider />
			</Box>
		</Drawer>
	)
}

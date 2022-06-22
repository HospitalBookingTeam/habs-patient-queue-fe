import { Box } from '@mui/system'
import Image from 'next/image'

const Loading = () => {
	return (
		<Box
			position="absolute"
			top="0"
			right="0"
			width="100%"
			height="100%"
			zIndex="9999"
			sx={{
				background: '#f9f9f9',
			}}
		>
			<Box
				m="auto"
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					height: '100%',
				}}
			>
				<Image
					src="/images/loading.gif"
					alt="loading"
					width={200}
					height={200}
				/>
			</Box>
		</Box>
	)
}

export default Loading

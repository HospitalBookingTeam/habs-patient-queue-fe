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
			zIndex="99"
			sx={{
				background: '#f9f9f9',
			}}
		>
			<Image src="/images/loading.gif" alt="loading" layout="fill" />
		</Box>
	)
}

export default Loading

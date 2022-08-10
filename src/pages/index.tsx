import type { NextPage } from 'next'
import Typography from '@mui/material/Typography'
import PageLayout from '../components/PageLayout'
import BasicMeta from '../components/meta/BasicMeta'
import OpenGraphMeta from '../components/meta/OpenGraphMeta'
import { ErrorDialog } from '../components/Modal'
import useToast from '../hooks/useToast'

const Home: NextPage = () => {
	const url = '/'
	const title = 'Trang chủ'

	return (
		<PageLayout>
			<BasicMeta url={url} title={title} />
			<OpenGraphMeta url={url} title={title} />
		</PageLayout>
	)
}

export async function getServerSideProps() {
	return {
		redirect: {
			destination: '/queue',
			permanent: false,
		},
	}
}

export default Home

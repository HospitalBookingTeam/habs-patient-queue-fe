import type { NextPage } from 'next'
import Typography from '@mui/material/Typography'
import Link from '../Link'
import PageLayout from '../components/PageLayout'
import BasicMeta from '../components/meta/BasicMeta'
import OpenGraphMeta from '../components/meta/OpenGraphMeta'

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

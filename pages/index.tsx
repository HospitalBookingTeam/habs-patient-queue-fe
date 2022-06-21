import type { NextPage } from 'next'
import Typography from '@mui/material/Typography'
import Link from '../src/Link'
import PageLayout from '../src/components/PageLayout'
import BasicMeta from '../src/components/meta/BasicMeta'
import OpenGraphMeta from '../src/components/meta/OpenGraphMeta'

const Home: NextPage = () => {
	const url = '/'
	const title = 'Trang chủ'
	return (
		<PageLayout>
			<BasicMeta url={url} title={title} />
			<OpenGraphMeta url={url} title={title} />
			<Typography variant="h4" component="h1" gutterBottom>
				Trang chủ
			</Typography>
			<Link href="/queue" color="secondary">
				Xem hàng chờ
			</Link>
		</PageLayout>
	)
}

export default Home

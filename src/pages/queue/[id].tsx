import React from 'react'
import { useRouter } from 'next/router'
import PageLayout from '../../components/PageLayout'

const QueueDetailPage = () => {
	const router = useRouter()
	const { id } = router.query
	return (
		<PageLayout>
			<div>QueueDetailPage {id}</div>
		</PageLayout>
	)
}

export default QueueDetailPage

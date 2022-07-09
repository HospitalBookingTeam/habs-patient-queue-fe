import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import PageLayout from '../../components/PageLayout'
import { atom, selectorFamily } from 'recoil'
import { CheckupRecordData } from '../../entities/record'
import apiHelper from '../../utils/apiHelper'
import { Button, Paper, Stack, Typography } from '@mui/material'

import PatientInfoTab from './components/PatientInfoTab'
import CheckupTab from './components/CheckupTab'
import { formatDate } from '../../utils/formats'
import { ChevronLeft } from '@mui/icons-material'

const ATOM_KEY = 'checkup-record'

export const checkUpAtom = atom<CheckupRecordData>({
	key: ATOM_KEY,
	default: undefined,
})

const QueueDetailPage = () => {
	const router = useRouter()
	const { id } = router.query

	const [data, setData] = useState<CheckupRecordData | undefined>(undefined)

	useEffect(() => {
		const queryData = async () => {
			try {
				const dataResponse = await apiHelper.get(`checkup-records/${id}`)

				setData(dataResponse?.data)
			} catch (error) {
				console.log(error)
			}
		}
		if (!id) return
		queryData()
	}, [id])

	return (
		<PageLayout>
			<Button
				startIcon={<ChevronLeft />}
				onClick={() => router.push('/queue')}
				color="secondary"
				sx={{ mb: 3 }}
			>
				Quay lại
			</Button>

			<Paper sx={{ p: 3 }}>
				<Stack
					spacing={4}
					direction={'row'}
					alignItems={'center'}
					justifyContent={'space-between'}
					mb={3}
				>
					<Typography>
						Thời gian:{' '}
						<span style={{ color: 'green' }}>
							{data?.date ? formatDate(data?.date) : '---'}
						</span>
					</Typography>
				</Stack>

				<Stack spacing={4}>
					<PatientInfoTab patientData={data?.patientData} />
					<CheckupTab data={data} />
				</Stack>
			</Paper>
		</PageLayout>
	)
}

export default QueueDetailPage

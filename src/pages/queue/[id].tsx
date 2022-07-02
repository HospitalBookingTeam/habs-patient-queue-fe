import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import PageLayout from '../../components/PageLayout'
import { atom, selectorFamily } from 'recoil'
import { CheckupRecordData } from '../../entities/record'
import apiHelper from '../../utils/apiHelper'
import {
	Autocomplete,
	Button,
	Stack,
	Tab,
	Tabs,
	Typography,
} from '@mui/material'
import { IcdData } from '../../entities/icd'
import { Box } from '@mui/system'

import TabPanel from '../../components/TabPanel'
import PatientInfoTab from './components/PatientInfoTab'
import CheckupTab from './components/CheckupTab'
import RecordTabs from './components/RecordsTab'

const ATOM_KEY = 'checkup-record'

export const checkUpAtom = atom<CheckupRecordData>({
	key: ATOM_KEY,
	default: undefined,
})

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	}
}

const QueueDetailPage = () => {
	const router = useRouter()
	const { id } = router.query

	const [data, setData] = useState<CheckupRecordData | undefined>(undefined)
	const [icdList, setIcdList] = useState<
		{ value: number; label: string }[] | undefined
	>(undefined)

	const [tab, setTab] = React.useState(0)

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setTab(newValue)
	}

	useEffect(() => {
		const queryData = async () => {
			try {
				const [dataResponse, IcdResponse] = await Promise.all([
					apiHelper.get(`checkup-records/${id}`),
					apiHelper.get(`icd`),
				])
				setIcdList(
					IcdResponse?.data?.map((icd: IcdData) => ({
						value: icd.id,
						label: `${icd.code} - ${icd.name}`,
					}))
				)
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
			<Stack
				spacing={4}
				direction={'row'}
				alignItems={'center'}
				justifyContent={'space-between'}
				mb={3}
			>
				<Typography variant="h5">
					Bệnh nhân <span style={{ color: 'green' }}>{data?.patientName}</span>
				</Typography>

				{data?.isReExam && (
					<Typography
						sx={{
							p: 2,
							background: '#87eab1',
							borderRadius: '8px',
							fontSize: '13px',
						}}
					>
						Tái khám
					</Typography>
				)}
			</Stack>

			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs value={tab} onChange={handleChange}>
					<Tab label="Thông tin cơ bản" {...a11yProps(0)} />
					<Tab label="Hồ sơ người bệnh" {...a11yProps(1)} />
					<Tab label="Khám" {...a11yProps(2)} />
				</Tabs>
			</Box>

			<TabPanel value={tab} index={0}>
				<PatientInfoTab patientData={data?.patientData} />
			</TabPanel>
			<TabPanel value={tab} index={1}>
				<RecordTabs data={data} />
			</TabPanel>
			<TabPanel value={tab} index={2}>
				<CheckupTab data={data} icdList={icdList} />
			</TabPanel>
		</PageLayout>
	)
}

export default QueueDetailPage

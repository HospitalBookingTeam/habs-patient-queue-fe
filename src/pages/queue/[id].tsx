import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import PageLayout from '../../components/PageLayout'
import { atom, selectorFamily } from 'recoil'
import { CheckupRecordData } from '../../entities/record'
import apiHelper from '../../utils/apiHelper'
import { Stack, TextField, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'

const ATOM_KEY = 'checkup-record'

export const checkUpAtom = atom<CheckupRecordData>({
	key: ATOM_KEY,
	default: undefined,
})

const QueueDetailPage = () => {
	const router = useRouter()
	const { id } = router.query

	const [data, setData] = useState<CheckupRecordData | undefined>(undefined)

	const { register, handleSubmit, reset } = useForm({
		defaultValues: {
			bloodPressure: 0,
			temperature: 0,
			pulse: 0,
			icdDiseaseId: 0,
			doctorAdvice: '',
		},
	})

	useEffect(() => {
		const queryData = async () => {
			try {
				const response = await apiHelper.get(`checkup-records/${id}`)
				setData(response?.data)
				reset(response?.data)
			} catch (error) {
				console.log(error)
			}
		}
		if (!id || !!data) return
		queryData()
	}, [id, data])

	return (
		<PageLayout>
			<Typography variant="h5" mb={5}>
				Bệnh nhân <span style={{ color: 'green' }}>{data?.patientName}</span>
			</Typography>

			<Stack spacing={4}>
				<Typography>Thông tin khám bệnh</Typography>

				<Stack>
					<Stack direction="row" spacing={4}>
						<TextField
							inputProps={{ readOnly: true }}
							label="Nhịp tim"
							type="text"
							{...register('bloodPressure', { required: true })}
						/>
						<TextField
							inputProps={{ readOnly: true }}
							label="Huyết áp"
							type="text"
							{...register('pulse', { required: true })}
						/>
						<TextField
							inputProps={{ readOnly: true }}
							label="Nhiệt độ"
							type="text"
							{...register('temperature', { required: true })}
						/>
					</Stack>
				</Stack>
			</Stack>
		</PageLayout>
	)
}

export default QueueDetailPage

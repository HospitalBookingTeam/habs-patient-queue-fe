import styled from '@emotion/styled'
import { ChevronRight } from '@mui/icons-material'
import { Pagination, Stack, Typography, Link } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { CheckupRecordData, RecordItemData } from '../../../../entities/record'
import apiHelper from '../../../../utils/apiHelper'
import { formatDate } from '../../../../utils/formats'

const RecordTabs = ({ data }: { data?: CheckupRecordData }) => {
	const [recordList, setRecordList] = useState<RecordItemData[]>([])
	const [pageIndex, setPageIndex] = useState(1)
	const [pageSize, setPageSize] = useState(5)
	const [totalPages, setTotalPages] = useState(1)

	useEffect(() => {
		const queryData = async () => {
			try {
				const response = await apiHelper.get('checkup-records', {
					params: {
						'patient-id': data?.patientId,
						pageIndex,
						pageSize,
					},
				})
				setRecordList(response?.data?.data)
				setPageIndex(response?.data?.pageIndex)
				setTotalPages(response?.data?.totalPage)
			} catch (error) {
				console.error(error)
			}
		}
		if (!data) return
		queryData()
	}, [data, pageIndex, pageSize])

	return (
		<div>
			<Box mt={4} />

			<Stack spacing={2} mb={3}>
				{!!recordList && !!recordList?.length ? (
					recordList?.map((record) => {
						return (
							<StyledLink href={`/records?id=${record.id}`} target="_blank">
								<Stack
									direction="row"
									justifyContent="space-between"
									alignItems="center"
								>
									<Stack spacing={2}>
										<Typography color="GrayText">
											{record?.date ? formatDate(record.date) : '---'}
										</Typography>
										<Typography>{record?.departmentName ?? '---'}</Typography>
										<Typography>
											Bác sĩ: {record?.doctorName ?? '---'}
										</Typography>
									</Stack>

									<ChevronRight />
								</Stack>
							</StyledLink>
						)
					})
				) : (
					<Box p={6} mx="auto">
						<Typography>Chưa có dữ liệu</Typography>
					</Box>
				)}
			</Stack>
			<Stack
				justifyContent="center"
				mx="auto"
				display={!!recordList && !!recordList?.length ? 'flex' : 'none'}
			>
				<Pagination
					sx={{ margin: '0 auto' }}
					count={totalPages}
					onChange={(e, page) => {
						console.log(page)
						setPageIndex(page)
					}}
				/>
			</Stack>
		</div>
	)
}

const StyledLink = styled(Link)`
	background: whitesmoke;
	padding: 12px 1em;
	border-radius: 8px;
	color: #050505;
`

export default RecordTabs

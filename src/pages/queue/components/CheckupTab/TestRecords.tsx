import { ArrowDownward, ArrowUpward } from '@mui/icons-material'
import { Button, Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useState } from 'react'
import PdfViewer from '../../../../components/PdfViewer'
import { TestRecordData } from '../../../../entities/record'

const TestRecords = ({ testRecords }: { testRecords?: TestRecordData[] }) => {
	return (
		<Stack>
			<Typography color={'GrayText'}>Thông tin xét nghiệm</Typography>
			<Stack spacing={4} mb={4}>
				{testRecords && testRecords?.length > 0 ? (
					testRecords?.map((test) => <TestRecord key={test.id} record={test} />)
				) : (
					<Box p={5}>
						<Typography color="GrayText">Chưa có xét nghiệm nào</Typography>
					</Box>
				)}
			</Stack>
		</Stack>
	)
}
export default TestRecords

const TestRecord = ({ record }: { record: TestRecordData }) => {
	const [isExpanded, setIsExpanded] = useState(false)

	return (
		<Stack>
			<Button
				color="secondary"
				endIcon={!isExpanded ? <ArrowDownward /> : <ArrowUpward />}
				onClick={() => setIsExpanded((expanded) => !expanded)}
			>
				<Stack spacing={2} direction="row">
					<Typography>{record?.operationName}</Typography>
					<Typography>{record?.roomNumber}</Typography>
				</Stack>
			</Button>
			<Box display={isExpanded ? 'block' : 'none'}>
				<PdfViewer url={record?.resultFileLink} width={720} pageNumber={1} />
			</Box>
		</Stack>
	)
}

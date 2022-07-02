import { ArrowDownward, ArrowUpward } from '@mui/icons-material'
import { Button, Collapse, Link, Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useState } from 'react'
import PdfViewer from '../../../../components/PdfViewer'
import { TestRecordData } from '../../../../entities/record'
import { formatDate } from '../../../../utils/formats'

const TestRecords = ({ testRecords }: { testRecords?: TestRecordData[] }) => {
	return (
		<Stack>
			<Typography color={'GrayText'}>Các xét nghiệm</Typography>
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
		<Stack my={2}>
			<Button
				color="secondary"
				endIcon={!isExpanded ? <ArrowDownward /> : <ArrowUpward />}
				onClick={() => setIsExpanded((expanded) => !expanded)}
				variant="outlined"
				sx={{ justifyContent: 'space-between' }}
			>
				<Stack spacing={2}>
					<Stack direction="row" spacing={4}>
						<Typography>{record?.operationName}</Typography>
					</Stack>
					<Stack direction="row" spacing={2}>
						<Typography color="GrayText">
							Phòng {record?.roomNumber} - Tầng {record?.floor}
						</Typography>
					</Stack>
					<Stack direction="row" spacing={2}>
						<Typography color="GrayText">
							Thời gian: {formatDate(record?.date)}
						</Typography>
					</Stack>
					<Stack direction="row" spacing={2}>
						<Typography color="GrayText">
							Bác sĩ: {record?.doctorName ?? '---'}
						</Typography>
					</Stack>
				</Stack>
			</Button>
			<Collapse in={isExpanded}>
				<Stack spacing={2} mt={2}>
					<Link
						target="_blank"
						href={record?.resultFileLink}
						sx={{ color: 'steelblue' }}
					>
						Tải về
					</Link>
					<iframe
						src={`${record?.resultFileLink}#toolbar=0`}
						width={720}
						height="560"
						allow="autoplay"
					/>
					{/* <iframe
						src={`https://drive.google.com/file/d/0BxOcNbrgoHyZSXZSQ05hZlpQNlFZN2xDN2RhWHVHUGx4VmI4/preview?resourcekey=0-b5uRkOID0gcgUj3TfxTegQ#toolbar=0`}
						width={640}
						height="480"
						allow="autoplay"
					/> */}
				</Stack>
			</Collapse>
		</Stack>
	)
}

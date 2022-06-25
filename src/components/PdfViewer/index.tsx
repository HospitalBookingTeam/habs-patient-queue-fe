import React, { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

const PdfViewer = ({
	url,
	width,
	pageNumber = 1,
}: {
	url: string
	width: number
	pageNumber?: number
}) => {
	const [file, setFile] = useState(url)
	const [numPages, setNumPages] = useState(0)
	const [currentPage, setCurrentPage] = useState(1)

	function onFileChange(event: any) {
		setFile(event.target.files[0])
	}

	function onDocumentLoadSuccess({ numPages: nextNumPages }: any) {
		setNumPages(nextNumPages)
	}

	return (
		<Document
			file={file}
			options={{
				cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
				cMapPacked: true,
			}}
			onLoadSuccess={onDocumentLoadSuccess}
		>
			{Array.from({ length: numPages }, (_, index) => (
				<Page key={`page_${index + 1}`} pageNumber={index + 1} />
			))}
		</Document>
	)
}
export default PdfViewer

export enum CheckupRecordStatus {
	CHO_TAI_KHAM,
	DA_DAT_LICH,
	DA_THANH_TOAN,
	CHECKED_IN,
	DANG_KHAM,
	CHO_THANH_TOAN_XN,
	CHECKED_IN_SAU_XN,
	CHO_KET_QUA_XN,
	DA_CO_KET_QUA_XN,
	KET_THUC,
	CHUYEN_KHOA,
	NHAP_VIEN,
	DA_HUY,
	DA_XOA,
}

export enum TestRecordStatus {
	CHUA_DAT_LICH,
	DA_DAT_LICH,
	DA_THANH_TOAN,
	CHECKED_IN,
	DANG_TIEN_HANH,
	CHO_KET_QUA,
	HOAN_THANH,
	DA_HUY,
	DA_XOA,
}

export const CHECKUP_TRANSLATION: {
	[key in keyof typeof CheckupRecordStatus]: string
} = {
	CHO_TAI_KHAM: 'Chờ tái khám',
	DA_DAT_LICH: 'Đã đặt lịch',
	DA_THANH_TOAN: 'Chờ khám',
	CHECKED_IN: 'Đã checkin',
	DANG_KHAM: 'Đang khám',
	CHO_THANH_TOAN_XN: 'Chờ thanh toán phí xét nghiệm',
	CHECKED_IN_SAU_XN: 'Đã checkin',
	CHO_KET_QUA_XN: 'Chờ kết quả xét nghiệm',
	DA_CO_KET_QUA_XN: 'Đã có kết quả xét nghiệm',
	KET_THUC: 'Kết thúc',
	CHUYEN_KHOA: 'Chuyển khoa',
	NHAP_VIEN: 'Nhập viện',
	DA_HUY: 'Đã hủy',
	DA_XOA: 'Đã xóa',
}
export const CHECKUP_TRANSLATION_RE_EXAM: {
	[key in keyof typeof CheckupRecordStatus]: string
} = {
	DA_THANH_TOAN: 'Tái khám',
	CHO_TAI_KHAM: 'Chờ tái khám',
	DA_DAT_LICH: 'Đã đặt lịch',
	CHECKED_IN: 'Đã checkin',
	DANG_KHAM: 'Đang khám',
	CHO_THANH_TOAN_XN: 'Chờ thanh toán phí xét nghiệm',
	CHECKED_IN_SAU_XN: 'Đã checkin',
	CHO_KET_QUA_XN: 'Chờ kết quả xét nghiệm',
	DA_CO_KET_QUA_XN: 'Đã có kết quả xét nghiệm (tái khám)',
	KET_THUC: 'Kết thúc',
	CHUYEN_KHOA: 'Chuyển khoa',
	NHAP_VIEN: 'Nhập viện',
	DA_HUY: 'Đã hủy',
	DA_XOA: 'Đã xóa',
}

export const renderEnumCheckupRecordStatus = (status: number) =>
	CheckupRecordStatus[status]

export const translateCheckupRecordStatus = (
	status: number,
	isReExam = false
) =>
	isReExam
		? CHECKUP_TRANSLATION_RE_EXAM[
				CheckupRecordStatus[status] as keyof typeof CheckupRecordStatus
		  ]
		: CHECKUP_TRANSLATION[
				CheckupRecordStatus[status] as keyof typeof CheckupRecordStatus
		  ]

export const TEST_RECORD_TRANSLATION: {
	[key in keyof typeof TestRecordStatus]: string
} = {
	CHUA_DAT_LICH: 'Chưa đặt lịch',
	DA_DAT_LICH: 'Đã đặt lịch',
	DA_THANH_TOAN: 'Chờ xét nghiệm',
	CHECKED_IN: 'Đã checkin',
	DANG_TIEN_HANH: 'Đang xét nghiệm',
	CHO_KET_QUA: 'Chờ kết quả',
	HOAN_THANH: 'Hoàn thành',
	DA_HUY: 'Đã hủy',
	DA_XOA: 'Đã xóa',
}

export const renderEnumTestRecordStatus = (status: number) =>
	TestRecordStatus[status]

export const translateTestRecordStatus = (status: number) =>
	TEST_RECORD_TRANSLATION[
		TestRecordStatus[status] as keyof typeof TestRecordStatus
	]

export enum InsuranceSupportStatus {
	'Không hỗ trợ',
	'Hỗ trợ một phần',
	'Hỗ trợ toàn phần',
}

export const renderEnumInsuranceStatus = (status: number) =>
	InsuranceSupportStatus[status]

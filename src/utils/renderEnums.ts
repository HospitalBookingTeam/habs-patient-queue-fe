export enum CheckupRecordStatus {
	CHO_TAI_KHAM,
	DA_DAT_LICH,
	DA_THANH_TOAN,
	DANG_KHAM,
	CHO_THANH_TOAN_XN,
	CHO_KET_QUA_XN,
	DA_CO_KET_QUA_XN,
	KET_THUC,
	CHUYEN_KHOA,
	NHAP_VIEN,
	DA_HUY,
	DA_XOA,
}

export const CHECKUP_TRANSLATION: {
	[key in keyof typeof CheckupRecordStatus]: string
} = {
	CHO_TAI_KHAM: 'Chờ tái khám',
	DA_DAT_LICH: 'Đã đặt lịch',
	DA_THANH_TOAN: 'Chờ khám',
	DANG_KHAM: 'Đang khám',
	CHO_THANH_TOAN_XN: 'Chờ thanh toán phí xét nghiệm',
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
	CHO_TAI_KHAM: 'Chờ tái khám',
	DA_DAT_LICH: 'Đã đặt lịch',
	DA_THANH_TOAN: 'Tái khám',
	DANG_KHAM: 'Đang khám',
	CHO_THANH_TOAN_XN: 'Chờ thanh toán phí xét nghiệm',
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

export enum InsuranceSupportStatus {
	'Không hỗ trợ',
	'Hỗ trợ một phần',
	'Hỗ trợ toàn phần',
}

export const renderEnumInsuranceStatus = (status: number) =>
	InsuranceSupportStatus[status]

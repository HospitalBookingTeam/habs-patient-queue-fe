export enum CheckupRecordStatus {
	'Chờ tái khám',
	'Đã đặt lịch',
	'Chờ khám',
	'Đang khám',
	'Chờ thanh toán phí xét nghiệm',
	'Chờ kết quả xét nghiệm',
	'Đã có kết quả xét nghiệm',
	'Kết thúc',
	'Chuyển khoa',
	'Nhập viện',
	'Đã hủy',
	'Đã xóa',
}

export const renderEnumCheckupRecordStatus = (status: number) => CheckupRecordStatus[status];

export enum InsuranceSupportStatus {
	'Không hỗ trợ',
	'Hỗ trợ một phần',
	'Hỗ trợ toàn phần',
}

export const renderEnumInsuranceStatus = (status: number) => InsuranceSupportStatus[status];

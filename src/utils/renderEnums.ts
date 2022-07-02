export enum CheckupRecordStatus {
	'Chờ tái khám',
	DA_DAT_LICH,
	'Chờ khám',
	'Đang khám',
	CHO_THANH_TOAN_PHI_XN,
	CHO_KQXN,
	'Đã có KQXN',
	KET_THUC,
	CHUYEN_KHOA,
	NHAP_VIEN,
	DA_HUY,
	DA_XOA,
}

export const renderEnumCheckupRecordStatus = (status: number) =>
	CheckupRecordStatus[status]

export enum InsuranceSupportStatus {
	KHONG_HO_TRO,
	HO_TRO_MOT_PHAN,
	HO_TRO_TOAN_PHAN,
}

export const renderEnumInsuranceStatus = (status: number) =>
	InsuranceSupportStatus[status]

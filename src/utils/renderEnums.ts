export enum CheckupRecordStatus {
	CHO_TAI_KHAM,
	DA_DAT_LICH,
	DA_THANH_TOAN,
	DANG_KHAM,
	CHO_KQXN,
	DA_CO_KQXN,
	KET_THUC,
	CHUYEN_KHOA,
	NHAP_VIEN,
	DA_HUY,
	DA_XOA,
}

export const renderEnumCheckupRecordStatus = (status: number) =>
	CheckupRecordStatus[status]

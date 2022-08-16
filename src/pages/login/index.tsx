import {
	Autocomplete,
	Box,
	Button,
	FormControlLabel,
	Radio,
	RadioGroup,
	Stack,
	TextField,
} from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useSetRecoilState } from 'recoil'
import apiHelper, { doctorApiHelper } from '../../utils/apiHelper'
import useAuth, { authAtom } from '../../hooks/useAuth'
import useToast from '../../hooks/useToast'
import ControlledAutocomplete, {
	Option,
} from '../../components/FormElements/ControlledAutocomplete'
import { RoomData } from '../../entities/room'
import PageLayout from '../../components/PageLayout'
import { ErrorDialog } from '../../components/Modal'
import { formatRoomListToOptionList } from '../../utils/formats'

type LoginFormData = {
	password: string
	room: Option & RoomData
}

type DepartmentType = 'general' | 'test'
const Login = () => {
	const [roomOptions, setRoomOptions] = useState<Option[] | undefined>(
		undefined
	)
	const [testRoomOptions, setTestRoomOptions] = useState<Option[] | undefined>(
		undefined
	)
	const [departmentType, setDepartmentType] =
		useState<DepartmentType>('general')

	const { register, handleSubmit, ...methods } = useForm<LoginFormData>({
		mode: 'onChange',
		defaultValues: {
			password: undefined,
			room: undefined,
		},
	})
	const router = useRouter()
	const { login, isAuthenticated } = useAuth()
	const { toastError, open, closeToast, toastData } = useToast()

	useEffect(() => {
		const queryRoomOptions = async () => {
			try {
				const [roomsResp, testRoomsResp] = await Promise.all([
					doctorApiHelper.get('rooms'),
					doctorApiHelper.get('rooms/exam-room'),
				])

				setRoomOptions(formatRoomListToOptionList(roomsResp.data))
				setTestRoomOptions(formatRoomListToOptionList(testRoomsResp.data))
			} catch (error) {
				console.error(error)
			}
		}

		queryRoomOptions()
	}, [])

	useEffect(() => {
		if (isAuthenticated) router.push('/queue')
	}, [isAuthenticated])

	const onSubmit = async ({
		password,
		room: { value: roomId, label, ...room },
	}: LoginFormData) => {
		try {
			const loginData: any = await apiHelper
				.post('login', {
					password,
					roomId: Number(roomId),
				})
				.then((response) => response?.data)
			login(loginData?.token, Number(roomId), room, loginData?.information)
		} catch (error) {
			console.error(error)
			toastError({ message: 'Đăng nhập bị lỗi. Vui lòng thử lại!' })
		}
	}

	return (
		<Stack
			alignContent={'center'}
			justifyContent={'center'}
			height={'100vh'}
			width={'100vw'}
			sx={{ background: '#f9f9f9' }}
		>
			<Stack
				spacing={4}
				direction={'column'}
				alignContent={'center'}
				justifyContent={'center'}
				maxWidth={520}
				mx="auto"
				p={4}
				sx={{
					width: '100%',
					// background: '#fff',
					borderRadius: '12px',
				}}
			>
				<h1>Bệnh viện Nhi Đồng 2</h1>

				<FormProvider
					{...methods}
					handleSubmit={handleSubmit}
					register={register}
				>
					<form onSubmit={handleSubmit(onSubmit)}>
						<Stack
							spacing={4}
							direction={'column'}
							alignContent={'center'}
							justifyContent={'center'}
							sx={{
								boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
								borderRadius: '8px',
							}}
							p={4}
						>
							<TextField
								type="password"
								label={'Mật khẩu'}
								{...register('password', { required: true })}
							/>

							<RadioGroup
								aria-labelledby="department-radio-group"
								name="department-radio-group"
								value={departmentType}
								onChange={(e) =>
									setDepartmentType(e.target.value as DepartmentType)
								}
								row
							>
								<FormControlLabel
									value={'general'}
									control={<Radio />}
									label="Phòng khám"
								/>
								<FormControlLabel
									value={'test'}
									control={<Radio />}
									label="Phòng xét nghiệm"
								/>
							</RadioGroup>

							<ControlledAutocomplete
								name="room"
								label={'Phòng khám'}
								style={{ minWidth: '100%' }}
								rules={{ required: true }}
								options={
									departmentType === 'general'
										? roomOptions ?? []
										: testRoomOptions ?? []
								}
							/>

							<Button
								variant="contained"
								color="primary"
								size="large"
								type="submit"
							>
								Đăng nhập
							</Button>
						</Stack>
					</form>
				</FormProvider>
			</Stack>

			<ErrorDialog
				open={!!open && toastData?.variant === 'error'}
				handleClose={closeToast}
				message={toastData?.message}
			/>
		</Stack>
	)
}

export default Login

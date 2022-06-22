import { Autocomplete, Box, Button, Stack, TextField } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useSetRecoilState } from 'recoil'
import apiHelper from '../../../utils/apiHelper'
import { authAtom } from '../../hooks/useAuth'

const Login = () => {
	const [roomIdOptions, setRoomIdOptions] = useState([
		{
			label: '',
			value: 0,
		},
	])
	const { register, handleSubmit, control } = useForm()
	const router = useRouter()
	const setAuthData = useSetRecoilState(authAtom)

	useEffect(() => {
		const queryRoomOptions = async () => {
			try {
				const response = await apiHelper.get('rooms')
				const _roomIdOptions = response.data.map((room: any) => ({
					label: room.roomNumber,
					value: room.id,
				}))
				setRoomIdOptions(_roomIdOptions)
			} catch (error) {
				console.log(error)
			}
		}

		queryRoomOptions()
	}, [])

	const getOpObj = (option: any) => {
		if (!option?.value) option = roomIdOptions.find((op) => op.value === option)
		return option
	}

	const onSubmit = async ({
		username,
		password,
		room: { value: roomId },
	}: any) => {
		try {
			const loginData: any = await apiHelper
				.post('login', {
					username,
					password,
					roomId,
				})
				.then((response) => response?.data)
			setAuthData({
				token: loginData?.token,
				isAuthenticated: true,
				roomId,
				information: loginData?.information,
			})
			router.push('/')
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<Box height="100vh" sx={{ background: '#f9f9f9' }}>
			<Stack
				spacing={4}
				direction={'column'}
				alignContent={'center'}
				justifyContent={'center'}
				maxWidth={520}
				mx="auto"
				p={4}
				sx={{
					height: '100%',
				}}
			>
				<h1>Chào mừng bạn</h1>

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
							type="text"
							label={'Tài khoản'}
							{...register('username', { required: true })}
						/>
						<TextField
							type="password"
							label={'Mật khẩu'}
							{...register('password', { required: true })}
						/>

						<Controller
							name="room"
							render={({ field: { ref, ...field }, fieldState: { error } }) => {
								return (
									<Autocomplete
										{...field}
										options={roomIdOptions}
										getOptionLabel={(option) => {
											return getOpObj(option) ? getOpObj(option)?.label : ''
										}}
										isOptionEqualToValue={(option, value) => {
											return option.value === getOpObj(value)?.value
										}}
										sx={{ width: '100%' }}
										renderInput={(params) => (
											<TextField
												{...params}
												inputRef={ref}
												label="Phòng khám"
												error={!!error}
												helperText={error?.message}
											/>
										)}
										onChange={(e, value) => field.onChange(value)}
										onInputChange={(_, data) => {
											if (data) field.onChange(data)
										}}
									/>
								)
							}}
							rules={{ required: true }}
							control={control}
							defaultValue={null}
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
			</Stack>
		</Box>
	)
}

export default Login

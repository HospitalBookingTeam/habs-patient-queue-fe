import { Autocomplete, Stack, TextField } from '@mui/material'
import { useState } from 'react'

const Login = () => {
	const [roomIdOptions, setRoomIdOptions] = useState([{ label: '0', value: 0 }])
	return (
		<Stack spacing={2} alignContent={'center'} width={'100%'} height={'100%'}>
			<h1>Login</h1>
			<TextField type="text" label={'Tài khoản'} />
			<TextField type="password" label={'Mật khẩu'} />
			<Autocomplete
				options={roomIdOptions}
				sx={{ width: 300 }}
				renderInput={(params) => <TextField {...params} label="Room Id" />}
			/>
		</Stack>
	)
}

export default Login

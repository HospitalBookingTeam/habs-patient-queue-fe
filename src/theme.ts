import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

const theme = createTheme({
	palette: {
		primary: {
			main: '#87eab1',
		},
		secondary: {
			main: '#6929db',
		},
		error: {
			main: red.A400,
		},
	},
});

export default theme;

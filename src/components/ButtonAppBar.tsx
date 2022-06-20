import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from '../Link';

export default function ButtonAppBar() {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Button variant="contained" component={Link} noLinkStyle href="/">
            Logo
          </Button>
        </Typography>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Bệnh viện Nhi đồng 2
        </Typography>
        <Button color="inherit" variant="contained">Login</Button>
        <Button color="inherit">🗣 Quân Kun</Button>
      </Toolbar>
    </AppBar>
  );
}
import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';

export default function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center" width='100%'>
      {'Copyright '}
      <MuiLink color="inherit" href="https://habs-doctor.netlify.app/">
        Bệnh viện Nhi đồng 2 và Nhóm HABS
      </MuiLink>{' '}
      © {new Date().getFullYear()}.
    </Typography>
  );
}

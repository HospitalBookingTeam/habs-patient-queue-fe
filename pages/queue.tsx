import type { NextPage } from 'next';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '../src/Link';
import PageLayout from '../src/components/PageLayout';
import BasicMeta from '../src/components/meta/BasicMeta';
import OpenGraphMeta from '../src/components/meta/OpenGraphMeta';

const Queue: NextPage = () => {
  const url = "/queue"
  const title = "Hàng chờ"
  return (
    <PageLayout>
      <BasicMeta url={url} title={title} />
      <OpenGraphMeta url={url} title={title} />
      <Typography variant="h4" component="h1" gutterBottom>
        Hàng chờ bệnh nhân
      </Typography>
    </PageLayout>
  );
};

export default Queue;

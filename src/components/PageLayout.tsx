import * as React from 'react';
import type { NextPage } from 'next';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Copyright from '../Copyright';
import ButtonAppBar from './ButtonAppBar';
import Sidebar from './Sidebar';
import { CssBaseline, Toolbar } from '@mui/material';
import Head from 'next/head';

type Props = {
  children: React.ReactNode;
}

const PageLayout: NextPage<Props> = ({ children }: Props) => {
  return (
    <div className="root">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </Head>
      <nav>
        <ButtonAppBar />
      </nav>
      <main>
        <Container
          maxWidth="lg"
          sx={{
            padding: '0 !important',
          }}
        >
          <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 4, minHeight: '100vh' }}>
              <Toolbar />
              {children}
            </Box>
          </Box>
        </Container>
      </main>
      <footer>
        <Copyright />
      </footer>
    </div >
  );
};

export default PageLayout;

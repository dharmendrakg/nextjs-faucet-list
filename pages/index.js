import * as React from 'react';
import {Box, Container} from '@mui/material';
import Tab from '@/components/Tab'
import Table from '@/components/Table'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import Link from '../src/Link';

export default function Index() {
  return (
    <Box style={{height: "100vh"}}>
      <Header />
      <Container maxWidth="lg">
        <Tab />
        <Table />
      </Container>
      <Footer />
    </Box>
  );
}
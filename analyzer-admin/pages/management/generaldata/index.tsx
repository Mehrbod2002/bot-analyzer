import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import { Grid, Container } from '@mui/material';
import Footer from '@/components/Footer';
import GeneralData from '@/content/Management/GeneralData/GeneralData';

function ApplicationsGeneralData() {
  return (
    <>
      <Head>
        <title>General Data</title>
      </Head>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <GeneralData />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

ApplicationsGeneralData.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default ApplicationsGeneralData;

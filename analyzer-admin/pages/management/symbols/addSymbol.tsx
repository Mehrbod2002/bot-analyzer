import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageTitle from '@/components/PageTitle';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Divider,
  Button,
  MenuItem,
} from '@mui/material';
import Footer from 'src/components/Footer';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import api from 'utils/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { AllSymbols } from '@/models/users';

function CreateOrder() {
  const router = useRouter();

  const [symbol, setSymbol] = useState<string | string[]>();
  const [name, setName] = useState<string | string[]>();
  const [shortName, setShortName] = useState<string | string[]>();

  async function handleCreate() {
    const token = Cookies.get('authToken');
    let url = '/api/admin/set_market';
    let data = {
      symbol: symbol,
      short_name: shortName,
      name: name,
    };

    const [statusCreation, _] = await api(url, data, { Authorization: token });
    if (statusCreation) {
      router.push('/management/symbols');
    }
  }

  return (
    <>
      <Head>
        <title>Add Market</title>
      </Head>
      <PageTitleWrapper>
        <PageTitle heading="Add Market" />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box
                  component="form"
                  sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' }
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <div>
                    <div>
                      <TextField
                        required
                        id="symbol"
                        select
                        label="Symbol"
                        value={symbol}
                        onChange={(event) => setSymbol(event.target.value)}
                        fullWidth
                      >
                        {AllSymbols.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        required
                        id="Name"
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                      >
                      </TextField>
                      <TextField
                        required
                        id="short_name"
                        label="Short Name"
                        value={shortName}
                        onChange={(e) => setShortName(e.target.value)}
                        fullWidth
                      >
                      </TextField>
                      <Divider sx={{ my: 3 }} />
                    </div>
                    <Button
                      sx={{ margin: 1 }}
                      variant="contained"
                      onClick={handleCreate}
                    >
                      {router.query._id ? 'Edit' : 'Create'}
                    </Button>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

CreateOrder.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default CreateOrder;

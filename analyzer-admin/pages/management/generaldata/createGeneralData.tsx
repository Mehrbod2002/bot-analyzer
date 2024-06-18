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
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import Footer from 'src/components/Footer';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import api, { apiGet } from 'utils/api';
import { GeneralData } from '@/models/users';

function CreateGeneralData() {
    const router = useRouter();
    const [formData, setFormData] = useState<GeneralData>({
        first_type: {
            number_count: 0,
            has_flag: false,
            min_volumn: 0,
        },
        second_type: {
            number_count: 0,
            has_flag: false,
            min_volumn: 0,
        },
        just_send_signal: false,
        sync_symbols: false,
        first_trade: 0,
        first_trade_mode_is_amount: false,
        stop_limit: 0,
        rounds: 0,
        magic_number: 0,
        from_time: "00:00",
        to_time: "23:00",
        compensate_rounds: 0,
        make_position_when_not_round_closed: false,
        max_trade_volumn: 0,
        max_loss_to_close_all: 0,
        values_candels: 0,
        diff_pip: 0,
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target;

        if (name.includes('.')) {
            const [parentKey, childKey] = name.split('.');
            setFormData({
                ...formData,
                [parentKey]: {
                    ...formData[parentKey],
                    [childKey]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) : value)
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) : value)
            });
        }
    };

    async function handleCreate() {
        const token = Cookies.get('authToken');
        var url = "/bot/admin/set_general";

        const [statusCreation, _] = await api(url, formData, { Authorization: token });
        if (statusCreation) {
            router.push('/');
        }
    }

    useEffect(() => {
        async function fetchGeneralData() {
            if (router.query._id) {
                const token = Cookies.get('authToken');
                const url = `/bot/admin/get_general_data`;
                try {
                    const [valid, response] = await apiGet(url, {
                        Authorization: token
                    });
                    if (valid) {
                        setFormData(response.general_data);
                    } else {
                        console.error('Failed to fetch GeneralData');
                    }
                } catch (error) {
                    console.error('API Error:', error);
                }
            }
        }

        fetchGeneralData();
    }, [router.query._id]);

    return (
        <>
            <Head>
                <title>General Data</title>
            </Head>
            <PageTitleWrapper>
                <PageTitle heading={router.query._id ? 'Edit General Data' : 'Create General Data'} />
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
                                    <TextField
                                        required
                                        id="first-type-number-count"
                                        name="first_type.number_count"
                                        label="First Type Number Count"
                                        type="number"
                                        value={formData.first_type.number_count}
                                        onChange={handleChange}
                                    />
                                    <FormControlLabel
                                        label="Has Flag"
                                        control={
                                            <Checkbox
                                                id="first-type-has-flag"
                                                name="first_type.has_flag"
                                                checked={formData.first_type.has_flag}
                                                onChange={handleChange}
                                            />
                                        } />
                                    <TextField
                                        label="Min Volumn"
                                        id="first-type-min-volumn"
                                        name="first_type.min_volumn"
                                        value={formData.first_type.min_volumn}
                                        onChange={handleChange}
                                    />
                                    <Divider sx={{ my: 3 }} />
                                    <TextField
                                        required
                                        id="second-type-number-count"
                                        name="second_type.number_count"
                                        label="Second Type Number Count"
                                        type="number"
                                        value={formData.second_type.number_count}
                                        onChange={handleChange}
                                    />
                                    <FormControlLabel
                                        label="Has Flag"
                                        control={
                                            <Checkbox
                                                id="second-type-has-flag"
                                                name="second_type.has_flag"
                                                checked={formData.second_type.has_flag}
                                                onChange={handleChange}
                                            />
                                        } />
                                    <TextField
                                        label="Min Volumn"
                                        id="second-type-min-volumn"
                                        name="second_type.min_volumn"
                                        value={formData.second_type.min_volumn}
                                        onChange={handleChange}
                                    />
                                    <Divider sx={{ my: 3 }} />
                                    <TextField
                                        label="Values Candels"
                                        id="values-candels"
                                        name="values_candels"
                                        type="number"
                                        value={formData.values_candels}
                                        onChange={handleChange}
                                    />
                                    <TextField
                                        label="Diff Pips"
                                        id="diff_pip"
                                        name="diff_pip"
                                        type="number"
                                        value={formData.diff_pip}
                                        onChange={handleChange}
                                    />
                                    <FormControlLabel
                                        label="Just Send a signal"
                                        control={
                                            <Checkbox
                                                id="just-send-signal"
                                                name="just_send_signal"
                                                checked={formData.just_send_signal}
                                                onChange={handleChange}
                                            />} />
                                    <FormControlLabel
                                        label="Sync Symbols"
                                        control={
                                            <Checkbox
                                                required
                                                id="sync-symbols"
                                                name="sync_symbols"
                                                checked={formData.sync_symbols}
                                                onChange={handleChange}
                                            />} />
                                    <TextField
                                        required
                                        id="first-trade"
                                        name="first_trade"
                                        label="First Trade"
                                        type="number"
                                        value={formData.first_trade}
                                        onChange={handleChange}
                                    />
                                    <FormControlLabel
                                        label="Trade mode is amount"
                                        control={
                                            <Checkbox
                                                id="first-trade-mode-is-amount"
                                                name="first_trade_mode_is_amount"
                                                checked={formData.first_trade_mode_is_amount}
                                                onChange={handleChange}
                                            />} />
                                    <TextField
                                        required
                                        id="stop-limit"
                                        name="stop_limit"
                                        label="Stop Limit %"
                                        type="number"
                                        value={formData.stop_limit}
                                        onChange={handleChange}
                                    />
                                    <TextField
                                        required
                                        id="rounds"
                                        name="rounds"
                                        label="Rounds"
                                        type="number"
                                        value={formData.rounds}
                                        onChange={handleChange}
                                    />
                                    <TextField
                                        required
                                        id="magic-number"
                                        name="magic_number"
                                        label="Magic Number"
                                        type="number"
                                        value={formData.magic_number}
                                        onChange={handleChange}
                                    />
                                    <TextField
                                        required
                                        id="compensate-rounds"
                                        name="compensate_rounds"
                                        label="Compensate Rounds"
                                        type="number"
                                        value={formData.compensate_rounds}
                                        onChange={handleChange}
                                    />
                                    <FormControlLabel
                                        label="Make position when not closed"
                                        control={
                                            <Checkbox
                                                id="make-position-when-not-round-closed"
                                                name="make_position_when_not_round_closed"
                                                checked={formData.make_position_when_not_round_closed}
                                                onChange={handleChange}
                                            />}></FormControlLabel>
                                    <TextField
                                        required
                                        id="max-trade-volume"
                                        name="max_trade_volume"
                                        label="Max Trade Volume"
                                        type="number"
                                        value={formData.max_trade_volumn}
                                        onChange={handleChange}
                                    />
                                    <TextField
                                        required
                                        id="max-loss-to-close-all"
                                        name="max_loss_to_close_all"
                                        label="Max Loss To Close All"
                                        type="number"
                                        value={formData.max_loss_to_close_all}
                                        onChange={handleChange}
                                    />
                                    <Divider sx={{ my: 3 }} />
                                    <TextField
                                        required
                                        name="from_time"
                                        label="Active Clocl UTC From"
                                        type="text"
                                        value={formData.from_time}
                                        onChange={handleChange}
                                    />
                                    <TextField
                                        required
                                        name="to_tme"
                                        label="Active Clocl UTC To"
                                        type="text"
                                        value={formData.to_time}
                                        onChange={handleChange}
                                    />
                                    <Divider sx={{ my: 3 }} />
                                    <Stack direction="row" spacing={2}>
                                        <Button
                                            sx={{ margin: 1 }}
                                            variant="contained"
                                            onClick={handleCreate}
                                        >
                                            {router.query._id ? 'Edit' : 'Create'}
                                        </Button>
                                    </Stack>
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

CreateGeneralData.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default CreateGeneralData;

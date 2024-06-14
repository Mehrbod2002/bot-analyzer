import {
  Card,
  Box,
  CardContent,
  Typography,
  useTheme,
  styled,
  Menu,
  MenuItem,
  Button
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import api from 'utils/api';
import { ExpandMoreTwoTone } from '@mui/icons-material';

const RootWrapper = styled(Card)(
  ({ theme }) => `
    background: ${theme.colors.gradients.green1};
    color: ${theme.colors.alpha.white[100]};
`
);


const periods = [
  {
    value: 1,
    text: 'Hour'
  },
  {
    value: 24,
    text: 'Day'
  },
  {
    value: 7 * 24,
    text: 'Week'
  },
  {
    value: 30 * 24,
    text: 'Month'
  }
];


function Performance() {
  const theme = useTheme();
  const [aed, setAed] = useState<number>(0);
  const [users, setUsers] = useState<number>(0);
  const [goldBars, setGoldBars] = useState<number>(0);
  const [usd, setUsd] = useState<number>(0);
  const actionRef1 = useRef<any>(null);
  const [openPeriod, setOpenMenuPeriod] = useState<boolean>(false);
  const [period, setPeriod] = useState<string>(periods[3].text);
  const [periodValue, setPeriodValue] = useState<number>(periods[3].value);

  useEffect(() => {
    const handlePeriod = async (period: number) => {
      const token = Cookies.get('authToken');
      var url = '/api/admin/metric';
      const [statusCreation, data] = await api(url, { "time": period }, { Authorization: token });
      if (statusCreation) {
        setUsers(data.users.length as number);
        setAed(data.aed as number);
        setGoldBars(data.gold_bars as number);
        setUsd(data.usd as number);
      }
    };

    handlePeriod(periodValue);
  }, [periodValue]);

  return (
    <RootWrapper
      sx={{
        p: 2
      }}
    >
      <Box
        mb={2}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="h4">Metric Analytics</Typography>
        <Button
          size="small"
          variant="contained"
          color="secondary"
          ref={actionRef1}
          onClick={() => setOpenMenuPeriod(true)}
          endIcon={<ExpandMoreTwoTone fontSize="small" />}
        >
          {period}
        </Button>
        <Menu
          disableScrollLock
          anchorEl={actionRef1.current}
          onClose={() => setOpenMenuPeriod(false)}
          open={openPeriod}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
        >
          {periods.map((_period) => (
            <MenuItem
              key={_period.value}
              onClick={() => {
                setPeriodValue(_period.value);
                setPeriod(_period.text);
                setOpenMenuPeriod(false);
              }}
            >
              {_period.text}
            </MenuItem>
          ))}
        </Menu>
      </Box>
      <Typography
        variant="h3"
        sx={{
          px: 2,
          pb: 1,
          pt: 2,
          fontSize: `${theme.typography.pxToRem(23)}`,
          color: `${theme.colors.alpha.white[100]}`
        }}
      >
        Meta Data
      </Typography>
      <CardContent>
        <Box
          display="flex"
          sx={{
            px: 2,
            pb: 3
          }}
          alignItems="center"
        >
          <Box>
            <Typography sx={{
              fontSize: `${theme.typography.pxToRem(23)}`,
              color: `${theme.colors.alpha.white[100]}`
            }} variant="h3">Users: {users}</Typography>
            <Typography sx={{
              fontSize: `${theme.typography.pxToRem(23)}`,
              color: `${theme.colors.alpha.white[100]}`
            }} variant="h3">Gold bars: {goldBars}</Typography>
            <Typography sx={{
              fontSize: `${theme.typography.pxToRem(23)}`,
              color: `${theme.colors.alpha.white[100]}`
            }} variant="h3">AED: {aed} AED</Typography>
            <Typography sx={{
              fontSize: `${theme.typography.pxToRem(23)}`,
              color: `${theme.colors.alpha.white[100]}`
            }} variant="h3">USDT: {usd} USDT</Typography>
          </Box>
        </Box>
        {/* <Box
          display="flex"
          sx={{
            px: 2,
            pb: 3
          }}
          alignItems="center"
        >
          <AvatarError
            sx={{
              mr: 2
            }}
            variant="rounded"
          >
            <CancelPresentationTwoToneIcon fontSize="large" />
          </AvatarError>
          <Box>
            <Typography variant="h1">5</Typography>
            <TypographySecondary variant="subtitle2" noWrap>
              tasks closed
            </TypographySecondary>
          </Box>
        </Box> */}
        {/* <Box pt={3}>
          <LinearProgressWrapper
            value={73}
            color="primary"
            variant="determinate"
          />
        </Box> */}
      </CardContent>
    </RootWrapper>
  );
}

export default Performance;

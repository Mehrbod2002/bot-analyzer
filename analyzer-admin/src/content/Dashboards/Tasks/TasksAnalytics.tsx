import {
  Box,
  alpha,
  useTheme
} from '@mui/material';
import { Chart } from 'src/components/Chart';
import type { ApexOptions } from 'apexcharts';
// const DotPrimaryLight = styled('span')(
//   ({ theme }) => `
//     border-radius: 22px;
//     background: ${theme.colors.primary.lighter};
//     width: ${theme.spacing(1.5)};
//     height: ${theme.spacing(1.5)};
//     display: inline-block;
//     margin-right: ${theme.spacing(0.5)};
// `
// );

// const DotPrimary = styled('span')(
//   ({ theme }) => `
//     border-radius: 22px;
//     background: ${theme.colors.primary.main};
//     width: ${theme.spacing(1.5)};
//     height: ${theme.spacing(1.5)};
//     display: inline-block;
//     margin-right: ${theme.spacing(0.5)};
// `
// );

function TasksAnalytics() {
  const theme = useTheme();

  const chartOptions: ApexOptions = {
    chart: {
      background: 'transparent',
      type: 'bar',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 6,
        columnWidth: '35%'
      }
    },
    colors: [theme.colors.primary.main, alpha(theme.colors.primary.main, 0.5)],
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: 1
    },
    theme: {
      mode: theme.palette.mode
    },
    stroke: {
      show: true,
      width: 3,
      colors: ['transparent']
    },
    legend: {
      show: false
    },
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ],
    grid: {
      strokeDashArray: 5,
      borderColor: theme.palette.divider
    },
    xaxis: {
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    yaxis: {
      tickAmount: 6,
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    tooltip: {
      x: {
        show: false
      },
      marker: {
        show: false
      },
      y: {
        formatter: function (val) {
          return '$ ' + val + 'k';
        }
      },
      theme: 'dark'
    }
  };

  const chartData = [
    {
      name: 'Visitors',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  ];

  return (
    <Box>
      {/* <Box display="flex" alignItems="center" pb={2}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: 'flex',
            alignItems: 'center',
            mr: 2
          }}
        >
          <DotPrimary />
          tasks created
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <DotPrimaryLight />
          tasks completed
        </Typography>
      </Box> */}
      <Chart
        options={chartOptions}
        series={chartData}
        type="bar"
        height={270}
      />
    </Box>
  );
}

export default TasksAnalytics;

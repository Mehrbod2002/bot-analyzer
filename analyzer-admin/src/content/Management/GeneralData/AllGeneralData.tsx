import { FC, ChangeEvent, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Tooltip,
  Divider,
  Box,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Typography,
  useTheme,
} from '@mui/material';
import { GeneralData } from '@/models/users';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { toQuery } from 'utils/api';
import { useRouter } from 'next/router';

interface UsersTableProps {
  className?: string;
  GeneralData: GeneralData[];
}

const applyFilters = (
  users: GeneralData[],
): GeneralData[] => {
  if (users) {
    return users.filter((_) => {
      let matches = true;

      return matches;
    });
  }
};

const applyPagination = (
  users: GeneralData[],
  page: number,
  limit: number
): GeneralData[] => {
  if (users) {
    return users.slice(page * limit, page * limit + limit);
  }
};

const AllGeneralData: FC<UsersTableProps> = ({ GeneralData }) => {
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredUsers = applyFilters(GeneralData);
  const paginatedUsers = applyPagination(filteredUsers, page, limit);
  const theme = useTheme();
  const router = useRouter();

  return (
    <Card>
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Type Number Count</TableCell>
              <TableCell>First Type Has Flag</TableCell>
              <TableCell>First Type Min Volume</TableCell>
              <TableCell>Second Type Number Count</TableCell>
              <TableCell>Second Type Has Flag</TableCell>
              <TableCell>Second Type Volume</TableCell>
              <TableCell>Just Send Signal</TableCell>
              <TableCell>Sync Symbols</TableCell>
              <TableCell>First Trade</TableCell>
              <TableCell>First Trade Mode Is Amount</TableCell>
              <TableCell>Stop Limit</TableCell>
              <TableCell>Rounds</TableCell>
              <TableCell>Magic Number</TableCell>
              <TableCell>From Clocl UTC</TableCell>
              <TableCell>To Clocl UTC</TableCell>
              <TableCell>Compensate Rounds</TableCell>
              <TableCell>Make Position When Not Round Closed</TableCell>
              <TableCell>Max Trade Volume</TableCell>
              <TableCell>Max Loss To Close All</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => {
              return (
                <TableRow hover key={user._id}>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {user.first_type.number_count}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {user.first_type.has_flag ? "True" : "False"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >both
                      {user.first_type.min_volumn}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {user.second_type.number_count}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {user.second_type.has_flag ? "True" : "False"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {user.second_type.min_volumn}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {user.just_send_signal ? "True" : "False"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {user.sync_symbols ? "True" : "False"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {user.first_trade}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {user.first_trade_mode_is_amount ? "True" : "False"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {user.stop_limit}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {user.rounds}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {user.magic_number}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {user.FromTime}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {user.ToTime}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {user.compensate_rounds}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {user.make_position_when_not_round_closed ? "True" : "False"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {user.max_trade_volumn}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {user.max_loss_to_close_all}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit Rate" arrow>
                      <IconButton
                        onClick={() => {
                          router.push({
                            pathname: '/management/generaldata/createGeneralData',
                            query: toQuery(user)
                          });
                        }}
                        sx={{
                          '&:hover': {
                            background: theme.colors.primary.lighter
                          },
                          color: theme.palette.primary.main
                        }}
                        color="inherit"
                        size="small"
                      >
                        <EditTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={paginatedUsers.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  );
};

AllGeneralData.propTypes = {
  GeneralData: PropTypes.array.isRequired
};

AllGeneralData.defaultProps = {
  GeneralData: []
};

export default AllGeneralData;

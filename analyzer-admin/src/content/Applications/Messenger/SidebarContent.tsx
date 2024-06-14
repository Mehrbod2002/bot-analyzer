import { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  List,
  Divider,
  ListItemButton,
  styled
} from '@mui/material';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
          background-color: ${theme.colors.success.lighter};
          color: ${theme.colors.success.main};
          width: ${theme.spacing(8)};
          height: ${theme.spacing(8)};
          margin-left: auto;
          margin-right: auto;
    `
);

// const MeetingBox = styled(Box)(
//   ({ theme }) => `
//           background-color: ${lighten(theme.colors.alpha.black[10], 0.5)};
//           margin: ${theme.spacing(2)} 0;
//           border-radius: ${theme.general.borderRadius};
//           padding: ${theme.spacing(2)};
//     `
// );

const RootWrapper = styled(Box)(
  ({ theme }) => `
        padding: ${theme.spacing(2.5)};
  `
);

const ListItemWrapper = styled(ListItemButton)(
  ({ theme }) => `
        &.MuiButtonBase-root {
            margin: ${theme.spacing(1)} 0;
        }
  `
);

// const TabsContainerWrapper = styled(Box)(
//   ({ theme }) => `
//         .MuiTabs-indicator {
//             min-height: 4px;
//             height: 4px;
//             box-shadow: none;
//             border: 0;
//         }

//         .MuiTab-root {
//             &.MuiButtonBase-root {
//                 padding: 0;
//                 margin-right: ${theme.spacing(3)};
//                 font-size: ${theme.typography.pxToRem(16)};
//                 color: ${theme.colors.alpha.black[50]};

//                 .MuiTouchRipple-root {
//                     display: none;
//                 }
//             }

//             &.Mui-selected:hover,
//             &.Mui-selected {
//                 color: ${theme.colors.alpha.black[100]};
//             }
//         }
//   `
// );

function SidebarContent() {
  // const user = {
  //   name: {},
  //   avatar: '',
  //   jobtitle: ''
  // };

  // const [state, setState] = useState({
  //   invisible: true
  // });

  // const handleChange = (event) => {
  //   setState({
  //     ...state,
  //     [event.target.name]: event.target.checked
  //   });
  // };

  const [currentTab, _] = useState<string>('all');

  // const tabs = [
  //   { value: 'all', label: 'All' },
  //   { value: 'unread', label: 'Unread' },
  //   { value: 'archived', label: 'Archived' }
  // ];

  // const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
  //   setCurrentTab(value);
  // };

  return (
    <RootWrapper>
      <Box mt={2}>
        {currentTab === 'all' && (
          <List disablePadding component="div">
            <ListItemWrapper>
              {/* <ListItemAvatar>
                <Avatar src="/static/images/avatars/1.jpg" />
              </ListItemAvatar>
              <ListItemText
                sx={{
                  mr: 1
                }}
                primaryTypographyProps={{
                  color: 'textPrimary',
                  variant: 'h5',
                  noWrap: true
                }}
                secondaryTypographyProps={{
                  color: 'textSecondary',
                  noWrap: true
                }}
                primary="Zain Baptista"
                secondary="Hey there, how are you today? Is it ok if I call you?"
              />
              <Label color="primary">
                <b>2</b>
              </Label> */}
            </ListItemWrapper>
          </List>
        )}
        {currentTab === 'unread' && (
          <List disablePadding component="div">
            <ListItemWrapper>
              {/* <ListItemAvatar>
                <Avatar src="/" />
              </ListItemAvatar>
              <ListItemText
                sx={{
                  mr: 1
                }}
                primaryTypographyProps={{
                  color: 'textPrimary',
                  variant: 'h5',
                  noWrap: true
                }}
                secondaryTypographyProps={{
                  color: 'textSecondary',
                  noWrap: true
                }}
                primary="Zain Baptista"
                secondary="Hey there, how are you today? Is it ok if I call you?"
              />
              <Label color="primary">
                <b></b>
              </Label> */}
            </ListItemWrapper>
          </List>
        )}
        {currentTab === 'archived' && (
          <Box pb={3}>
            <Divider
              sx={{
                mb: 3
              }}
            />
            <AvatarSuccess>
              <CheckTwoToneIcon />
            </AvatarSuccess>
            <Typography
              sx={{
                mt: 2,
                textAlign: 'center'
              }}
              variant="subtitle2"
            >
              Hurray! There are no archived chats!
            </Typography>
            <Divider
              sx={{
                mt: 3
              }}
            />
          </Box>
        )}
      </Box>
    </RootWrapper>
  );
}

export default SidebarContent;

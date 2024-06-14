import React, { FC, ReactNode, useEffect, useState } from 'react';
import { Box, alpha, lighten, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

import Sidebar from './Sidebar';
import Header from './Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import Cookies from 'js-cookie';

interface SidebarLayoutProps {
  children?: ReactNode;
}

const SidebarLayout: FC<SidebarLayoutProps> = ({ children }) => {
  const theme = useTheme();

  const [socket, _] = useState<WebSocket | null>(null);

  useEffect(() => {
    // const token = Cookies.get('authToken');
    // const customHeaders = {
    //   'Authorization': token,
    // };
    // const socketUrl = 'wss://goldshop24.co/feed';

    const connectWebSocket = () => {
      // const urlWithHeaders = new URL(socketUrl);
      // Object.entries(customHeaders).forEach(([key, value]) => {
      //   urlWithHeaders.searchParams.append(key, value);
      // });

      // const newSocket = new WebSocket(urlWithHeaders);

      // newSocket.addEventListener('open', (event) => {
      //   console.log('WebSocket connection opened:', event);
      // });

      // newSocket.addEventListener('message', (event) => {
      //   console.log('WebSocket message received:', event.data);
      // });

      // newSocket.addEventListener('close', (event) => {
      //   console.log('WebSocket connection closed:', event);

      //   setTimeout(() => {
      //     connectWebSocket();
      //   }, 3000);
      // });

      // newSocket.addEventListener('error', (event) => {
      //   console.error('WebSocket error:', event);
      //   setTimeout(() => {
      //     connectWebSocket();
      //   }, 1000);
      // });

      // setSocket(newSocket);
    };

    connectWebSocket();
    // return () => {
    //   if (socket) {
    //     socket.close();
    //   }
    // };
  }, []);

  return (
    <>
      <Box
        sx={{
          flex: 1,
          height: '100%',

          '.MuiPageTitle-wrapper': {
            background:
              theme.palette.mode === 'dark'
                ? theme.colors.alpha.trueWhite[5]
                : theme.colors.alpha.white[50],
            marginBottom: `${theme.spacing(4)}`,
            boxShadow:
              theme.palette.mode === 'dark'
                ? `0 1px 0 ${alpha(
                  lighten(theme.colors.primary.main, 0.7),
                  0.15
                )}, 0px 2px 4px -3px rgba(0, 0, 0, 0.2), 0px 5px 12px -4px rgba(0, 0, 0, .1)`
                : `0px 2px 4px -3px ${alpha(
                  theme.colors.alpha.black[100],
                  0.1
                )}, 0px 5px 12px -4px ${alpha(
                  theme.colors.alpha.black[100],
                  0.05
                )}`
          }
        }}
      >
        <ToastContainer />
        <Header />
        <Sidebar />
        <Box
          sx={{
            position: 'relative',
            zIndex: 5,
            display: 'block',
            flex: 1,
            pt: `${theme.header.height}`,
            [theme.breakpoints.up('lg')]: {
              ml: `${theme.sidebar.width}`
            }
          }}
        >
          <Box display="block">
            {React.Children.map(children, (child) =>
              React.cloneElement(child as React.ReactElement, { socket })
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

SidebarLayout.propTypes = {
  children: PropTypes.node
};

export default SidebarLayout;

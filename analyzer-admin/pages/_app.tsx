import { ReactElement, ReactNode, useEffect } from 'react';

import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import nProgress from 'nprogress';
import 'nprogress/nprogress.css';
import ThemeProvider from 'src/theme/ThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from 'src/createEmotionCache';
import { SidebarProvider } from 'src/contexts/SidebarContext';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { firebaseConfig } from 'utils/typo';
import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage } from 'firebase/messaging';
import { StoreNotification } from 'utils/api';
import { toast } from 'react-toastify';

const clientSideEmotionCache = createEmotionCache();

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface CaratApps extends AppProps {
  emotionCache?: EmotionCache;
  Component: NextPageWithLayout;
}

var app = initializeApp(firebaseConfig);
function CaratApp(props: CaratApps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page) => page);

  Router.events.on('routeChangeStart', nProgress.start);
  Router.events.on('routeChangeError', nProgress.done);
  Router.events.on('routeChangeComplete', nProgress.done);

  useEffect(() => {
    const messaging = getMessaging(app);
    onMessage(messaging, (payload) => {
      toast.success(payload.notification.body);
      StoreNotification(payload.notification.body);
    });
  }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./firebase-messaging-sw.js')
        .then(function (_registration) {
        }).catch(function (_err) {
        });
    }
  }, []);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Bot Admin Dashboard</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Head>
      <SidebarProvider>
        <ThemeProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <CssBaseline />
            <AuthProvider>
              {getLayout(<Component {...pageProps} />)}
            </AuthProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </SidebarProvider>
    </CacheProvider>
  );
}

export default CaratApp;

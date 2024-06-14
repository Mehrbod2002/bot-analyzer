import { useAuth } from '@/contexts/AuthContext';
import SidebarLayout from '@/layouts/SidebarLayout';
import BaseLayout from 'src/layouts/BaseLayout';
import Login from '@/components/Login';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { CircularProgress, Typography } from '@mui/material';
import GeneralData from '@/content/Management/GeneralData/GeneralData';

function Overview() {
  const { token , loading } = useAuth();
  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <CircularProgress />
        <Typography
          variant="body1"
          color="textSecondary"
          style={{ marginTop: '10px' }}
        >
          Loading...
        </Typography>
      </div>
    );
  }
  return (
    <>
      <ToastContainer />
      {token ? (
        <SidebarLayout>
          <GeneralData />
        </SidebarLayout>
      ) : (
        <BaseLayout>
          <Login />
        </BaseLayout>
      )}
    </>
  );
}

export default Overview;

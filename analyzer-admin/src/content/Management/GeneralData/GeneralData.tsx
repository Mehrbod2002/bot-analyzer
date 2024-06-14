import { Card } from '@mui/material';
import { GeneralData } from '@/models/users';
import { apiGet } from 'utils/api';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import AllGeneralData from './AllGeneralData';

function GeneralDataPage() {
  const token = Cookies.get('authToken');
  const [GeneralData, setGeneralData] = useState<GeneralData[]>();
  useEffect(() => {
    apiGet('/bot/admin/get_general_data', {
      Authorization: token
    })
      .then(([_, getusers]) => {
        setGeneralData([getusers.general_data] || []);
      })
      .catch((_e) => {});
  }, []);

  return (
    <Card>
      <AllGeneralData GeneralData={GeneralData} />
    </Card>
  );
}

export default GeneralDataPage;

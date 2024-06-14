import { useState } from 'react';
import {
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography
} from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import api from 'utils/api';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const Login: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setToken } = useAuth();

  const handleLogin = async () => {
    const [status, data] = await api('/bot/auth/admin/login', {
      email: username,
      password: password
    });
    if (status) {
      Cookies.set('authToken', data.token);
      setToken(data.token);
      router.push("/");
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ marginTop: '15%' }}>
      <CssBaseline />
      <div>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleLogin}
          >
            Login
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default Login;

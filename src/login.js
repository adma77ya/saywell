import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signIn } from './firebase/auth';
import GoogleSignInButton from './googlesigninbutton';
import { Container, Paper, Typography, TextField, Button, Alert, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();
  const theme = useTheme();

  const showMessage = (text, type = 'error') => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signIn(email, password);
      showMessage('Login successful!', 'success');
      setTimeout(() => {
        navigate('/app');
      }, 1500);
    } catch (error) {
      showMessage(error.message);
    }
  };

  const handleGoogleSuccess = () => {
    showMessage('Login successful!', 'success');
    setTimeout(() => {
      navigate('/app');
    }, 1500);
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', bgcolor: theme.palette.background.paper }}>
        <Typography variant="h4" sx={{ mb: 2, fontFamily: theme.typography.fontFamily }}>Login</Typography>
        {message.text && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}
        <GoogleSignInButton onSuccess={handleGoogleSuccess} />
        <Divider sx={{ my: 2 }}>or login with email</Divider>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <Button fullWidth variant="contained" color="primary" type="submit" sx={{ mb: 2 }}>
            Login
          </Button>
        </form>
        <Typography variant="body2">
          Don't have an account? <Link to="/" style={{ color: theme.palette.primary.main }}>Sign up</Link>
        </Typography>
      </Paper>
    </Container>
  );
}

export default Login;
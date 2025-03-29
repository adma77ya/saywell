import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from './firebase/auth';
import GoogleSignInButton from './googlesigninbutton';
import { Container, TextField, Button, Typography, Paper, Divider } from '@mui/material';
import AllContext from './AllContext';


function Signup() {
  const { firstName, setFirstName, lastName, setLastName, email, setEmail, setUserId } = useContext(AllContext);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const showMessage = (text, type = 'error') => {
    setMessage({ text, type });

    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showMessage("Passwords don't match!");
      return;
    }

    if (password.length < 6) {
      showMessage("Password must be at least 6 characters long");
      return;
    }

    try {
      await signUp(setUserId, email, password, firstName, lastName);
      showMessage('Account Created Successfully', 'success');
      setTimeout(() => {
        navigate('/questionnaire');
      }, 1500);
    } catch (error) {
      showMessage(error.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Sign Up</Typography>
        {message.text && (
          <Typography color={message.type === 'success' ? 'green' : 'red'}>{message.text}</Typography>
        )}
        <GoogleSignInButton onSuccess={() => navigate('/')} />
        <Divider sx={{ my: 2 }}>or sign up with email</Divider>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="First Name" margin="normal" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          <TextField fullWidth label="Last Name" margin="normal" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          <TextField fullWidth label="Email" margin="normal" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <TextField fullWidth label="Password" margin="normal" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          <TextField fullWidth label="Confirm Password" margin="normal" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Sign Up</Button>
        </form>
        <Typography sx={{ mt: 2 }}>
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </Paper>
    </Container>
  );
}

export default Signup;

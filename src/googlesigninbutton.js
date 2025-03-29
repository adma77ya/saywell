import React from 'react';
import { Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle } from './firebase/auth';

function GoogleSignInButton({ onSuccess }) {
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
            if (onSuccess) {
                onSuccess();
            } else {
                navigate('/questionnaire');
            }
        } catch (error) {
            console.error('Google sign in error:', error);
        }
    };

    return (
        <Button 
            variant="contained"
            fullWidth
            onClick={handleGoogleSignIn}
            sx={{
                backgroundColor: '#ffffff',
                color: '#000000',
                textTransform: 'none',
                fontSize: '1rem',
                fontFamily: 'Lexend',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                padding: '10px 20px',
                borderRadius: 2,
                boxShadow: 2,
                '&:hover': { backgroundColor: '#f1f1f1' }
            }}
        >
            <Box
                component="img"
                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                alt="Google logo"
                sx={{ width: 24, height: 24 }}
            />
            Continue with Google
        </Button>
    );
}

export default GoogleSignInButton;

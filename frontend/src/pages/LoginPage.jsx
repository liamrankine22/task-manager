import { useState } from 'react';
import axios from "axios";
import { Box, TextField, Button, Typography, IconButton, InputAdornment } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useUser } from '../UserContext';
import { BASE_URL } from '../api/apigen';
import { useToast } from '../ToastContext';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2.5,
    backgroundColor: '#fff',
    '& fieldset': { borderColor: 'rgba(15,15,35,0.12)' },
    '&:hover fieldset': { borderColor: 'rgba(99,102,241,0.4)' },
    '&.Mui-focused fieldset': { borderColor: '#6366f1', borderWidth: '1.5px' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#6366f1' },
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { refetchUser } = useUser();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    try {
      await axios.post(`${BASE_URL}/login`, formData, {withCredentials: true});
      await refetchUser();
      navigate('/app');
    } catch (error) {
      console.error("Login failed: ", error);
      showToast("Failed to log in", "error");
    }
  };

  return (
    <>
      <Typography
        sx={{
          fontFamily: "'Sora', sans-serif",
          fontWeight: 800,
          fontSize: '1.65rem',
          letterSpacing: '-0.02em',
          color: '#18181b',
          mb: 0.75,
        }}
      >
        Welcome back.
      </Typography>
      <Typography sx={{ color: '#71717a', fontSize: '0.92rem', mb: 3.5, lineHeight: 1.6 }}>
        Log in to see what's due and who's on it.
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}>
        <TextField
          label="Username"
          type="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          required
          sx={fieldSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Mail size={17} color="#a1a1aa" />
              </InputAdornment>
            ),
          }}
        />

        <Box>
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            sx={fieldSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock size={17} color="#a1a1aa" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowPassword((v) => !v)} edge="end">
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ textAlign: 'right', mt: 0.75 }}>
            <Box
              component={Link}
              to="/auth/forgot-password"
              sx={{ fontSize: '0.82rem', color: '#71717a', textDecoration: 'none', '&:hover': { color: '#6366f1' } }}
            >
              Forgot password?
            </Box>
          </Box>
        </Box>

        <Button
          type="submit"
          variant="contained"
          size="large"
          endIcon={<ArrowRight size={18} />}
          sx={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            py: 1.25,
            borderRadius: 2.5,
            boxShadow: '0 6px 18px rgba(99,102,241,0.35)',
            mt: 0.5,
            '&:hover': {
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              boxShadow: '0 8px 22px rgba(99,102,241,0.45)',
            },
          }}
        >
          Log in
        </Button>
      </Box>

      <Typography sx={{ color: '#71717a', fontSize: '0.9rem', textAlign: 'center', mt: 3 }}>
        New here?{' '}
        <Box
          component={Link}
          to="/register"
          sx={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}
        >
          Create an account
        </Box>
      </Typography>
    </>
  );
}
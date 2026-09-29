import { useState } from 'react';
import { Box, TextField, Button, Typography, IconButton, InputAdornment } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { registerUser } from '../api/apiusers';
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

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting registration...");
    console.log({
      username,
      email,
      password
    });

    try {
      const res = await registerUser({
        username,
        email,
        password
      });

      console.log("User registered successfully:", res.data);

      showToast("Account created");
      navigate('/login');
    } catch (error) {
      console.error("Registration failed:", error);
      console.error("Status:", error.response?.status);
      console.error("Response:", error.response?.data);
      showToast("Failed to create account", "error");
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
        Create your account.
      </Typography>
      <Typography sx={{ color: '#71717a', fontSize: '0.92rem', mb: 3.5, lineHeight: 1.6 }}>
        Set up your workspace in under a minute.
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}>
        <TextField
          label="Full name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          required
          sx={fieldSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <User size={17} color="#a1a1aa" />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          helperText="At least 8 characters"
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
          Create account
        </Button>
      </Box>

      <Typography sx={{ color: '#71717a', fontSize: '0.9rem', textAlign: 'center', mt: 3 }}>
        Already have an account?{' '}
        <Box
          component={Link}
          to="/login"
          sx={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}
        >
          Log in
        </Box>
      </Typography>
    </>
  );
}
import { Outlet, Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { ListTodo, ArrowLeft } from 'lucide-react';

export default function AuthLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        background: `
          radial-gradient(1200px 600px at 15% 0%, rgba(99,102,241,0.10), transparent 60%),
          radial-gradient(900px 500px at 100% 20%, rgba(139,92,246,0.10), transparent 55%),
          radial-gradient(1000px 600px at 50% 100%, rgba(16,185,129,0.08), transparent 55%),
          #fdfdff
        `,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
        py: 6,
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      {/* Back to hero */}
      <Button
        component={Link}
        to="/"
        startIcon={<ArrowLeft size={16} />}
        sx={{
          position: 'absolute',
          top: { xs: 20, sm: 28 },
          left: { xs: 20, sm: 28 },
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.85rem',
          color: '#52525b',
          borderRadius: 2,
          '&:hover': {
            backgroundColor: 'rgba(15,15,35,0.04)',
            color: '#18181b',
          },
        }}
      >
        Back
      </Button>

      {/* Logo */}
      <Box
        component={Link}
        to="/app"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1.25,
          mb: 4,
          textDecoration: 'none',
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 4px 10px rgba(99,102,241,0.3)',
          }}
        >
          <ListTodo size={19} />
        </Box>
        <Typography
          sx={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 700,
            fontSize: '1.05rem',
            letterSpacing: '-0.01em',
            color: '#18181b',
          }}
        >
          Task Manager
        </Typography>
      </Box>

      {/* Card shell — page content (title, form, footer) comes from the child route */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          borderRadius: 4,
          backgroundColor: 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(14px)',
          border: '1px solid rgba(15,15,35,0.06)',
          boxShadow: '0 20px 60px rgba(30,20,80,0.12)',
          p: { xs: 3.5, sm: 4.5 },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
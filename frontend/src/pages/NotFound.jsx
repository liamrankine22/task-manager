import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router';
import { Home } from 'lucide-react';
import { pageBackground, pageTitleSx, pageSubtitleSx, gradientButtonSx, glassPanelSx, soraFont } from '../styles/heroTheme';

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        ...pageBackground,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
        py: 8,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ ...glassPanelSx, textAlign: 'center', p: { xs: 4, md: 6 } }}>
          <Typography
            sx={{
              fontFamily: soraFont,
              fontWeight: 800,
              fontSize: { xs: '5rem', md: '6rem' },
              letterSpacing: '-0.04em',
              lineHeight: 1,
              mb: 2,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            404
          </Typography>
          <Typography component="h1" sx={{ ...pageTitleSx, fontSize: { xs: '1.75rem', md: '2rem' }, mb: 1.5 }}>
            Page Not Found
          </Typography>
          <Typography sx={{ ...pageSubtitleSx, mb: 4 }}>
            The page you're looking for doesn't exist or has been moved.
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="contained"
            size="large"
            startIcon={<Home size={20} />}
            sx={{ ...gradientButtonSx, px: 4, py: 1.35 }}
          >
            Back to Home
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

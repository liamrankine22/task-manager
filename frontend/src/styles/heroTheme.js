export const soraFont = "'Sora', sans-serif";

export const pageBackground = {
  background: `
    radial-gradient(1200px 600px at 15% 0%, rgba(99,102,241,0.10), transparent 60%),
    radial-gradient(900px 500px at 100% 20%, rgba(139,92,246,0.10), transparent 55%),
    radial-gradient(1000px 600px at 50% 100%, rgba(16,185,129,0.08), transparent 55%),
    #fdfdff
  `,
};

export const pageTitleSx = {
  fontFamily: soraFont,
  fontWeight: 800,
  fontSize: { xs: '2rem', md: '2.5rem' },
  letterSpacing: '-0.03em',
  lineHeight: 1.1,
  color: '#18181b',
};

export const pageSubtitleSx = {
  color: '#52525b',
  fontSize: '1.05rem',
  lineHeight: 1.7,
};

export const sectionTitleSx = {
  fontFamily: soraFont,
  fontWeight: 700,
  fontSize: '1.25rem',
  color: '#18181b',
};

export const cardSx = {
  borderRadius: 3,
  backgroundColor: '#fff',
  border: '1px solid rgba(15,15,35,0.06)',
  boxShadow: '0 1px 2px rgba(15,15,35,0.04)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(99,102,241,0.14)',
  },
};

export const glassPanelSx = {
  borderRadius: 4,
  backgroundColor: 'rgba(255,255,255,0.85)',
  backdropFilter: 'blur(14px)',
  border: '1px solid rgba(15,15,35,0.06)',
  boxShadow: '0 20px 60px rgba(30,20,80,0.12)',
};

export const gradientButtonSx = {
  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  textTransform: 'none',
  fontWeight: 600,
  borderRadius: 2.5,
  boxShadow: '0 6px 18px rgba(99,102,241,0.35)',
  '&:hover': {
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    boxShadow: '0 8px 22px rgba(99,102,241,0.45)',
  },
};

export const outlineButtonSx = {
  textTransform: 'none',
  fontWeight: 600,
  color: '#6366f1',
  borderRadius: 2.5,
  '&:hover': {
    backgroundColor: 'rgba(99,102,241,0.08)',
  },
};

export const groupChipSx = (color) => ({
  height: 20,
  fontSize: '0.7rem',
  fontWeight: 600,
  backgroundColor: `${color}18`,
  color,
});

export const progressBarSx = {
  height: 5,
  borderRadius: 1,
  backgroundColor: 'rgba(99,102,241,0.1)',
  '& .MuiLinearProgress-bar': {
    borderRadius: 1,
    background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
  },
};

export const nestedCardSx = {
  '& .MuiCard-root': {
    ...cardSx,
    height: '100%',
  },
};

export const searchFieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2.5,
    backgroundColor: '#fff',
    '& fieldset': {
      borderColor: 'rgba(15,15,35,0.08)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(99,102,241,0.3)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6366f1',
    },
  },
};

export const statValueSx = {
  fontFamily: soraFont,
  fontWeight: 800,
  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

import { useState } from 'react';
import { Box, Typography, Avatar, TextField, Button, Switch, Divider, MenuItem, Select, } from '@mui/material';
import { User, Bell, Palette, Lock, Trash2, Camera, Check, } from 'lucide-react';
import { useUser } from '../UserContext';
import { updateUserInfo } from '../api/apiusers';

const soraFont = "'Sora', sans-serif";

function SectionCard({ icon, title, description, children }) {
  return (
    <Box
      sx={{
        borderRadius: 3,
        backgroundColor: '#fff',
        border: '1px solid rgba(15,15,35,0.06)',
        boxShadow: '0 1px 2px rgba(15,15,35,0.04)',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, px: 3, pt: 2.75, pb: 2 }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            flexShrink: 0,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.12))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6366f1',
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography sx={{ fontFamily: soraFont, fontWeight: 700, fontSize: '0.95rem', color: '#18181b' }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: '#71717a', mt: 0.25 }}>
            {description}
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ borderColor: 'rgba(15,15,35,0.06)' }} />
      <Box sx={{ px: 3, py: 2.5 }}>{children}</Box>
    </Box>
  );
}

function Row({ label, hint, children }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 3,
        py: 1.5,
      }}
    >
      <Box>
        <Typography variant="body2" fontWeight={600} sx={{ color: '#27272a' }}>
          {label}
        </Typography>
        {hint && (
          <Typography variant="caption" sx={{ color: '#a1a1aa' }}>
            {hint}
          </Typography>
        )}
      </Box>
      {children}
    </Box>
  );
}

const textFieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    backgroundColor: '#fafafa',
    '& fieldset': { borderColor: 'rgba(15,15,35,0.08)' },
    '&:hover fieldset': { borderColor: 'rgba(99,102,241,0.4)' },
    '&.Mui-focused fieldset': { borderColor: '#6366f1' },
  },
};

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weeklyDigest: true,
  });
  const [theme, setTheme] = useState('light');
  const [saved, setSaved] = useState(false);
  const { user, loading, refreshUser } = useUser();
  const [draft, setDraft] = useState(
    {
      id: null,
      username: '',
      email: '',
    }
  );

  const handleSave = async () => {
    try {
        await updateUserInfo(user.id, {
            username: draft.username,
            email: draft.email,
        });

        await refreshUser();

        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    } catch (error) {
        console.error("Failed to update user:", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          radial-gradient(1200px 600px at 15% 0%, rgba(99,102,241,0.08), transparent 60%),
          radial-gradient(900px 500px at 100% 10%, rgba(139,92,246,0.08), transparent 55%),
          #fdfdff
        `,
        px: 3,
        py: { xs: 5, md: 7 },
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      <Box sx={{ maxWidth: 720, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontFamily: soraFont,
              fontWeight: 800,
              fontSize: { xs: '1.75rem', md: '2rem' },
              letterSpacing: '-0.02em',
              color: '#18181b',
              mb: 0.5,
            }}
          >
            Settings
          </Typography>
          <Typography sx={{ color: '#71717a' }}>
            Manage your profile, notifications, and account preferences.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Profile */}
          <SectionCard
            icon={<User size={17} />}
            title="Profile"
            description="Your personal information and how it appears to your team."
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar sx={{ width: 64, height: 64, fontSize: '1.4rem', fontWeight: 600, backgroundColor: '#6366f1' }}>
                  {user?.username?.charAt(0) || 'G'}
                </Avatar>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -2,
                    right: -2,
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                    border: '1px solid rgba(15,15,35,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#52525b',
                    '&:hover': { color: '#6366f1' },
                  }}
                >
                  <Camera size={12} />
                </Box>
              </Box>
              <Box>
                <Typography variant="body2" fontWeight={600}>Profile photo</Typography>
                <Typography variant="caption" sx={{ color: '#a1a1aa' }}>
                  PNG or JPG, at least 200x200px.
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField 
                label="Full name" 
                onChange={(e) => setDraft({ ...draft, username: e.target.value })}
                defaultValue={user?.username || 'temp'} 
                fullWidth size="small" 
                sx={textFieldSx} />
              <TextField 
                label="Email" 
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                defaultValue={user?.email || 'temp@example.com'} 
                fullWidth size="small" 
                sx={textFieldSx} />
            </Box>
          </SectionCard>

          {/* Notifications */}
          <SectionCard
            icon={<Bell size={17} />}
            title="Notifications"
            description="Choose how you want to be notified about task activity."
          >
            <Row label="Email notifications" hint="Get updates about tasks assigned to you">
              <Switch
                checked={notifications.email}
                onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
              />
            </Row>
          </SectionCard>

          {/* Security */}
          <SectionCard
            icon={<Lock size={17} />}
            title="Security"
            description="Manage your password and account access."
          >
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField label="New password" type="password" fullWidth size="small" sx={textFieldSx} />
              <TextField label="Confirm password" type="password" fullWidth size="small" sx={textFieldSx} />
            </Box>
          </SectionCard>

          {/* Danger zone */}
          <SectionCard
            icon={<Trash2 size={17} color="#dc2626" />}
            title="Danger zone"
            description="Irreversible actions related to your account."
          >
            <Row label="Delete account" hint="Permanently remove your account and all associated data">
              <Button
                variant="outlined"
                color="error"
                size="small"
                sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
              >
                Delete account
              </Button>
            </Row>
          </SectionCard>

          {/* Save bar */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1.5, mt: 1 }}>
            {saved && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#10b981' }}>
                <Check size={16} />
                <Typography variant="caption" fontWeight={600}>Saved</Typography>
              </Box>
            )}
            <Button
              onClick={handleSave}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                textTransform: 'none',
                fontWeight: 600,
                px: 3.5,
                py: 1,
                borderRadius: 2.5,
                boxShadow: '0 6px 18px rgba(99,102,241,0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  boxShadow: '0 8px 22px rgba(99,102,241,0.4)',
                },
              }}
            >
              Save changes
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
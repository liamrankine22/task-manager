import { Box, Button, Typography, Chip, Avatar, LinearProgress } from '@mui/material';
import { Link } from 'react-router';
import { ListTodo, CalendarDays, ArrowRight, Circle } from 'lucide-react';
import TaskCard from '../components/TaskCard';
import TaskCardPreview from '../components/TaskCardPreview';

const Tasks = [
  {
      id: 1,
      title: "Design Homepage Mockup",
      description: "Create wireframes and high-fidelity mockups for the new homepage redesign",
      status: "in-progress",
      dueDate: "2026-05-07",
      createdDate: "2026-03-07",
      createdById: 1,
      groupSummary: {
          id: 1,
          name: "Design Team",
      },
      assignmentSummary: {
          id: 1,
          assignedUserId: 1,
          assignedUsername: "Gold Ship",
          taskId: 1,
          assignedAt: "2026-03-07"
      }
  },

  {
      id: 2,
      title: "Build Authentication System",
      description: "Implement login, registration, and JWT-based authentication for the app",
      status: "todo",
      dueDate: "2026-05-10",
      createdDate: "2026-03-08",
      createdById: 2,
      groupSummary: {
          id: 2,
          name: "Backend Team",
      },
      assignmentSummary: {
          id: 2,
          assignedUserId: 2,
          assignedUsername: "Silver Wolf",
          taskId: 2,
          assignedAt: "2026-03-08"
      }
  },

  {
      id: 3,
      title: "Setup Database Schema",
      description: "Design and implement PostgreSQL schema for users, tasks, and groups",
      status: "completed",
      dueDate: "2026-04-30",
      createdDate: "2026-03-01",
      createdById: 3,
      groupSummary: {
          id: 3,
          name: "Database Team",
      },
      assignmentSummary: {
          id: 3,
          assignedUserId: 3,
          assignedUsername: "Mejiro McQueen",
          taskId: 3,
          assignedAt: "2026-03-01"
      }
  }
];

const avatarPalette = ['#6366f1', '#8b5cf6', '#10b981'];

export default function LandingPage() {

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
        py: { xs: 6, md: 10 },
        gap: { xs: 6, md: 8 },
        overflow: 'hidden',
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      {/* Header */}
      <Box sx={{ textAlign: 'center', maxWidth: 560 }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.25, mb: 3.5 }}>
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
            sx={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.01em' }}
          >
            Task Manager
          </Typography>
        </Box>

        <Typography
          sx={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 800,
            fontSize: { xs: '2.5rem', md: '3.25rem' },
            letterSpacing: '-0.03em',
            lineHeight: 1.08,
            mb: 2.5,
            color: '#18181b',
          }}
        >
          Your tasks,{' '}
          <Box
            component="span"
            sx={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            organized.
          </Box>
        </Typography>

        <Typography sx={{ color: '#52525b', fontSize: '1.05rem', lineHeight: 1.7, mb: 4.5 }}>
          See what's due, who owns it, and how far along it is — without switching between five different tools.
        </Typography>

        <Button
          component={Link}
          to="/register"
          variant="contained"
          size="large"
          endIcon={<ArrowRight size={18} className="cta-arrow" />}
          sx={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            px: 4,
            py: 1.35,
            borderRadius: 2.5,
            boxShadow: '0 6px 18px rgba(99,102,241,0.35)',
            '& .cta-arrow': { transition: 'transform 0.2s ease' },
            '&:hover': {
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              boxShadow: '0 8px 22px rgba(99,102,241,0.45)',
              '& .cta-arrow': { transform: 'translateX(3px)' },
            },
          }}
        >
          Sign Up
        </Button>
      </Box>

      {/* Product frame */}
      <Box sx={{ position: 'relative', width: '100%', maxWidth: 980 }}>
        <Box
          sx={{
            borderRadius: 4,
            backgroundColor: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(15,15,35,0.06)',
            boxShadow: '0 20px 60px rgba(30,20,80,0.12)',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2.5,
              py: 1.5,
              borderBottom: '1px solid rgba(15,15,35,0.06)',
            }}
          >
            <Box sx={{ display: 'flex', gap: 0.75 }}>
              {['#f59e0b', '#10b981', '#6366f1'].map((c) => (
                <Box key={c} sx={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: c, opacity: 0.6 }} />
              ))}
            </Box>
            <Typography
              variant="caption"
              sx={{ ml: 1, color: '#71717a', fontWeight: 500, fontFamily: "'Sora', sans-serif" }}
            >
              Dashboard
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              overflowX: 'auto',
              p: 2.5,
              '&::-webkit-scrollbar': { height: 4 },
              '&::-webkit-scrollbar-thumb': { borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.12)' },
            }}
          >
            {Tasks.map((task, i) => (
              <TaskCardPreview key={task.id} task={task} index={i} />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
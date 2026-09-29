import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Typography, Box, Button, Chip } from "@mui/material";
import { ArrowRight, Clock } from 'lucide-react';
import TaskCard from "../components/TaskCard";
import { pageTitleSx, pageSubtitleSx, sectionTitleSx, glassPanelSx, outlineButtonSx, statValueSx, } from '../styles/heroTheme';
import { useUser } from "../UserContext";
import { getTasksForUser } from "../api/apitasks";

export default function HomePage() {
    const [tasks, setTasks] = useState([]);
    const [inProgressTasks, setInProgressTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [assignedUncompletedTasks, setAssignedUncompletedTasks] = useState([]);
    const {user, loading} = useUser();
    const dueSoonTasks = tasks.slice(0, 3);

    useEffect(() => {
        if (!user || loading) return;

        const fetchTasks = async () => {
            try {
                const res = await getTasksForUser(user.id);
                const userTasks = Array.isArray(res.data) ? res.data : [];
                setTasks(userTasks);

                const inProgress = res.data.filter(task => task.status === 'in-progress');
                setInProgressTasks(inProgress);
                const completed = res.data.filter(task => task.status === 'completed');
                setCompletedTasks(completed);
                const assignedUncompleted = res.data.filter(task => task.status !== 'completed' && task.assignedTo === user.id);
                setAssignedUncompletedTasks(assignedUncompleted);
            } catch (error) {
                console.error("Error fetching tasks: ", error);
            };
        }; 

        fetchTasks();
    }, [user, loading]);

    return (
        <Box sx={{ py: { xs: 4, md: 6 } }}>
             <Container maxWidth="xl">
                <Box sx={{ mb: 6, textAlign: 'center', maxWidth: 640, mx: 'auto' }}>
                    <Typography component="h1" sx={{ ...pageTitleSx, mb: 2 }}>
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
                    <Typography sx={{ ...pageSubtitleSx, mb: 0 }}>
                        Stay organized and track your team's progress
                    </Typography>
                </Box>

                <Box sx={{ mb: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                        <Clock size={22} color="#6366f1" />
                        <Typography sx={sectionTitleSx}>
                            Due Soon
                        </Typography>
                    </Box>

                    {/* Dashboard frame, matching the hero page product preview */}
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
                            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1.25 }}>
                                <Button
                                    component={Link}
                                    to="/app/tasks"
                                    endIcon={<ArrowRight size={14} />}
                                    size="small"
                                    sx={{
                                        ...outlineButtonSx,
                                        minHeight: 0,
                                        py: 0.4,
                                        px: 1.25,
                                        fontSize: '0.75rem',
                                    }}
                                >
                                    View All Tasks
                                </Button>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 2,
                                justifyContent: 'center',
                                flexWrap: 'wrap',
                                p: 2.5,
                            }}
                        >
                            {dueSoonTasks.map((task, i) => (
                                <TaskCard key={task.id} task={task} index={i} />
                            ))}
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ ...glassPanelSx, p: 4, textAlign: 'center' }}>
                    <Typography sx={{ ...sectionTitleSx, fontSize: '1.5rem', mb: 3 }}>
                        Quick Stats
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 3 }}>
                        <Box>
                            <Typography variant="h3" sx={statValueSx}>{tasks.length}</Typography>
                            <Typography variant="body2" sx={{ color: '#71717a', mt: 0.5 }}>Total Tasks</Typography>
                        </Box>
                        <Box>
                            <Typography variant="h3" sx={{ ...statValueSx, background: 'linear-gradient(135deg, #f59e0b, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{inProgressTasks.length}</Typography>
                            <Typography variant="body2" sx={{ color: '#71717a', mt: 0.5 }}>In Progress</Typography>
                        </Box>
                        <Box>
                            <Typography variant="h3" sx={{ ...statValueSx, background: 'linear-gradient(135deg, #10b981, #059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{completedTasks.length}</Typography>
                            <Typography variant="body2" sx={{ color: '#71717a', mt: 0.5 }}>Completed</Typography>
                        </Box>
                        <Box>
                            <Typography variant="h3" sx={{ ...statValueSx, background: 'linear-gradient(135deg, #ef4444, #dc2626)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{assignedUncompletedTasks.length}</Typography>
                            <Typography variant="body2" sx={{ color: '#71717a', mt: 0.5 }}>Assigned Uncompleted</Typography>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
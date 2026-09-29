import { Tab, Tabs, Typography, Box, Grid, Container } from "@mui/material";
import { useEffect, useState } from "react";
import TaskCard from "../components/TaskCard";
import AddTaskCard from "../components/AddTaskCard";
import NewTaskDialog from "../components/NewTaskDialog";
import { pageTitleSx, pageSubtitleSx } from '../styles/heroTheme';
import { getTasksForUser, createTask, deleteTask } from "../api/apitasks";
import { useUser } from "../UserContext";
import { useToast } from "../ToastContext";

export default function TasksPage()
{
    const [activeTab, setActiveTab] = useState(0);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [Tasks, setTasks] = useState([]);
    const {user, loading} = useUser();
    const { showToast } = useToast();

    const fetchTasks = async () => {
        try {
            const res = await getTasksForUser(user.id);

            console.log("Fetched tasks:", res.data);
            console.log("Fetched task IDs:", res.data.map(task => task.id));

            setTasks(res.data);
        } catch (error) {
            console.error("Error fetching tasks: ", error);
        }
    };

    const handleAddTask = async (newTask) => {
        try {
            const res = await createTask(newTask);
            setTasks(prev => [...prev, res.data]);
            setIsDialogOpen(false);
            showToast("Task created");
        } catch (error) {
            console.error("Error creating task: ", error);
            showToast("Failed to create task", "error");
        }
    };
    
    const handleDeleteTask = async(task) => {
        try {
            const res = await deleteTask(task.id);
            setTasks(prev => prev.filter(t => t.id !== task.id));
        } catch (error) {
            console.error("Error deleting task: ", error);
        }
    }

    const handleTabChange = (_event, newValue) => {
        setActiveTab(newValue);
    };

    const handleOpenAddTask = () => {
        setIsDialogOpen(true);
    };

    const handleCloseAddTask = () => {
        setIsDialogOpen(false);
    };

    const filterTasks = () => {
        switch(activeTab) {
            case 1:
                return Tasks?.filter(task => task.status === "in-progress");
            case 2:
                return Tasks?.filter(task => task.status === "completed");
            case 3:
                return Tasks?.filter(task => task.status === "todo");
            default:
                return Tasks;
        }
    };

    const filteredTasks = filterTasks()


    useEffect(() => {
        console.log(Tasks);
        if (!loading && user) {
            fetchTasks();
        }
    }, [user, loading]);

    return (
        <Box sx={{ py: { xs: 4, md: 6 } }}>
            <Container maxWidth="xl">
                <Box sx={{ mb: 5 }}>
                    <Typography component="h1" sx={{ ...pageTitleSx, fontSize: { xs: '2rem', md: '2.4rem' }, textAlign: 'left', mb: 1 }}>
                        All{' '}
                        <Box
                            component="span"
                            sx={{
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Tasks
                        </Box>
                    </Typography>
                    <Typography sx={{ ...pageSubtitleSx, textAlign: 'left', mb: 0 }}>
                        Manage and track all your team's tasks
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: 'inline-flex',
                        gap: 0.5,
                        p: 0.5,
                        mb: 4,
                        borderRadius: 3,
                        backgroundColor: 'rgba(15,15,35,0.04)',
                        border: '1px solid rgba(15,15,35,0.06)',
                    }}
                >
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        TabIndicatorProps={{ style: { display: 'none' } }}
                        sx={{
                            minHeight: 0,
                            '& .MuiTabs-flexContainer': { gap: 0.5 },
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontFamily: "'Inter', sans-serif",
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: '#71717a',
                                minHeight: 0,
                                px: 2,
                                py: 1,
                                borderRadius: 2.5,
                                transition: 'color 0.15s ease',
                                '&:hover': { color: '#3f3f46' },
                            },
                            '& .Mui-selected': {
                                color: '#ffffff !important',
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                boxShadow: '0 4px 10px rgba(99,102,241,0.3)',
                            },
                        }}
                    >
                        <Tab label = {`All Tasks (${Tasks.length})`} disableRipple />
                        <Tab label = {`In Progress (${Tasks.filter(t => t.status === 'in-progress').length})`} disableRipple />
                        <Tab label = {`Completed (${Tasks.filter(t => t.status === 'completed').length})`} disableRipple />
                        <Tab label={`To Do (${Tasks.filter(t => t.status === 'todo').length})`} disableRipple />
                    </Tabs>
                </Box>

                <Grid container spacing={3}>
                    {filteredTasks.map((task) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={task.id}>
                            <TaskCard task={task} onDelete={handleDeleteTask} />
                        </Grid>
                    ))}
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <AddTaskCard onClick={handleOpenAddTask} />
                    </Grid>
                </Grid>
            </Container>

            <NewTaskDialog
                open={isDialogOpen}
                onClose={handleCloseAddTask}
                onCreate={handleAddTask}
            />

        </Box>
    );
}
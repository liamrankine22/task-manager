// Layout for when a user logs into the application
import { AppBar, Box, Toolbar, Container, Button, Avatar, IconButton, MenuItem, Typography, Divider } from "@mui/material";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Calendar, ListTodo, Users, House, Settings, LogOut } from 'lucide-react';
import { useState } from "react";
import Menu from '@mui/material/Menu';
import { pageBackground, soraFont } from '../styles/heroTheme';
import { useUser, } from "../UserContext";
import { BASE_URL } from "../api/apigen";

export default function AppLayout() {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSettings = () => {
        handleClose();
        navigate('/app/settings');
    };

    const handleLogout = async () => {
        handleClose();
        await logout();
        navigate('/login');
    };

    const {user, loading, logout } = useUser();

    return(
        <>
            <Box sx={{ minHeight: '100vh', ...pageBackground }}>
                <AppBar
                    position="static"
                    elevation={0}
                    sx={{
                        backgroundColor: 'rgba(255,255,255,0.85)',
                        backdropFilter: 'blur(14px)',
                        borderBottom: '1px solid rgba(15,15,35,0.06)',
                    }}
                >
                    <Container maxWidth="xl">
                        <Toolbar sx={{ px: { xs: 0 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexGrow: 1 }}>
                                <Box
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: '8px',
                                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        boxShadow: '0 4px 10px rgba(99,102,241,0.3)',
                                    }}
                                >
                                    <ListTodo size={17} />
                                </Box>
                                <Typography
                                    component={Link}
                                    to="/app"
                                    sx={{
                                        fontFamily: soraFont,
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        letterSpacing: '-0.01em',
                                        color: '#18181b',
                                        textDecoration: 'none',
                                    }}
                                >
                                    Task Manager
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                <Button
                                    component={Link}
                                    to="/app"
                                    startIcon={<House size={18} />}
                                    sx={{ textTransform: 'none', fontWeight: 500, color: '#52525b', borderRadius: 2 }}
                                >
                                    Home
                                </Button>
                                <Button
                                    component={Link}
                                    to="/app/tasks"
                                    startIcon={<ListTodo size={18} />}
                                    sx={{ textTransform: 'none', fontWeight: 500, color: '#52525b', borderRadius: 2 }}
                                >
                                    Tasks
                                </Button>
                                <Button
                                    component={Link}
                                    to="/app/groups"
                                    startIcon={<Users size={18} />}
                                    sx={{ textTransform: 'none', fontWeight: 500, color: '#52525b', borderRadius: 2 }}
                                >
                                    Groups
                                </Button>
                                <Button
                                    component={Link}
                                    to="/app/calendar"
                                    startIcon={<Calendar size={18} />}
                                    sx={{ textTransform: 'none', fontWeight: 500, color: '#52525b', borderRadius: 2 }}
                                >
                                    Calendar
                                </Button>
                                <IconButton
                                    onClick={handleClick}
                                    size="small"
                                    sx={{ ml: 2 }}
                                    aria-controls={open ? 'account-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                >
                                    <Avatar
                                        src={user?.avatar}
                                        sx={{ width: 32, height: 32 }}
                                    />
                                </IconButton>
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
                <Outlet />
            </Box>

            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 4px 16px rgba(15,15,35,0.12))',
                            mt: 1.5,
                            minWidth: 260,
                            borderRadius: 3,
                            border: '1px solid rgba(15,15,35,0.06)',
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                borderTop: '1px solid rgba(15,15,35,0.06)',
                                borderLeft: '1px solid rgba(15,15,35,0.06)',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {/* User info header */}
                <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                        src={user.avatar}
                        sx={{ width: 44, height: 44 }}
                    />
                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            sx={{
                                fontFamily: soraFont,
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                color: '#18181b',
                                lineHeight: 1.3,
                            }}
                            noWrap
                        >
                            {user.username}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: '0.78rem',
                                color: '#71717a',
                                lineHeight: 1.3,
                            }}
                            noWrap
                        >
                            {user?.email ?? "temp@example.com"}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ borderColor: 'rgba(15,15,35,0.06)' }} />

                <MenuItem
                    onClick={handleSettings}
                    sx={{ py: 1.1, px: 2.5, gap: 1.5, fontSize: '0.88rem', color: '#3f3f46' }}
                >
                    <Settings size={18} color="#71717a" />
                    Settings
                </MenuItem>

                <MenuItem
                    onClick={handleLogout}
                    sx={{ py: 1.1, px: 2.5, gap: 1.5, fontSize: '0.88rem', color: '#dc2626' }}
                >
                    <LogOut size={18} color="#dc2626" />
                    Log out
                </MenuItem>
            </Menu>
        </>
    );
}
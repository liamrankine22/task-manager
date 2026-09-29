import { useState } from "react";
import { Divider, Typography, Card, CardContent, Box, Avatar, Chip, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, } from "@mui/material";
import { Users, MoreVertical, Eye, Trash2 } from "lucide-react";

export default function GroupCard({ group, onView, onDelete, color }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);

    const handleMenuOpen = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = (event) => {
        event?.stopPropagation();
        setAnchorEl(null);
    };

    const handleView = (event) => {
        handleMenuClose(event);
        onView?.(group);
    };

    const handleDelete = (event) => {
        handleMenuClose(event);
        onDelete?.(group);
    };

    return (
        <Card
            sx={{
                height: '100%',
                borderRadius: 3,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                }
            }}
        >
            <Box
                sx={{
                    height: 8,
                    backgroundColor: color,
                }}
            />
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            backgroundColor: `${color}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >
                        <Users size={24} color={color} />
                    </Box>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography
                            variant="h6"
                            sx={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}
                            noWrap
                        >
                            {group.name}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{ fontFamily: "'Inter', sans-serif", color: '#71717a' }}
                        >
                            {group.membershipResponses.length} {group.membershipResponses.length === 1 ? 'member' : 'members'}
                        </Typography>
                    </Box>

                    <IconButton
                        size="small"
                        onClick={handleMenuOpen}
                        sx={{
                            color: '#71717a',
                            flexShrink: 0,
                            '&:hover': {
                                backgroundColor: 'rgba(15,15,35,0.06)',
                            },
                        }}
                    >
                        <MoreVertical size={18} />
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={menuOpen}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        PaperProps={{
                            sx: {
                                borderRadius: 2,
                                minWidth: 160,
                                boxShadow: '0 8px 24px rgba(15,15,35,0.15)',
                            },
                        }}
                    >
                        <MenuItem
                            onClick={handleView}
                            sx={{ fontFamily: "'Inter', sans-serif", fontSize: '0.875rem' }}
                        >
                            <ListItemIcon>
                                <Eye size={16} />
                            </ListItemIcon>
                            <ListItemText>View</ListItemText>
                        </MenuItem>
                        <MenuItem
                            onClick={handleDelete}
                            sx={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: '0.875rem',
                                color: '#d32f2f',
                            }}
                        >
                            <ListItemIcon>
                                <Trash2 size={16} color="#d32f2f" />
                            </ListItemIcon>
                            <ListItemText>Delete</ListItemText>
                        </MenuItem>
                    </Menu>
                </Box>

                <Typography
                    variant="body2"
                    sx={{ fontFamily: "'Inter', sans-serif", color: '#71717a', mb: 3 }}
                >
                    {group.description}
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Typography
                    variant="subtitle2"
                    sx={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, mb: 2 }}
                >
                    Team Members
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {group.membershipResponses.map((member) => (
                        <Box
                            key={member.id}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                p: 1.5,
                                borderRadius: 2,
                                backgroundColor: 'action.hover',
                                transition: 'background-color 0.2s',
                                '&:hover': {
                                    backgroundColor: 'action.selected',
                                }
                            }}
                        >
                            <Avatar
                                src={member.avatar}
                                sx={{ width: 40, height: 40 }}
                            >
                                {member.username.charAt(0)}
                            </Avatar>
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                <Typography
                                    variant="body2"
                                    sx={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
                                    noWrap
                                >
                                    {member.username}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{ fontFamily: "'Inter', sans-serif", color: '#71717a' }}
                                    noWrap
                                >
                                    {member.email}
                                </Typography>
                            </Box>
                            <Chip
                                label={member.role}
                                size="small"
                                sx={{
                                    backgroundColor: `${color}20`,
                                    color: color,
                                    fontFamily: "'Inter', sans-serif",
                                    fontWeight: 600,
                                }}
                            />
                        </Box>
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
}
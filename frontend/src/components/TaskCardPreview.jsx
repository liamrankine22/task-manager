import { Card, CardContent, Typography, Chip, Box, IconButton, CardActions, Avatar } from "@mui/material";
import { CalendarDays, Circle, EllipsisVertical } from 'lucide-react';
import { soraFont, cardSx } from '../styles/heroTheme';

const avatarPalette = ['#6366f1', '#8b5cf6', '#10b981'];

export default function TaskCardPreview({ task, index = 0 })
{
    const getStatusColor = () => {
        switch (task.status) {
        case 'completed':
            return '#10b981';
        case 'in-progress':
            return '#6366f1';
        default:
            return '#94a3b8';
        }
    };

    const getStatusLabel = () => {
        switch (task.status) {
        case 'completed':
            return 'Completed';
        case 'in-progress':
            return 'In progress';
        default:
            return 'To do';
        }
    };

    const statusColor = getStatusColor();

    return(
        <Card
            sx={{
                ...cardSx,
                minWidth: 280,
                maxWidth: 350,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                p: 0.25,
            }}
        >
            <CardContent sx={{ flexGrow: 1, pb: 1, p: 2.25 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Circle size={8} fill={statusColor} color={statusColor} />
                            <Typography variant="caption" sx={{ color: '#52525b', fontWeight: 500 }}>
                                {getStatusLabel()}
                            </Typography>
                        </Box>
                        <Chip
                            label={task.groupSummary?.name ?? "Unassigned"}
                            size="small"
                            sx={{
                                height: 20,
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                backgroundColor: 'rgba(99,102,241,0.08)',
                                color: '#6366f1',
                            }}
                        />
                    </Box>
                    <IconButton size="small" sx={{ color: '#a1a1aa', mt: -0.5, mr: -0.5 }}>
                        <EllipsisVertical size={16} />
                    </IconButton>
                </Box>

                <Typography
                    variant="subtitle1"
                    sx={{ fontFamily: soraFont, fontWeight: 700, lineHeight: 1.3, mb: 0.5 }}
                >
                    {task.title}
                </Typography>

                <Typography variant="body2" sx={{ color: '#71717a', lineHeight: 1.6 }}>
                    {task.description}
                </Typography>
            </CardContent>

            <CardActions sx={{ px: 2.25, pb: 2.25, pt: 0, justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                        src="public/golshi.png"
                        sx={{
                            width: 26,
                            height: 26,
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            backgroundColor: avatarPalette[index % avatarPalette.length],
                        }}
                    >
                        {task.assignmentSummary.assignedUsername.charAt(0)}
                    </Avatar>
                    <Typography variant="body2" fontWeight={500}>
                        {task.assignmentSummary.assignedUsername}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#a1a1aa' }}>
                    <CalendarDays size={13} />
                    <Typography variant="caption">{task.dueDate}</Typography>
                </Box>
            </CardActions>
        </Card>
    );
}

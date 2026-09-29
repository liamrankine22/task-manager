import { useEffect, useState } from 'react';
import { Box, Container, Typography, Avatar, Chip, IconButton, Button, TextField, Select, MenuItem, OutlinedInput, Divider, } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { Pencil, ArrowLeft, CalendarDays, UserRound, Layers, X, Check, Circle, } from 'lucide-react';
import { pageTitleSx, pageSubtitleSx, glassPanelSx, soraFont } from '../styles/heroTheme';
import { getTaskById, modifyTaskData, deleteTaskAssignment, createTaskAssignment } from '../api/apitasks';
import { getUserById, getUsersByGroupId } from '../api/apiusers';

// Mock data — swap for the real task fetched by :taskId
const initialTask = {
    id: 999,
    title: 'This is a fake task!',
    description: 'The task hasnt loaded properly and its all the developers fault!',
    status: 'in-progress',
    dueDate: '2026-05-07',
    createdDate: '2026-03-07',
    createdById: null,
    groupSummary: { id: 999, name: 'No Team' },
    assignmentSummary: null,
};

// Mock — swap for the real member list of the task's group.
// Objects, not plain strings, since the assignee Select needs id + name.
const availableUsers = [
    { id: 1, name: 'Gold Ship' },
    { id: 2, name: 'Silver Wolf' },
    { id: 3, name: 'Mejiro McQueen' },
    { id: 4, name: 'Tokai Teio' },
];

const avatarPalette = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b'];

const textFieldSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        backgroundColor: '#fafafa',
        '& fieldset': { borderColor: 'rgba(15,15,35,0.08)' },
        '&:hover fieldset': { borderColor: 'rgba(99,102,241,0.4)' },
        '&.Mui-focused fieldset': { borderColor: '#6366f1' },
    },
};

const statusOptions = [
    { value: 'todo', label: 'To do', color: '#94a3b8' },
    { value: 'in-progress', label: 'In progress', color: '#6366f1' },
    { value: 'completed', label: 'Completed', color: '#10b981' },
];

function InfoRow({ icon, label, value }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.1 }}>
            <Box sx={{ color: '#a1a1aa', display: 'flex' }}>{icon}</Box>
            <Typography variant="caption" sx={{ color: '#a1a1aa', minWidth: 110 }}>
                {label}
            </Typography>
            <Typography variant="body2" fontWeight={600} sx={{ color: '#27272a' }}>
                {value}
            </Typography>
        </Box>
    );
}

export default function TaskPage() {
    const { taskId } = useParams();
    const [task, setTask] = useState(initialTask);
    const [createdByUser, setCreatedByUser] = useState(null);
    const [groupMembers, setGroupMembers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(initialTask);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const res = await getTaskById(taskId);
                const normalized = {
                    ...res.data,
                    assignmentSummary: Array.isArray(res.data.assignmentSummary)
                    ? res.data.assignmentSummary[0] ?? null
                    : res.data.assignmentSummary,
                };
                console.log("Fetched task: ", res.data);
                setTask(normalized);
                setDraft(normalized);

                if (res.data.createdById) {
                    const userRes = await getUserById(res.data.createdById);
                    setCreatedByUser(userRes.data.username);
                }

                if (res.data.groupSummary) {
                    const membersRes = await getUsersByGroupId(res.data.groupSummary.id);
                    setGroupMembers(membersRes.data);
                }
            } catch (error) {
                console.error("Error fetching task: ", error);
            };
        };

        fetchTask();
    }, [taskId]);

    const startEdit = () => {
        setDraft(task);
        setIsEditing(true);
    };

    const cancelEdit = () => {
        setDraft(task);
        setIsEditing(false);
    };

    const publishEdit = async (taskData, assignmentData, deleteAssignment) => {
        try {
            await modifyTaskData(taskData);
            if (assignmentData) {
                if (deleteAssignment) {
                    await deleteTaskAssignment(assignmentData);
                } else {
                    await createTaskAssignment(assignmentData);
                };
            };

        } catch (error) {
            console.error("Error updating task: ", error);
        }
    };

    const saveEdit = () => {
        setTask(draft);
        setIsEditing(false);
        
        const updatedTaskData = {
            id: draft.id,
            title: draft.title,
            description: draft.description,
            status: draft.status,
            dueDate: draft.dueDate,
        };

        const updatedAssignmentData = {
            userId: draft.assignmentSummary?.assignedUserId,
            taskId: draft.id,
        };

        if (draft.assignmentSummary?.assignedUserId !== task.assignmentSummary?.assignedUserId) {
            if (draft.assignmentSummary?.assignedUserId) {
                publishEdit(updatedTaskData, updatedAssignmentData, false);
            } else {
                const removedAssignmentData = {
                    userId: task.assignmentSummary?.assignedUserId,
                    taskId: draft.id,
                };
                publishEdit(updatedTaskData, removedAssignmentData, true);
            }
        } else {
            publishEdit(updatedTaskData, null, false);
        }
    };

    const current = isEditing ? draft : task;
    const statusMeta = statusOptions.find((s) => s.value === current.status) ?? statusOptions[0];

    return (
        <Box sx={{ py: { xs: 4, md: 6 } }}>
            <Container maxWidth="md">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Button
                        component={Link}
                        to="/app/tasks"
                        startIcon={<ArrowLeft size={16} />}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 500,
                            fontSize: '0.85rem',
                            color: '#71717a',
                            '&:hover': { backgroundColor: 'rgba(15,15,35,0.04)', color: '#18181b' },
                        }}
                    >
                        Back to tasks
                    </Button>

                    {isEditing ? (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                onClick={cancelEdit}
                                startIcon={<X size={16} />}
                                sx={{ textTransform: 'none', fontWeight: 600, color: '#71717a', borderRadius: 2 }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={saveEdit}
                                startIcon={<Check size={16} />}
                                variant="contained"
                                sx={{
                                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
                                    '&:hover': { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' },
                                }}
                            >
                                Save changes
                            </Button>
                        </Box>
                    ) : (
                        <Button
                            onClick={startEdit}
                            startIcon={<Pencil size={15} />}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                color: '#6366f1',
                                borderRadius: 2,
                                '&:hover': { backgroundColor: 'rgba(99,102,241,0.08)' },
                            }}
                        >
                            Edit task
                        </Button>
                    )}
                </Box>

                {/* Title + status */}
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <Circle size={9} fill={statusMeta.color} color={statusMeta.color} />
                        {isEditing ? (
                            <Select
                                value={draft.status}
                                onChange={(e) => setDraft({ ...draft, status: e.target.value })}
                                size="small"
                                sx={{
                                    minWidth: 140,
                                    borderRadius: 2,
                                    backgroundColor: '#fafafa',
                                    fontSize: '0.85rem',
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(15,15,35,0.08)' },
                                }}
                            >
                                {statusOptions.map((s) => (
                                    <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                                ))}
                            </Select>
                        ) : (
                            <Typography variant="body2" sx={{ color: '#52525b', fontWeight: 500 }}>
                                {statusMeta.label}
                            </Typography>
                        )}
                    </Box>

                    {isEditing ? (
                        <TextField
                            value={draft.title}
                            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                            fullWidth
                            variant="standard"
                            sx={{
                                '& .MuiInputBase-input': {
                                    fontFamily: soraFont,
                                    fontWeight: 800,
                                    fontSize: '1.75rem',
                                    letterSpacing: '-0.02em',
                                    color: '#18181b',
                                },
                            }}
                        />
                    ) : (
                        <Typography sx={{ ...pageTitleSx, fontSize: { xs: '1.75rem', md: '2.1rem' }, textAlign: 'left', mb: 0 }}>
                            {task.title}
                        </Typography>
                    )}
                </Box>

                {/* Description */}
                <Box sx={{ ...glassPanelSx, p: { xs: 2.5, sm: 3.5 }, mb: 3 }}>
                    <Typography sx={{ fontFamily: soraFont, fontWeight: 700, fontSize: '0.95rem', color: '#18181b', mb: 1.5 }}>
                        Description
                    </Typography>
                    {isEditing ? (
                        <TextField
                            value={draft.description}
                            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                            fullWidth
                            multiline
                            rows={4}
                            size="small"
                            sx={textFieldSx}
                        />
                    ) : (
                        <Typography variant="body2" sx={{ color: '#71717a', lineHeight: 1.7 }}>
                            {task.description}
                        </Typography>
                    )}
                </Box>

                {/* Due date + assignee */}
                <Box sx={{ ...glassPanelSx, p: { xs: 2.5, sm: 3.5 }, mb: 3 }}>
                    <Box sx={{ mb: 3 }}>
                        <Typography sx={{ fontFamily: soraFont, fontWeight: 700, fontSize: '0.95rem', color: '#18181b', mb: 1.5 }}>
                            Due date
                        </Typography>
                        {isEditing ? (
                            <TextField
                                type="date"
                                value={draft.dueDate}
                                onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })}
                                size="small"
                                sx={{ ...textFieldSx, maxWidth: 200 }}
                            />
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#52525b' }}>
                                <CalendarDays size={16} />
                                <Typography variant="body2" fontWeight={500}>{task.dueDate}</Typography>
                            </Box>
                        )}
                    </Box>

                    <Divider sx={{ mb: 3, borderColor: 'rgba(15,15,35,0.06)' }} />

                    <Box>
                        <Typography sx={{ fontFamily: soraFont, fontWeight: 700, fontSize: '0.95rem', color: '#18181b', mb: 1.5 }}>
                            Assigned to
                        </Typography>
                        {isEditing ? (
                            <Select
                                value={draft.assignmentSummary?.assignedUserId ?? ''}
                                onChange={(e) => {
                                    const selectedUser = groupMembers.find(u => u.id === e.target.value);
                                    setDraft({
                                        ...draft,
                                        assignmentSummary: selectedUser
                                            ? { assignedUserId: selectedUser.id, assignedUsername: selectedUser.username }
                                            : null,
                                    });
                                }}
                                size="small"
                                fullWidth
                                displayEmpty
                                sx={{ borderRadius: 2, backgroundColor: '#fafafa' }}
                            >
                                <MenuItem value="">
                                    <em>Unassigned</em>
                                </MenuItem>
                                {groupMembers.map((u) => (
                                    <MenuItem key={u.id} value={u.id}>
                                        {u.username}
                                    </MenuItem>
                                ))}
                            </Select>
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {task.assignmentSummary ? (
                                    <>
                                        <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', fontWeight: 600, backgroundColor: avatarPalette[0] }}>
                                            {task.assignmentSummary.assignedUsername?.charAt(0) ?? "?"}
                                        </Avatar>
                                        <Typography variant="body2" fontWeight={500}>
                                            {task.assignmentSummary?.assignedUsername ?? "Unassigned"}
                                        </Typography>
                                    </>
                                ) : (
                                    <Typography variant="body2" sx={{ color: '#a1a1aa' }}>
                                        Unassigned
                                    </Typography>
                                )}
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* Non-editable metadata */}
                <Box sx={{ ...glassPanelSx, p: { xs: 2.5, sm: 3.5 } }}>
                    <Typography sx={{ fontFamily: soraFont, fontWeight: 700, fontSize: '0.95rem', color: '#18181b', mb: 0.5 }}>
                        Details
                    </Typography>
                    <InfoRow icon={<CalendarDays size={15} />} label="Created on" value={task.createdDate} />
                    <InfoRow icon={<UserRound size={15} />} label="Created by" value={createdByUser ?? '—'} />
                    <InfoRow
                        icon={<Layers size={15} />}
                        label="Group"
                        value={
                            <Chip
                                label={task.groupSummary?.name ?? 'No group'}
                                size="small"
                                sx={{
                                    height: 20,
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    backgroundColor: 'rgba(99,102,241,0.1)',
                                    color: '#6366f1',
                                }}
                            />
                        }
                    />
                </Box>
            </Container>
        </Box>
    );
}
import { useState, useEffect } from 'react';
import { Box, Container, Typography, Avatar, Chip, IconButton, Button, TextField, Select, MenuItem, Divider, } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { Users, Pencil, Mail, X, ArrowLeft, UserPlus, Trash2, Check, } from 'lucide-react';
import { pageTitleSx, pageSubtitleSx, glassPanelSx, outlineButtonSx, soraFont } from '../styles/heroTheme';
import { getGroupById, editGroup, createInvite, editRole, deleteMembership } from '../api/apigroups';

const initGroupProper = {
    id: 999,
    name: 'Temporary Group',
    description: 'This is a temporary group for demonstration purposes.',
    membershipResponses: [
        {
            id: 999,
            userId: 999,
            username: 'Temporary User',
            groupSummarResponse: {
                id: 999,
                name: 'Temporary Group',
            },
            role: 'OWNER',
        },

    ],
    taskResponses: [],
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

export default function GroupPage() {
    const { groupId } = useParams(0);
    const [group, setGroup] = useState(initGroupProper);
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(initGroupProper);

    const [inviteEmail, setInviteEmail] = useState('');
    const [pendingInvites, setPendingInvites] = useState([]);

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const res = await getGroupById(groupId);
                setGroup(res.data);
                setDraft(res.data);
            } catch (error) {
                console.error("Error fetching group: ", error);
            };
        };
        fetchGroup();
    }, [groupId]);

    const startEdit = () => {
        setDraft(group);
        setIsEditing(true);
    };

    const cancelEdit = () => {
        setDraft(group);
        setIsEditing(false);
    };

    const publishEdit = async (updatedGroup) => {
        try {
            await editGroup(groupId, updatedGroup);
        } catch (error) {
            console.error("Error publishing group edit: ", error);
        };
    };

    const saveEdit = () => {
        setGroup({ ...group, name: draft.name, description: draft.description });
        setIsEditing(false);
        const newGroupData = {
            id: draft.id,
            name: draft.name,
            description: draft.description,
        }

        publishEdit(newGroupData);
    };

    const handleInvite = async () => {
        const email = inviteEmail.trim();
        if (!email) return;
        setPendingInvites([...pendingInvites, { email }]);
        setInviteEmail('');

        try {
            await createInvite(groupId, { groupId: groupId, email: email });
        } catch (error) {
            console.error("Error sending invite: ", error);
        }
    };

    const removeInvite = (email) => {
        setPendingInvites(pendingInvites.filter((inv) => inv.email !== email));
    };

    const removeMember = async (id) => {
        try {
            await deleteMembership(groupId, id);
            setGroup({ ...group, membershipResponses: group.membershipResponses.filter((m) => m.id !== id) });
        } catch (error) {
            console.error("Error removing member: ", error);
        }
    };

    const changeMemberRole = async (id, memberId, newRole) => {
        const previousMemberships = group.membershipResponses;

        // Immediately update the UI
        setGroup((prev) => ({
            ...prev,
            membershipResponses: prev.membershipResponses.map((m) =>
                m.id === id
                    ? { ...m, role: newRole }
                    : m
            ),
        }));

        const membershipDetails = {
            groupId: group.id,
            memberId: memberId,
            role: newRole,
        };

        try {
            await editRole(membershipDetails);
        } catch (error) {
            console.error("Error changing member role:", error);

            // Revert UI if backend update fails
            setGroup((prev) => ({
                ...prev,
                membershipResponses: previousMemberships,
            }));
        }
    };

    const current = isEditing ? draft : group;

    return (
        <Box sx={{ py: { xs: 4, md: 6 } }}>
            <Container maxWidth="md">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Button
                        component={Link}
                        to="../groups"
                        startIcon={<ArrowLeft size={16} />}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 500,
                            fontSize: '0.85rem',
                            color: '#71717a',
                            '&:hover': { backgroundColor: 'rgba(15,15,35,0.04)', color: '#18181b' },
                        }}
                    >
                        Back to groups
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
                            Edit group
                        </Button>
                    )}
                </Box>

                {/* Group header */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5, mb: 4 }}>
                    <Box
                        sx={{
                            width: 60,
                            height: 60,
                            flexShrink: 0,
                            borderRadius: 3,
                            backgroundColor: `#6366f118`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Users size={28} color={'#6366f1'} />
                    </Box>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        {isEditing ? (
                            <TextField
                                value={draft.name}
                                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                                fullWidth
                                variant="standard"
                                sx={{
                                    mb: 0.5,
                                    '& .MuiInputBase-input': {
                                        fontFamily: soraFont,
                                        fontWeight: 800,
                                        fontSize: '1.6rem',
                                        letterSpacing: '-0.02em',
                                        color: '#18181b',
                                    },
                                }}
                            />
                        ) : (
                            <Typography sx={{ ...pageTitleSx, fontSize: { xs: '1.6rem', md: '2rem' }, textAlign: 'left', mb: 0.25 }}>
                                {group.name}
                            </Typography>
                        )}

                        {isEditing ? (
                            <TextField
                                value={draft.description}
                                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                                fullWidth
                                multiline
                                rows={2}
                                size="small"
                                sx={textFieldSx}
                            />
                        ) : (
                            <Typography sx={{ ...pageSubtitleSx, textAlign: 'left', mb: 0 }}>
                                {group.description}
                            </Typography>
                        )}
                    </Box>
                </Box>

                {/* Members */}
                <Box sx={{ ...glassPanelSx, p: { xs: 2.5, sm: 3.5 }, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                        <Users size={19} color="#6366f1" />
                        <Typography sx={{ fontFamily: soraFont, fontWeight: 700, fontSize: '1.05rem', color: '#18181b' }}>
                            Team Members
                        </Typography>
                        <Chip
                            label={group.membershipResponses.length}
                            size="small"
                            sx={{ ml: 0.5, height: 20, fontSize: '0.7rem', fontWeight: 600, backgroundColor: 'rgba(99,102,241,0.1)', color: '#6366f1' }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                        {group.membershipResponses.map((membership) => (
                            <Box
                                key={membership.id}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    p: 1.5,
                                    borderRadius: 2.5,
                                    backgroundColor: '#fff',
                                    border: '1px solid rgba(15,15,35,0.06)',
                                    transition: 'box-shadow 0.15s ease',
                                    '&:hover': { boxShadow: '0 2px 10px rgba(15,15,35,0.06)' },
                                }}
                            >
                                <Avatar src={membership?.avatar} sx={{ width: 40, height: 40, backgroundColor: '#6366f1', fontWeight: 600 }}>
                                    {membership.username.charAt(0)}
                                </Avatar>
                                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                    <Typography variant="body2" fontWeight={600} noWrap sx={{ color: '#27272a' }}>
                                        {membership.username}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#a1a1aa' }} noWrap>
                                        {membership?.email}
                                    </Typography>
                                </Box>
                                <Select
                                    value={membership.role}
                                    onChange={(e) => changeMemberRole(membership.id, membership.userId, e.target.value)}
                                    size="small"
                                    variant="standard"
                                    disableUnderline
                                    sx={{
                                        backgroundColor: `#6366f118`,
                                        color: '#6366f1',
                                        fontWeight: 600,
                                        fontSize: '0.7rem',
                                        borderRadius: 5,
                                        px: 1.25,
                                        py: 0.25,
                                        '& .MuiSelect-select': {
                                            py: 0.25,
                                            pr: '20px !important',
                                            display: 'flex',
                                            alignItems: 'center',
                                        },
                                        '& .MuiSelect-icon': {
                                            color: '#6366f1',
                                            right: 4,
                                        },
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: { borderRadius: 2, mt: 0.5 },
                                        },
                                    }}
                                >
                                    <MenuItem value="OWNER" sx={{ fontSize: '0.85rem' }}>Owner</MenuItem>
                                    <MenuItem value="ADMIN" sx={{ fontSize: '0.85rem' }}>Admin</MenuItem>
                                    <MenuItem value="MEMBER" sx={{ fontSize: '0.85rem' }}>Member</MenuItem>
                                </Select>
                                {membership.role !== 'OWNER' && (
                                    <IconButton
                                        size="small"
                                        onClick={() => removeMember(membership.userId)}
                                        sx={{ color: '#d4d4d8', '&:hover': { color: '#dc2626', backgroundColor: 'rgba(220,38,38,0.08)' } }}
                                    >
                                        <Trash2 size={15} />
                                    </IconButton>
                                )}
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Invite */}
                <Box sx={{ ...glassPanelSx, p: { xs: 2.5, sm: 3.5 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                        <UserPlus size={19} color="#6366f1" />
                        <Typography sx={{ fontFamily: soraFont, fontWeight: 700, fontSize: '1.05rem', color: '#18181b' }}>
                            Invite people
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1.25, flexDirection: { xs: 'column', sm: 'row' }, mb: pendingInvites.length ? 2.5 : 0 }}>
                        <TextField
                            placeholder="Enter an email address"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                            fullWidth
                            size="small"
                            sx={textFieldSx}
                            InputProps={{
                                startAdornment: <Mail size={16} color="#a1a1aa" style={{ marginRight: 8 }} />,
                            }}
                        />
                        <Button
                            onClick={handleInvite}
                            variant="contained"
                            sx={{
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: 2,
                                px: 2.5,
                                boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
                                whiteSpace: 'nowrap',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                },
                            }}
                        >
                            Send Invite
                        </Button>
                    </Box>

                    {pendingInvites.length > 0 && (
                        <>
                            <Divider sx={{ mb: 2, borderColor: 'rgba(15,15,35,0.06)' }} />
                            <Typography variant="caption" sx={{ color: '#a1a1aa', fontWeight: 600, letterSpacing: '0.02em', mb: 1, display: 'block' }}>
                                PENDING
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {pendingInvites.map((inv) => (
                                    <Chip
                                        key={inv.email}
                                        label={`${inv.email} · ${inv.role}`}
                                        onDelete={() => removeInvite(inv.email)}
                                        deleteIcon={<X size={13} />}
                                        size="small"
                                        sx={{
                                            backgroundColor: 'rgba(99,102,241,0.08)',
                                            color: '#4f46e5',
                                            fontWeight: 500,
                                        }}
                                    />
                                ))}
                            </Box>
                        </>
                    )}
                </Box>
            </Container>
        </Box>
    );
}
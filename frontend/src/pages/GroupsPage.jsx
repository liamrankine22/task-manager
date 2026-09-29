import { Container, Typography, Box, Grid, TextField, InputAdornment } from '@mui/material'
import GroupCard from '../components/GroupCard';
import NewGroupDialog from '../components/NewGroupDialog';
import AddGroupCard from '../components/AddGroupCard';
import { Search, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { pageTitleSx, pageSubtitleSx, nestedCardSx, searchFieldSx, statValueSx, glassPanelSx, } from '../styles/heroTheme';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { getGroupsForUser, createGroup, deleteGroup } from '../api/apigroups';
import { useToast } from '../ToastContext';

// Cycled through when a new group is created, since the create form
// only collects name + description, not a color
const GROUP_COLOR_PALETTE = [
    '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4',
];

export default function GroupsPage()
{
    const [groups, setGroups] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const {user, loading} = useUser();
    const { showToast } = useToast();

    const filteredGroups = groups.filter(group => {
        const name = group.name?.toLowerCase() ?? '';
        const description = group.description?.toLowerCase() ?? '';
        const query = searchQuery?.toLowerCase() ?? '';
        return name.includes(query) || description.includes(query);
    });

    const totalMembers = groups.reduce(
        (total, group) => total + (group.membershipResponses?.length || 0),
        0
    );

    const handleOpenAddGroup = () => {
        setIsDialogOpen(true);
    };

    const handleCloseAddGroup = () => {
        setIsDialogOpen(false);
    };

    const handleCreateGroup = async (newGroup) => {
        try {
            await createGroup(newGroup);
            await getUserGroups(); // always returns the full, correct shape
            setIsDialogOpen(false);
            showToast("Group created");
        } catch (error) {
            console.error("Error creating group:", error);
            showToast("Failed to create group", "error");
        }
    };

    const handleDeleteGroup = async(group) => {
        try {
            const res = await deleteGroup(group.id);
            setGroups(prev => prev.filter(g => g.id !== group.id));
        } catch (error) {
            console.error("Error deleting group: ", error);
        };
    };

    const handleViewGroup = (group) => {
        navigate(`/app/groups/${group.id}`);
    };

    const getUserGroups = async () => {
      try {
        const res = await getGroupsForUser(user.id);
        setGroups(res.data);
      } catch(error) {
        console.error("Error fetching user groups: ", error);
      }
    };

    useEffect(() => {
      getUserGroups();
    }, []);

    return (
        <Box sx={{ py: { xs: 4, md: 6 } }}>
            <Container maxWidth="xl">
                <Box sx={{ mb: 4 }}>
                <Typography component="h1" sx={{ ...pageTitleSx, fontSize: { xs: '2rem', md: '2.4rem' }, textAlign: 'left', mb: 1 }}>
                        Teams & {' '}
                        <Box
                            component="span"
                            sx={{
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Groups
                        </Box>
                        
                    </Typography>
                    <Typography sx={{ ...pageSubtitleSx, textAlign: 'left', mb: 0 }}>
                        View, Create, and Manage your organization's teams and groups
                    </Typography>
                </Box>

                <Box sx={{ mb: 4, display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                    <TextField
                        placeholder="Search groups or members..."
                        variant="outlined"
                        size="medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{ flexGrow: 1, maxWidth: 500, ...searchFieldSx }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search size={20} color="#a1a1aa" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Box sx={{ ...glassPanelSx, display: 'flex', gap: 3, px: 3, py: 1.5, borderRadius: 2.5 }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Users size={18} color="#6366f1" />
                                <Typography variant="h5" sx={statValueSx}>
                                    {groups.length}
                                </Typography>
                            </Box>
                            <Typography variant="caption" sx={{ color: '#71717a' }}>
                                Teams
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h5" sx={statValueSx}>
                                {totalMembers}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#71717a' }}>
                                Total Members
                            </Typography>
                        </Box>
                    </Box>
                </Box>

            <Grid container spacing={3}>
                {filteredGroups.map((group, index) => (
                    <Grid item xs={12} md={6} lg={4} key={group.id}>
                        <Box sx={nestedCardSx}>
                            <GroupCard group={group} onView={handleViewGroup} onDelete={handleDeleteGroup} color={GROUP_COLOR_PALETTE[index % GROUP_COLOR_PALETTE.length]} />
                        </Box>
                    </Grid>
                ))}
                <Grid item xs={12} md={6} lg={4}>
                    <Box sx={nestedCardSx}>
                        <AddGroupCard onClick={handleOpenAddGroup} />
                    </Box>
                </Grid>
            </Grid>

            {filteredGroups.length === 0 && (
                <Box sx={{ ...glassPanelSx, textAlign: 'center', py: 8, mt: 2 }}>
                    <Typography variant="h6" sx={{ color: '#71717a' }}>
                        No groups found matching "{searchQuery}"
                    </Typography>
                </Box>
            )}
        </Container>

        <NewGroupDialog open={isDialogOpen} onClose={handleCloseAddGroup} onCreate={handleCreateGroup} />
    </Box>
    );
}
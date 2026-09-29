import { useEffect, useState } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Avatar, Chip, LinearProgress } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { CalendarDays, Circle } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { pageTitleSx, pageSubtitleSx, sectionTitleSx, cardSx, glassPanelSx, groupChipSx, progressBarSx, soraFont, } from '../styles/heroTheme';
import TaskCard from '../components/TaskCard';
import { getTasksForUser } from '../api/apitasks';
import { useUser } from '../UserContext';

export default function CalendarPage()
{
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [tasks, setTasks] = useState([]); 
    const {user, loading} = useUser();
    
    const parseDateString = (dateString) => {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    const getTasksForDate = (date) => {
        return tasks.filter(task => {
            const taskDate = parseDateString(task.dueDate);
            return isSameDay(taskDate, date);
        });
    };

    const getDatesWithTasks = () => {
        return tasks.map(task => parseDateString(task.dueDate));
    };

    const selectedDateTasks = getTasksForDate(selectedDate);
    const datesWithTasks = getDatesWithTasks();

    const getStatusColor = (status) => {
        switch(status) {
            case 'completed':
                return '#10b981';
            case 'in-progress':
                return '#6366f1';
            default:
                return '#94a3b8';
        }
    };

    const getStatusLabel = (status) => {
        switch(status) {
            case 'completed':
                return 'Completed';
            case 'in-progress':
                return 'In progress';
            default:
                return 'To do';
        }
    };

    const getTasks = async () => {
      try {
        const res = await getTasksForUser(user.id);
        setTasks(res.data);
      } catch (error) {
        console.error("Error fetching Tasks: ", error);
      }
    };

    useEffect(() => {
      getTasks();
    }, []);

    const avatarPalette = ['#6366f1', '#8b5cf6', '#10b981'];
    
  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
        <Typography component="h1" sx={{ ...pageTitleSx, fontSize: { xs: '2rem', md: '2.4rem' }, textAlign: 'left', mb: 1 }}>
                        Task {' '}
                        <Box
                            component="span"
                            sx={{
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Calendar
                        </Box>
                        
                    </Typography>
          <Typography sx={pageSubtitleSx}>
            View and manage tasks by their due dates
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={5} lg={4}>
            <Card sx={{ ...cardSx, position: 'sticky', top: 20, '&:hover': { transform: 'none', boxShadow: '0 1px 2px rgba(15,15,35,0.04)' } }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <CalendarDays size={22} color="#6366f1" />
                  <Typography sx={sectionTitleSx}>
                    Select Date
                  </Typography>
                </Box>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateCalendar
                    value={selectedDate}
                    onChange={(newDate) => newDate && setSelectedDate(newDate)}
                    slotProps={{
                      day: (dayProps) => {
                        const hasTask = datesWithTasks.some(taskDate =>
                          isSameDay(taskDate, dayProps.day)
                        );
                        return {
                          sx: {
                            position: 'relative',
                            ...(hasTask && {
                              fontWeight: 'bold',
                              '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: 4,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                backgroundColor: '#6366f1',
                              },
                            }),
                          },
                        };
                      },
                    }}
                    sx={{
                      width: '100%',
                      '& .MuiPickersCalendarHeader-root': {
                        paddingLeft: 1,
                        paddingRight: 1,
                      },
                      '& .MuiDayCalendar-header': {
                        justifyContent: 'space-between',
                      },
                      '& .MuiPickersDay-root': {
                        '&.Mui-selected': {
                          backgroundColor: '#6366f1',
                          '&:hover': {
                            backgroundColor: '#5558e3',
                          },
                          '&::after': {
                            backgroundColor: 'white !important',
                          },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
                <Box sx={{ mt: 3, p: 2, backgroundColor: 'rgba(99,102,241,0.06)', borderRadius: 2 }}>
                  <Typography variant="caption" fontWeight={600} display="block" gutterBottom sx={{ color: '#52525b' }}>
                    Upcoming Tasks
                  </Typography>
                  {datesWithTasks.slice(0, 5).map((date, index) => {
                    const tasksOnDate = getTasksForDate(date);
                    return (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          py: 0.5,
                        }}
                      >
                        <Typography variant="caption" sx={{ color: '#71717a' }}>
                          {format(date, 'MMM d')}
                        </Typography>
                        <Chip
                          label={tasksOnDate.length}
                          size="small"
                          sx={{ height: 20, fontSize: '0.7rem', backgroundColor: 'rgba(99,102,241,0.08)', color: '#6366f1', fontWeight: 600 }}
                        />
                      </Box>
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={7} lg={8}>
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ ...sectionTitleSx, fontSize: '1.5rem', mb: 0.5 }}>
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </Typography>
              <Typography variant="body2" sx={{ color: '#71717a' }}>
                {selectedDateTasks.length} {selectedDateTasks.length === 1 ? 'task' : 'tasks'} due on this date
              </Typography>
            </Box>

            {selectedDateTasks.length === 0 ? (
              <Box sx={{ ...glassPanelSx, py: 8, textAlign: 'center' }}>
                <CalendarDays size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
                <Typography variant="h6" sx={{ color: '#71717a', fontFamily: soraFont, fontWeight: 700 }}>
                  No tasks due on this date
                </Typography>
                <Typography variant="body2" sx={{ color: '#a1a1aa' }}>
                  Select another date to view tasks
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {selectedDateTasks.map((task, index) => {
                  return(
                  <TaskCard key={task.id} task={task} index={index}/>
                )})}
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  InputAdornment,
  Tab,
  Tabs,
  IconButton,
  Menu,
  MenuItem,
  Fab,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import api from '../services/api';

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [sortAnchor, setSortAnchor] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState(null);
  const [openTaskForm, setOpenTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: ''
  });
  const [sortBy, setSortBy] = useState('createdAt_desc');

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [filters, sortBy, tabValue]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = {
        status: tabValue === 0 ? '' : ['pending', 'in-progress', 'completed'][tabValue - 1],
        search: searchTerm,
        ...filters
      };
      
      if (sortBy) {
        const [field, order] = sortBy.split('_');
        params.sort = `${order === 'desc' ? '-' : ''}${field}`;
      }
      
      const response = await api.get('/tasks', { params });
      setTasks(response.data.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/tasks/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setOpenTaskForm(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setOpenTaskForm(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${taskId}`);
        fetchTasks();
        fetchStats();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
      fetchStats();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return task.title.toLowerCase().includes(searchLower) || 
             task.description?.toLowerCase().includes(searchLower);
    }
    return true;
  });

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.name}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your tasks today.
        </Typography>
      </Box>

      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total Tasks
              </Typography>
              <Typography variant="h3">
                {stats.byStatus.reduce((acc, curr) => acc + curr.count, 0)}
              </Typography>
            </Paper>
          </Grid>
          {stats.byStatus.map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat._id}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {stat._id || 'No Status'}
                </Typography>
                <Typography variant="h3">{stat.count}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={(e) => setFilterAnchor(e.currentTarget)}
                size="small"
              >
                Filter
              </Button>
              <Button
                variant="outlined"
                startIcon={<SortIcon />}
                onClick={(e) => setSortAnchor(e.currentTarget)}
                size="small"
              >
                Sort
              </Button>
              <IconButton onClick={fetchTasks}>
                <RefreshIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Menu anchorEl={filterAnchor} open={Boolean(filterAnchor)} onClose={() => setFilterAnchor(null)}>
        <MenuItem onClick={() => { setFilters({ ...filters, priority: 'low' }); setFilterAnchor(null); }}>
          Low Priority
        </MenuItem>
        <MenuItem onClick={() => { setFilters({ ...filters, priority: 'medium' }); setFilterAnchor(null); }}>
          Medium Priority
        </MenuItem>
        <MenuItem onClick={() => { setFilters({ ...filters, priority: 'high' }); setFilterAnchor(null); }}>
          High Priority
        </MenuItem>
        <MenuItem onClick={() => { setFilters({ ...filters, priority: 'critical' }); setFilterAnchor(null); }}>
          Critical Priority
        </MenuItem>
        <MenuItem onClick={() => { setFilters({ ...filters, priority: '' }); setFilterAnchor(null); }}>
          Clear Filter
        </MenuItem>
      </Menu>

      <Menu anchorEl={sortAnchor} open={Boolean(sortAnchor)} onClose={() => setSortAnchor(null)}>
        <MenuItem onClick={() => { setSortBy('createdAt_desc'); setSortAnchor(null); }}>
          Newest First
        </MenuItem>
        <MenuItem onClick={() => { setSortBy('createdAt_asc'); setSortAnchor(null); }}>
          Oldest First
        </MenuItem>
        <MenuItem onClick={() => { setSortBy('dueDate_asc'); setSortAnchor(null); }}>
          Due Date (Earliest)
        </MenuItem>
        <MenuItem onClick={() => { setSortBy('dueDate_desc'); setSortAnchor(null); }}>
          Due Date (Latest)
        </MenuItem>
        <MenuItem onClick={() => { setSortBy('priority_desc'); setSortAnchor(null); }}>
          Priority (Highest)
        </MenuItem>
        <MenuItem onClick={() => { setSortBy('priority_asc'); setSortAnchor(null); }}>
          Priority (Lowest)
        </MenuItem>
      </Menu>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="All" />
          <Tab label="Pending" />
          <Tab label="In Progress" />
          <Tab label="Completed" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={tabValue}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredTasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} key={task._id}>
                <TaskCard
                  task={task}
                  onEdit={() => handleEditTask(task)}
                  onDelete={() => handleDeleteTask(task._id)}
                  onStatusChange={(status) => handleStatusChange(task._id, status)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleCreateTask}
      >
        <AddIcon />
      </Fab>

      <TaskForm
        open={openTaskForm}
        onClose={() => setOpenTaskForm(false)}
        task={selectedTask}
        onSuccess={() => {
          fetchTasks();
          fetchStats();
        }}
      />
    </Container>
  );
}

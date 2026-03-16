import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as PendingIcon,
  PlayArrow as InProgressIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

const priorityColors = {
  low: 'success',
  medium: 'info',
  high: 'warning',
  critical: 'error'
};

const statusIcons = {
  pending: <PendingIcon fontSize="small" />,
  'in-progress': <InProgressIcon fontSize="small" />,
  completed: <CheckCircleIcon fontSize="small" />
};

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="h2" sx={{ wordBreak: 'break-word' }}>
            {task.title}
          </Typography>
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
        </Box>

        {task.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {task.description.length > 100 
              ? `${task.description.substring(0, 100)}...` 
              : task.description}
          </Typography>
        )}

        <Box sx={{ mb: 2 }}>
          <Chip
            icon={statusIcons[task.status]}
            label={task.status}
            size="small"
            color={getStatusColor(task.status)}
            sx={{ mr: 1, mb: 1 }}
          />
          <Chip
            label={task.priority}
            size="small"
            color={priorityColors[task.priority]}
            sx={{ mr: 1, mb: 1 }}
          />
        </Box>

        {task.dueDate && (
          <Typography variant="body2" color="text.secondary">
            Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
          </Typography>
        )}

        {task.tags && task.tags.length > 0 && (
          <Box sx={{ mt: 2 }}>
            {task.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            ))}
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {task.assignedTo && (
            <Tooltip title={`Assigned to ${task.assignedTo.name}`}>
              <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                {task.assignedTo.name.charAt(0)}
              </Avatar>
            </Tooltip>
          )}
        </Box>

        <Box>
          <IconButton size="small" onClick={onEdit}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onDelete}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </CardActions>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { onStatusChange('pending'); handleMenuClose(); }}>
          <PendingIcon sx={{ mr: 1 }} fontSize="small" /> Set Pending
        </MenuItem>
        <MenuItem onClick={() => { onStatusChange('in-progress'); handleMenuClose(); }}>
          <InProgressIcon sx={{ mr: 1 }} fontSize="small" /> Set In Progress
        </MenuItem>
        <MenuItem onClick={() => { onStatusChange('completed'); handleMenuClose(); }}>
          <CheckCircleIcon sx={{ mr: 1 }} fontSize="small" /> Set Completed
        </MenuItem>
      </Menu>
    </Card>
  );
}

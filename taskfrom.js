import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  OutlinedInput
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function TaskForm({ open, onClose, task, onSuccess }) {
  const { control, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      dueDate: null,
      tags: []
    }
  });

  useEffect(() => {
    if (task) {
      reset(task);
    } else {
      reset({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: null,
        tags: []
      });
    }
  }, [task, reset]);

  const onSubmit = async (data) => {
    try {
      if (task) {
        await api.put(`/tasks/${task._id}`, data);
        toast.success('Task updated successfully');
      } else {
        await api.post('/tasks', data);
        toast.success('Task created successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleTagsChange = (event) => {
    const value = event.target.value;
    setValue('tags', typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Controller
            name="title"
            control={control}
            rules={{ required: 'Title is required' }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                label="Title"
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Description"
                margin="normal"
                multiline
                rows={4}
              />
            )}
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select {...field} label="Status">
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </FormControl>
              )}
            />

            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select {...field} label="Priority">
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="critical">Critical</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Box>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Due Date"
                  value={field.value}
                  onChange={field.onChange}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth margin="normal" />
                  )}
                />
              )}
            />
          </LocalizationProvider>

          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="normal">
                <InputLabel>Tags</InputLabel>
                <Select
                  {...field}
                  multiple
                  value={field.value || []}
                  onChange={handleTagsChange}
                  input={<OutlinedInput label="Tags" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="work">Work</MenuItem>
                  <MenuItem value="personal">Personal</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                  <MenuItem value="meeting">Meeting</MenuItem>
                  <MenuItem value="deadline">Deadline</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {task ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

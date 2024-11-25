"use client";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { Node, TreeNode } from '../types';
import { useState } from 'react';

interface NodeDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Node>) => void;
  type: 'group' | 'project';
  initialData?: Node;
  availableParents: TreeNode[];
}

export const NodeDialog = ({
  open,
  onClose,
  onSubmit,
  type,
  initialData,
  availableParents,
}: NodeDialogProps) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      parentId: initialData?.parentId || '',  // Changed from null to empty string
    },
  });

  const handleFormSubmit = (data: any) => {
    onSubmit({
      ...data,
      type,
      id: initialData?.id,
      // Convert empty string back to null for the parent ID
      parentId: data.parentId === '' ? null : data.parentId,
    });
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Edit' : 'Create'} {type}</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <div className="space-y-4">
            <Controller
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Name"
                  fullWidth
                  required
                />
              )}
            />
            
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                />
              )}
            />

            <Controller
              name="parentId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Parent</InputLabel>
                  <Select {...field} label="Parent">
                    <MenuItem value="">None</MenuItem>
                    {availableParents
                      .filter(parent => parent.type === 'group' && parent.id !== initialData?.id)
                      .map((parent) => (
                        <MenuItem key={parent.id} value={parent.id}>
                          {parent.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              )}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {initialData ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
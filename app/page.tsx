"use client";

import { useState } from 'react';
import { Button, Container, Paper, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';
import { ProjectTree } from './components/ProjectTree';
import { NodeDialog } from './components/NodeDialog';
import { useProjectTree } from './hooks/useProjectTree';
import { Node, TreeNode } from './types';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const { tree, addNode, updateNode, moveNode, deleteNode } = useProjectTree();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'group' | 'project'>('group');
  const [editingNode, setEditingNode] = useState<Node | undefined>();

  const handleCreateNode = (type: 'group' | 'project') => {
    setDialogType(type);
    setEditingNode(undefined);
    setDialogOpen(true);
  };

  const handleEditNode = (node: TreeNode) => {
    setDialogType(node.type);
    setEditingNode(node);
    setDialogOpen(true);
  };

  const handleSubmit = (data: Partial<Node>) => {
    if (editingNode) {
      updateNode({
        ...editingNode,
        ...data,
        updatedAt: new Date(),
      } as Node);
    } else {
      addNode({
        id: uuidv4(),
        name: data.name!,
        description: data.description!,
        type: data.type as 'group' | 'project',
        parentId: data.parentId || null,
        members: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Paper className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h4" component="h1">
            Project Management
          </Typography>
          <div className="space-x-2">
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => handleCreateNode('group')}
            >
              New Group
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleCreateNode('project')}
            >
              New Project
            </Button>
          </div>
        </div>

        <ProjectTree
          nodes={tree}
          onMove={moveNode}
          onEdit={handleEditNode}
          onDelete={deleteNode}
        />

        <NodeDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSubmit={handleSubmit}
          type={dialogType}
          initialData={editingNode}
          availableParents={tree}
        />
      </Paper>
    </Container>
  );
}
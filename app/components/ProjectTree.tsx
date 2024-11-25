"use client";

import { TreeNode } from '../types';
import { TreeView, TreeItem } from '@mui/lab';
import { ExpandMore, ChevronRight, Folder, Description } from '@mui/icons-material';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { MoreVert } from '@mui/icons-material';

interface ProjectTreeProps {
  nodes: TreeNode[];
  onMove: (nodeId: string, newParentId: string | null) => void;
  onEdit: (node: TreeNode) => void;
  onDelete: (nodeId: string) => void;
}

export const ProjectTree = ({ nodes, onMove, onEdit, onDelete }: ProjectTreeProps) => {
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    nodeId: string;
  } | null>(null);

  const renderTree = (node: TreeNode) => (
    <TreeItem
      key={node.id}
      nodeId={node.id}
      label={
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            {node.type === 'group' ? <Folder fontSize="small" /> : <Description fontSize="small" />}
            <span>{node.name}</span>
          </div>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setContextMenu({
                mouseX: e.clientX,
                mouseY: e.clientY,
                nodeId: node.id,
              });
            }}
          >
            <MoreVert fontSize="small" />
          </IconButton>
        </div>
      }
    >
      {Array.isArray(node.children) && node.children.map((child) => renderTree(child))}
    </TreeItem>
  );

  return (
    <div className="w-full">
      <TreeView
        defaultCollapseIcon={<ExpandMore />}
        defaultExpandIcon={<ChevronRight />}
        className="w-full"
      >
        {nodes.map((node) => renderTree(node))}
      </TreeView>

      <Menu
        open={contextMenu !== null}
        onClose={() => setContextMenu(null)}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem
          onClick={() => {
            if (contextMenu) {
              onEdit(nodes.find(n => n.id === contextMenu.nodeId) as TreeNode);
              setContextMenu(null);
            }
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (contextMenu) {
              onDelete(contextMenu.nodeId);
              setContextMenu(null);
            }
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
};
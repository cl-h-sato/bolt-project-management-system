"use client";

import { useState, useCallback } from 'react';
import { Node, TreeNode } from '../types';

export const useProjectTree = (initialNodes: Node[] = []) => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);

  const buildTree = useCallback((nodes: Node[]): TreeNode[] => {
    const nodeMap = new Map<string, TreeNode>();
    
    // First, create TreeNode objects for all nodes
    nodes.forEach(node => {
      nodeMap.set(node.id, { ...node, children: [] });
    });
    
    const rootNodes: TreeNode[] = [];
    
    // Then, build the tree structure
    nodes.forEach(node => {
      const treeNode = nodeMap.get(node.id)!;
      if (node.parentId === null) {
        rootNodes.push(treeNode);
      } else {
        const parent = nodeMap.get(node.parentId);
        if (parent) {
          parent.children.push(treeNode);
        }
      }
    });
    
    return rootNodes;
  }, []);

  const addNode = useCallback((node: Node) => {
    setNodes(prev => [...prev, node]);
  }, []);

  const updateNode = useCallback((updatedNode: Node) => {
    setNodes(prev => prev.map(node => 
      node.id === updatedNode.id ? updatedNode : node
    ));
  }, []);

  const moveNode = useCallback((nodeId: string, newParentId: string | null) => {
    setNodes(prev => prev.map(node =>
      node.id === nodeId ? { ...node, parentId: newParentId } : node
    ));
  }, []);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes(prev => {
      const nodesToDelete = new Set<string>();
      
      // Helper function to collect all descendant node IDs
      const collectDescendants = (id: string) => {
        prev.forEach(node => {
          if (node.parentId === id) {
            nodesToDelete.add(node.id);
            collectDescendants(node.id);
          }
        });
      };
      
      nodesToDelete.add(nodeId);
      collectDescendants(nodeId);
      
      return prev.filter(node => !nodesToDelete.has(node.id));
    });
  }, []);

  const tree = buildTree(nodes);

  return {
    nodes,
    tree,
    addNode,
    updateNode,
    moveNode,
    deleteNode
  };
};
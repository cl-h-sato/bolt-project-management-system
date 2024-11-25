export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface BaseNode {
  id: string;
  name: string;
  description: string;
  members: User[];
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Group extends BaseNode {
  type: 'group';
}

export interface Project extends BaseNode {
  type: 'project';
}

export type Node = Group | Project;

export interface TreeNode extends Node {
  children: TreeNode[];
}
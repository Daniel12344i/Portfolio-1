export interface AdminStats {
  totalProjects: number;
  publishedProjects: number;
  draftProjects: number;
  storageUsed: string;
  lastUpdate: string;
  activeUsers: number;
  systemStatus: 'operational' | 'maintenance' | 'error';
}

export interface AdminDashboardProps {
  adminToken: string;
  onLogout: () => void;
}

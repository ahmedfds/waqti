import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  Settings,
  Shield,
  MessageSquare,
  Star,
  Calendar,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Button from '../components/Button';

interface AdminDashboardPageProps {
  setActivePage: (page: string) => void;
}

interface DashboardStats {
  totalUsers: number;
  totalServices: number;
  totalBookings: number;
  totalRevenue: number;
  activeUsers: number;
  pendingVerifications: number;
  openDisputes: number;
  monthlyGrowth: number;
}

interface RecentActivity {
  id: string;
  type: 'user_registered' | 'service_created' | 'booking_made' | 'payment_completed' | 'dispute_opened';
  description: string;
  timestamp: Date;
  userId?: string;
  userName?: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  balance: number;
  created_at: string;
  last_login?: string;
  status: 'active' | 'suspended' | 'pending';
  verification_status: 'verified' | 'pending' | 'rejected';
}

interface ServiceData {
  id: string;
  title: string;
  category: string;
  provider_name: string;
  hourly_rate: number;
  rating: number;
  reviews_count: number;
  status: 'active' | 'suspended' | 'pending';
  created_at: string;
}

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ setActivePage }) => {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalServices: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeUsers: 0,
    pendingVerifications: 0,
    openDisputes: 0,
    monthlyGrowth: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Check if user is admin (you can implement your own admin check logic)
  const isAdmin = user?.email === 'admin@waqti.com' || user?.id === 'admin';

  useEffect(() => {
    if (!isLoading && user) {
      if (!isAdmin) {
        setActivePage('dashboard'); // Redirect non-admins to regular dashboard
        return;
      }
      loadDashboardData();
    }
  }, [user, isLoading, isAdmin]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadStats(),
        loadRecentActivity(),
        loadUsers(),
        loadServices()
      ]);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Get total services
      const { count: totalServices } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true });

      // Get total bookings
      const { count: totalBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });

      // Calculate active users (logged in within last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count: activeUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString());

      // Mock data for other stats (implement based on your schema)
      setStats({
        totalUsers: totalUsers || 0,
        totalServices: totalServices || 0,
        totalBookings: totalBookings || 0,
        totalRevenue: 125000, // Mock data
        activeUsers: activeUsers || 0,
        pendingVerifications: 5, // Mock data
        openDisputes: 2, // Mock data
        monthlyGrowth: 15.5 // Mock data
      });
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const loadRecentActivity = async () => {
    try {
      // Get recent users
      const { data: recentUsers } = await supabase
        .from('users')
        .select('id, name, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      // Get recent services
      const { data: recentServices } = await supabase
        .from('services')
        .select('id, title, created_at, provider_id, users!services_provider_id_fkey(name)')
        .order('created_at', { ascending: false })
        .limit(5);

      const activities: RecentActivity[] = [];

      // Add user registrations
      recentUsers?.forEach(user => {
        activities.push({
          id: `user_${user.id}`,
          type: 'user_registered',
          description: `${user.name} registered`,
          timestamp: new Date(user.created_at),
          userId: user.id,
          userName: user.name
        });
      });

      // Add service creations
      recentServices?.forEach(service => {
        activities.push({
          id: `service_${service.id}`,
          type: 'service_created',
          description: `New service "${service.title}" created`,
          timestamp: new Date(service.created_at),
          userId: service.provider_id,
          userName: (service.users as any)?.name
        });
      });

      // Sort by timestamp
      activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      setRecentActivity(activities.slice(0, 10));
    } catch (err) {
      console.error('Error loading recent activity:', err);
    }
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const userData: UserData[] = data?.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email || '',
        phone: user.phone || '',
        balance: user.balance || 0,
        created_at: user.created_at,
        status: 'active', // You can add this field to your schema
        verification_status: 'verified' // You can add this field to your schema
      })) || [];

      setUsers(userData);
    } catch (err) {
      console.error('Error loading users:', err);
    }
  };

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          users!services_provider_id_fkey(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const serviceData: ServiceData[] = data?.map(service => ({
        id: service.id,
        title: service.title,
        category: service.category,
        provider_name: (service.users as any)?.name || 'Unknown',
        hourly_rate: service.hourly_rate,
        rating: service.rating || 0,
        reviews_count: service.reviews_count || 0,
        status: 'active', // You can add this field to your schema
        created_at: service.created_at
      })) || [];

      setServices(serviceData);
    } catch (err) {
      console.error('Error loading services:', err);
    }
  };

  const handleUserAction = async (userId: string, action: 'suspend' | 'activate' | 'delete') => {
    try {
      if (action === 'delete') {
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', userId);
        
        if (error) throw error;
        setUsers(users.filter(u => u.id !== userId));
      }
      // Implement other actions based on your schema
    } catch (err) {
      console.error(`Error ${action} user:`, err);
    }
  };

  const handleServiceAction = async (serviceId: string, action: 'suspend' | 'activate' | 'delete') => {
    try {
      if (action === 'delete') {
        const { error } = await supabase
          .from('services')
          .delete()
          .eq('id', serviceId);
        
        if (error) throw error;
        setServices(services.filter(s => s.id !== serviceId));
      }
      // Implement other actions based on your schema
    } catch (err) {
      console.error(`Error ${action} service:`, err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('ar-AE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registered': return <Users className="h-4 w-4 text-blue-500" />;
      case 'service_created': return <Briefcase className="h-4 w-4 text-green-500" />;
      case 'booking_made': return <Calendar className="h-4 w-4 text-purple-500" />;
      case 'payment_completed': return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'dispute_opened': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E86AB] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to access the admin dashboard.</p>
          <Button variant="primary" onClick={() => setActivePage('dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your Waqti platform</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                leftIcon={<RefreshCw className="h-4 w-4" />}
                onClick={loadDashboardData}
              >
                Refresh
              </Button>
              <Button
                variant="primary"
                leftIcon={<Settings className="h-4 w-4" />}
              >
                Settings
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-sm text-green-600">+{stats.monthlyGrowth}% this month</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Services</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalServices.toLocaleString()}</p>
                <p className="text-sm text-green-600">+12% this month</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Briefcase className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-sm text-green-600">+8% this month</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeUsers.toLocaleString()}</p>
                <p className="text-sm text-green-600">+5% this month</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: BarChart3 },
                { id: 'users', name: 'Users', icon: Users },
                { id: 'services', name: 'Services', icon: Briefcase },
                { id: 'analytics', name: 'Analytics', icon: LineChart }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-[#2E86AB] text-[#2E86AB]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Quick Actions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-yellow-800">Pending Verifications</p>
                          <p className="text-2xl font-bold text-yellow-900">{stats.pendingVerifications}</p>
                        </div>
                        <AlertTriangle className="h-8 w-8 text-yellow-600" />
                      </div>
                      <Button variant="secondary" size="sm" className="mt-3 w-full">
                        Review Verifications
                      </Button>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-red-800">Open Disputes</p>
                          <p className="text-2xl font-bold text-red-900">{stats.openDisputes}</p>
                        </div>
                        <MessageSquare className="h-8 w-8 text-red-600" />
                      </div>
                      <Button variant="secondary" size="sm" className="mt-3 w-full">
                        Resolve Disputes
                      </Button>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-800">System Health</p>
                          <p className="text-lg font-bold text-blue-900">Excellent</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-blue-600" />
                      </div>
                      <Button variant="secondary" size="sm" className="mt-3 w-full">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                      {recentActivity.map(activity => (
                        <div key={activity.id} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                          {getActivityIcon(activity.type)}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                            <p className="text-xs text-gray-500">
                              {activity.timestamp.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="pending">Pending</option>
                    </select>
                    <Button variant="primary" leftIcon={<Download className="h-4 w-4" />}>
                      Export
                    </Button>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Balance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.slice(0, 10).map(user => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.balance} hours</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.status === 'active' ? 'bg-green-100 text-green-800' :
                              user.status === 'suspended' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(user.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-gray-600 hover:text-gray-900">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleUserAction(user.id, 'delete')}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Service Management</h3>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search services..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                      />
                    </div>
                    <Button variant="primary" leftIcon={<Download className="h-4 w-4" />}>
                      Export
                    </Button>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Provider
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rating
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {services.slice(0, 10).map(service => (
                        <tr key={service.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{service.title}</div>
                              <div className="text-sm text-gray-500">{service.category}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{service.provider_name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{service.hourly_rate} hours</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                              <span className="text-sm text-gray-900">{service.rating}</span>
                              <span className="text-sm text-gray-500 ml-1">({service.reviews_count})</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              service.status === 'active' ? 'bg-green-100 text-green-800' :
                              service.status === 'suspended' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {service.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-gray-600 hover:text-gray-900">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleServiceAction(service.id, 'delete')}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Analytics & Reports</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">User Growth</h4>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      <PieChart className="h-16 w-16 mb-2" />
                      <p>Chart will be implemented with a charting library</p>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Revenue Trends</h4>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      <LineChart className="h-16 w-16 mb-2" />
                      <p>Chart will be implemented with a charting library</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Platform Metrics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{((stats.totalBookings / stats.totalServices) * 100).toFixed(1)}%</p>
                      <p className="text-sm text-gray-600">Service Utilization Rate</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%</p>
                      <p className="text-sm text-gray-600">User Engagement Rate</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{(stats.totalRevenue / stats.totalBookings).toFixed(0)} AED</p>
                      <p className="text-sm text-gray-600">Average Transaction Value</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
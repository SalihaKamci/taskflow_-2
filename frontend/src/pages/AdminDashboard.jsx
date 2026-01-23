import { useState, useEffect } from 'react';
import { getDashboardStats } from '../api/dashboard';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold mb-2">No Dashboard Data Available</h2>
          <p className="text-gray-600 mb-6">Unable to load dashboard statistics. Please try again.</p>
          <button 
            onClick={fetchDashboardStats}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const calculateDaysOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getPriorityColor = (priority) => {
    const priorityLower = priority?.toLowerCase();
    return priorityLower === 'high' ? 'bg-red-100 text-red-800' :
           priorityLower === 'medium' ? 'bg-orange-100 text-orange-800' :
           'bg-green-100 text-green-800';
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    return statusLower === 'in_progress' || statusLower === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
           statusLower === 'todo' || statusLower === 'pending' ? 'bg-blue-100 text-blue-800' :
           'bg-gray-100 text-gray-800';
  };

  const getCompletionRateColor = (rate) => {
    return rate >= 80 ? 'bg-green-100 text-green-800' :
           rate >= 60 ? 'bg-blue-100 text-blue-800' :
           rate >= 40 ? 'bg-yellow-100 text-yellow-800' :
           'bg-red-100 text-red-800';
  };

  const getPerformanceLabel = (rate) => {
    return rate >= 80 ? 'Excellent' :
           rate >= 60 ? 'Good' :
           rate >= 40 ? 'Average' :
           'Needs Improvement';
  };

  const overallCompletionRate = stats.totals?.tasks > 0 
    ? Math.round((stats.taskStats?.completed / stats.totals.tasks) * 100)
    : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <button 
          onClick={fetchDashboardStats}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Data
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Projects</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totals?.projects || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totals?.tasks || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.223.447-.481.801-.78 1H22l-2.5-3-2.5 3h2.28c-.299-.199-.557-.553-.78-1a7.96 7.96 0 00.78-1H17l2.5 3 2.5-3h-2.28c.299.199.557.553.78 1z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Employees</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totals?.employees || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Task Statistics Cards */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Task Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Tasks</p>
                <p className="text-2xl font-bold">{stats.taskStats?.today || 0}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Weekly Tasks</p>
                <p className="text-2xl font-bold">{stats.taskStats?.weekly || 0}</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className={`text-2xl font-bold ${stats.taskStats?.overdue > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {stats.taskStats?.overdue || 0}
                </p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold">{overallCompletionRate}%</p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Task Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-800">Pending</span>
              <span className="text-xl font-bold text-blue-800">{stats.taskStats?.pending || 0}</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(stats.taskStats?.pending / (stats.totals?.tasks || 1)) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-yellow-800">In Progress</span>
              <span className="text-xl font-bold text-yellow-800">{stats.taskStats?.inProgress || 0}</span>
            </div>
            <div className="w-full bg-yellow-200 rounded-full h-2">
              <div 
                className="bg-yellow-600 h-2 rounded-full"
                style={{ width: `${(stats.taskStats?.inProgress / (stats.totals?.tasks || 1)) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-800">Completed</span>
              <span className="text-xl font-bold text-green-800">{stats.taskStats?.completed || 0}</span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${(stats.taskStats?.completed / (stats.totals?.tasks || 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Performance Section */}
      {stats.employeeStats && stats.employeeStats.length > 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Employee Performance</h2>
            <span className="text-sm text-gray-600">
              {stats.employeeStats.length} employee{stats.employeeStats.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task Distribution
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completion Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.employeeStats.map((employee, index) => (
                  <tr key={employee.id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {employee.fullName?.charAt(0) || 'U'}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {employee.fullName || 'Unnamed Employee'}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {employee.email || 'No email provided'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Total: {employee.totalAssignedTasks || 0}</span>
                          <span className="text-gray-600">
                            {employee.inProgressTasks || 0} in progress
                          </span>
                        </div>
                        <div className="flex h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-green-500" 
                            style={{ width: `${employee.totalAssignedTasks > 0 ? (employee.completedTasks / employee.totalAssignedTasks) * 100 : 0}%` }}
                            title="Completed"
                          ></div>
                          <div 
                            className="bg-yellow-500" 
                            style={{ width: `${employee.totalAssignedTasks > 0 ? (employee.inProgressTasks / employee.totalAssignedTasks) * 100 : 0}%` }}
                            title="In Progress"
                          ></div>
                          <div 
                            className="bg-blue-500" 
                            style={{ width: `${employee.totalAssignedTasks > 0 ? (employee.pendingTasks / employee.totalAssignedTasks) * 100 : 0}%` }}
                            title="Pending"
                          ></div>
                          <div 
                            className="bg-red-500" 
                            style={{ width: `${employee.totalAssignedTasks > 0 ? (employee.overdueTasks / employee.totalAssignedTasks) * 100 : 0}%` }}
                            title="Overdue"
                          ></div>
                        </div>
                        <div className="flex text-xs text-gray-600 justify-between">
                          <span>✓ {employee.completedTasks || 0}</span>
                          <span>↻ {employee.inProgressTasks || 0}</span>
                          <span>⏳ {employee.pendingTasks || 0}</span>
                          <span className={employee.overdueTasks > 0 ? 'text-red-600' : ''}>
                            ⚠ {employee.overdueTasks || 0}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-center">
                        <span className="text-2xl font-bold text-green-600">
                          {employee.completedTasks || 0}
                        </span>
                        <div className="text-xs text-gray-600 mt-1">tasks completed</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 rounded-full h-3 mr-3">
                            <div 
                              className={`h-3 rounded-full ${
                                employee.completionRate >= 80 ? 'bg-green-500' :
                                employee.completionRate >= 60 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(employee.completionRate, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">
                            {employee.completionRate || 0}%
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          {employee.completedTasks || 0} of {employee.totalAssignedTasks || 0} tasks
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-center">
                        <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          getCompletionRateColor(employee.completionRate)
                        }`}>
                          {getPerformanceLabel(employee.completionRate)}
                        </span>
                        <div className="text-xs text-gray-600 mt-1">
                          Rank #{index + 1}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Performance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {stats.employeeStats.reduce((sum, emp) => sum + (emp.totalAssignedTasks || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Assigned Tasks</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {stats.employeeStats.reduce((sum, emp) => sum + (emp.completedTasks || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Completed</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.employeeStats.length > 0 
                  ? Math.round(stats.employeeStats.reduce((sum, emp) => sum + (emp.completionRate || 0), 0) / stats.employeeStats.length)
                  : 0}%
              </div>
              <div className="text-sm text-gray-600">Average Completion Rate</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {stats.employeeStats.reduce((sum, emp) => sum + (emp.overdueTasks || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Overdue Tasks</div>
            </div>
          </div>
        </div>
      )}

      {/* Overdue Tasks Section */}
      {stats.overdueTasksList && stats.overdueTasksList.length > 0 && (
        <div className="bg-white rounded-xl shadow-md border border-red-200 overflow-hidden">
          <div className="bg-red-50 px-6 py-4 border-b border-red-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-red-800 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Overdue Tasks ({stats.overdueTasksList.length})
              </h2>
              <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                Needs Immediate Attention
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-red-100">
              <thead className="bg-red-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">Task Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">Overdue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">Assigned To</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-red-100">
                {stats.overdueTasksList.map(task => {
                  const daysOverdue = calculateDaysOverdue(task.dueDate);
                  return (
                    <tr key={task.id} className="hover:bg-red-50 transition duration-150">
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <div className="font-medium text-gray-900 mb-1">{task.title}</div>
                          {task.description && (
                            <div className="text-sm text-gray-600 truncate" title={task.description}>
                              {task.description}
                            </div>
                          )}
                          <div className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                            {task.status}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {task.project?.name ? (
                          <div className="font-medium">{task.project.name}</div>
                        ) : (
                          <span className="text-gray-500 italic">No project</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {new Date(task.dueDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="text-gray-500">
                            {new Date(task.dueDate).toLocaleDateString('en-US', { weekday: 'long' })}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className={`px-3 py-1.5 text-sm font-bold rounded-full ${
                            daysOverdue > 7 ? 'bg-red-100 text-red-800' :
                            daysOverdue > 3 ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {daysOverdue} day{daysOverdue > 1 ? 's' : ''}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 inline-flex text-sm leading-5 font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority || 'Medium'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {task.assignedUser ? (
                          <div>
                            <div className="font-medium">{task.assignedUser.fullName}</div>
                            <div className="text-sm text-gray-500">{task.assignedUser.email}</div>
                          </div>
                        ) : (
                          <span className="text-gray-500 italic">Unassigned</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Project Completion Rates */}
      {stats.projectCompletionRates && stats.projectCompletionRates.length > 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Project Completion Rates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.projectCompletionRates.map(project => (
              <div key={project.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition duration-200">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-gray-800 truncate" title={project.name}>
                    {project.name}
                  </h3>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    project.completionRate === 100 ? 'bg-green-100 text-green-800' :
                    project.completionRate >= 70 ? 'bg-blue-100 text-blue-800' :
                    project.completionRate >= 40 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {project.completionRate}%
                  </span>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{project.completedTasks} of {project.totalTasks} tasks</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${
                        project.completionRate === 100 ? 'bg-green-500' :
                        project.completionRate >= 70 ? 'bg-blue-500' :
                        project.completionRate >= 40 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${project.completionRate}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-800">{project.totalTasks}</div>
                    <div className="text-sm text-gray-600">Total Tasks</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{project.completedTasks}</div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      project.completionRate === 100 ? 'bg-green-100 text-green-800' :
                      project.completionRate >= 70 ? 'bg-blue-100 text-blue-800' :
                      project.completionRate >= 40 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {project.completionRate === 100 ? 'Completed' :
                       project.completionRate >= 70 ? 'On Track' :
                       project.completionRate >= 40 ? 'In Progress' :
                       'Needs Attention'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty States */}
      {(!stats.overdueTasksList || stats.overdueTasksList.length === 0) && (
        <div className="bg-white border border-green-200 rounded-xl p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2 text-green-800">No Overdue Tasks</h3>
          <p className="text-gray-600">Great! All tasks are up to date.</p>
        </div>
      )}

      {(!stats.employeeStats || stats.employeeStats.length === 0) && (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.223.447-.481.801-.78 1H22l-2.5-3-2.5 3h2.28c-.299-.199-.557-.553-.78-1a7.96 7.96 0 00.78-1H17l2.5 3 2.5-3h-2.28c.299.199.557.553.78 1z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">No Employee Performance Data</h3>
          <p className="text-gray-600 mb-4">Assign tasks to employees to track their performance.</p>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">
            Assign Tasks
          </button>
        </div>
      )}

      {(!stats.projectCompletionRates || stats.projectCompletionRates.length === 0) && (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">No Project Data Available</h3>
          <p className="text-gray-600">Create projects and assign tasks to see completion rates.</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
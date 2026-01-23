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
    return <p>Loading dashboard data...</p>;
  }

  if (!stats) {
    return <p>No dashboard data available</p>;
  }


  const calculateDaysOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">User Role</h2>
        <p>Role: {stats.role}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold">Totals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded">
            <h3 className="font-medium">Projects</h3>
            <p className="text-2xl">{stats.totals?.projects || 0}</p>
          </div>
          <div className="p-4 border rounded">
            <h3 className="font-medium">Tasks</h3>
            <p className="text-2xl">{stats.totals?.tasks || 0}</p>
          </div>
          <div className="p-4 border rounded">
            <h3 className="font-medium">Employees</h3>
            <p className="text-2xl">{stats.totals?.employees || 0}</p>
          </div>
        </div>
      </div>

 
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Task Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="p-4 border rounded">
            <h3 className="font-medium">Today</h3>
            <p>{stats.taskStats?.today || 0}</p>
          </div>
          <div className="p-4 border rounded">
            <h3 className="font-medium">Weekly</h3>
            <p>{stats.taskStats?.weekly || 0}</p>
          </div>
          <div className="p-4 border rounded">
            <h3 className="font-medium">Overdue</h3>
            <p className={`text-lg font-bold ${stats.taskStats?.overdue > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {stats.taskStats?.overdue || 0}
            </p>
          </div>
          <div className="p-4 border rounded">
            <h3 className="font-medium">Pending</h3>
            <p>{stats.taskStats?.pending || 0}</p>
          </div>
          <div className="p-4 border rounded">
            <h3 className="font-medium">On Hold</h3>
            <p>{stats.taskStats?.onHold || 0}</p>
          </div>
          <div className="p-4 border rounded">
            <h3 className="font-medium">In Progress</h3>
            <p>{stats.taskStats?.inProgress || 0}</p>
          </div>
          <div className="p-4 border rounded">
            <h3 className="font-medium">Completed</h3>
            <p>{stats.taskStats?.completed || 0}</p>
          </div>
        </div>
      </div>


      {stats.overdueTasksList && stats.overdueTasksList.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4 text-red-600">
            Overdue Tasks ({stats.overdueTasksList.length})
          </h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-red-200">
                <thead className="bg-red-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">Task</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">Project</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">Due Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">Days Overdue</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">Priority</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">Status</th>
                    {stats.role === 'admin' && (
                      <th className="px-4 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">Assigned To</th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-red-100">
                  {stats.overdueTasksList.map(task => {
                    const daysOverdue = calculateDaysOverdue(task.dueDate);
                    return (
                      <tr key={task.id} className="hover:bg-red-50">
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-gray-900">{task.title}</div>
                          {task.description && (
                            <div className="text-xs text-gray-600 truncate max-w-xs" title={task.description}>
                              {task.description}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium">{task.project?.name}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(task.dueDate).toLocaleDateString('en-US', { weekday: 'long' })}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-bold bg-red-100 text-red-800 rounded-full">
                            {daysOverdue} day{daysOverdue > 1 ? 's' : ''}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            task.priority === 'High' || task.priority === 'high' ? 'bg-red-100 text-red-800' :
                            task.priority === 'Medium' || task.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            task.status === 'In_progress' ? 'bg-yellow-100 text-yellow-800' :
                            task.status === 'Pending' || task.status === 'Todo' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {task.status}
                          </span>
                        </td>
                        {stats.role === 'admin' && task.assignedUser && (
                          <td className="px-4 py-3">
                            <div className="text-sm">
                              <div className="font-medium">{task.assignedUser.fullName}</div>
                              <div className="text-xs text-gray-500">{task.assignedUser.email}</div>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {(!stats.overdueTasksList || stats.overdueTasksList.length === 0) && (
        <div className="mb-6 p-4 border border-green-200 rounded-lg bg-green-50">
          <h2 className="text-lg font-semibold mb-2 text-green-800">Overdue Tasks</h2>
          <div className="flex items-center">
            <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-700">Great! No overdue tasks.</p>
          </div>
        </div>
      )}


      <div className="mb-6">
        <h2 className="text-lg font-semibold">Overall Completion Rate</h2>
        <div className="p-4 border rounded max-w-xs">
          <p className="text-2xl font-bold">
            {stats.totals?.tasks > 0 
              ? `${Math.round((stats.taskStats?.completed / stats.totals.tasks) * 100)}%`
              : '0%'
            }
          </p>
          <p className="text-sm text-gray-600">
            ({stats.taskStats?.completed || 0} of {stats.totals?.tasks || 0} tasks completed)
          </p>
        </div>
      </div>

      {stats.projectCompletionRates && stats.projectCompletionRates.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Project Completion Rates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.projectCompletionRates.map(project => (
              <div key={project.id} className="p-4 border rounded-lg shadow-sm bg-white">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold truncate" title={project.name}>
                    {project.name}
                  </h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">
                      {project.completedTasks} / {project.totalTasks} tasks
                    </span>
                    <span className="text-lg font-bold">
                      {project.completionRate}%
                    </span>
                  </div>
                </div>

      
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Completion</span>
                    <span className="text-xs font-medium">{project.completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        project.completionRate >= 80 ? 'bg-green-500' :
                        project.completionRate >= 50 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(project.completionRate, 100)}%` }}
                    ></div>
                  </div>
                </div>

          
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="font-medium">Total</div>
                    <div className="text-lg">{project.totalTasks}</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="font-medium">Completed</div>
                    <div className="text-lg">{project.completedTasks}</div>
                  </div>
                </div>

              
                <div className="mt-3">
                  <span className={`inline-block px-2 py-1 text-xs rounded ${
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
            ))}
          </div>
        </div>
      )}

   
      {(!stats.projectCompletionRates || stats.projectCompletionRates.length === 0) && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-lg font-semibold mb-2">Project Completion Rates</h2>
          <p className="text-gray-600">No project data available. Create projects and tasks to see completion rates.</p>
        </div>
      )}


      <button 
        onClick={fetchDashboardStats}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
      >
        Refresh Dashboard Data
      </button>
    </div>
  );
};

export default AdminDashboard;
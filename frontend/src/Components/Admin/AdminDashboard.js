import React from 'react'
import styles from './AdminDashboard.module.css'

const AdminDashboard = () => {
  const users = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'User' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Admin' },
    {
      id: 3,
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      role: 'User',
    },
  ]

  const statistics = {
    totalUsers: 150,
    activeReports: 25,
    completedTasks: 200,
  }

  const recentActivity = [
    {
      id: 1,
      activity: 'Alice created a new report',
      timestamp: '2024-12-18 14:30',
    },
    {
      id: 2,
      activity: 'Bob updated his profile',
      timestamp: '2024-12-18 13:20',
    },
    {
      id: 3,
      activity: 'Charlie completed a task',
      timestamp: '2024-12-18 12:45',
    },
  ]

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Admin Dashboard</h1>

      {/* Statistics Section */}
      <div className={styles.statistics}>
        <h2>Statistics Overview</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Total Users</h3>
            <p>{statistics.totalUsers}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Active Reports</h3>
            <p>{statistics.activeReports}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Completed Tasks</h3>
            <p>{statistics.completedTasks}</p>
          </div>
        </div>
      </div>

      {/* User Management Section */}
      <div className={styles.userManagement}>
        <h2>User Management</h2>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button className={styles.editButton}>Edit</button>
                  <button className={styles.deleteButton}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Activity Section */}
      <div className={styles.recentActivity}>
        <h2>Recent Activity</h2>
        <ul>
          {recentActivity.map((activity) => (
            <li key={activity.id}>
              <p>{activity.activity}</p>
              <span>{activity.timestamp}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default AdminDashboard

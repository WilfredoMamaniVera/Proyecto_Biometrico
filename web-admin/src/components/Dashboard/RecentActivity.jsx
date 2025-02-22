import React from 'react';

export const RecentActivity = ({ activities }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <h2 className="text-lg font-semibold mb-4">Actividad Reciente</h2>
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
          <div>
            <p className="font-medium">{activity.user}</p>
            <p className="text-sm text-gray-500">{activity.action}</p>
          </div>
          <span className="text-sm text-gray-500">{activity.time}</span>
        </div>
      ))}
    </div>
  </div>
);
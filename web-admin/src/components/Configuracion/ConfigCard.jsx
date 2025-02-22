import React from 'react';
import { Settings } from 'lucide-react';

export const ConfigCard = ({ title, description, onClick, icon: Icon = Settings }) => (
  <div onClick={onClick} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all">
    <div className="flex items-start gap-3 mb-3">
      <div className="p-2 bg-purple-100 rounded">
        <Icon className="w-6 h-6 text-purple-600" />
      </div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  </div>
);


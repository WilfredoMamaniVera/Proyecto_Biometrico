import React from 'react';

export const ConfigSection = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-lg font-semibold mb-4">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {children}
    </div>
  </div>
);
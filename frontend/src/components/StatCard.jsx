import React from 'react';

const StatCard = ({ label, value, trend, trendType, colorClass, delay }) => {
  return (
    <div className={`stat-c ${colorClass || ''}`} style={{ animationDelay: `${delay}s` }}>
      <div className="stat-label">{label}</div>
      <div className="stat-val">{value}</div>
      <div className="stat-sub">
        <span className={`trend-${trendType === 'up' ? 'up' : trendType === 'down' ? 'dn' : ''}`}>
          {trendType === 'up' ? '↑ ' : trendType === 'down' ? '↓ ' : ''}{trend}
        </span>
      </div>
    </div>
  );
};

export default StatCard;

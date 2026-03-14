import React from 'react';

const OperationCard = ({ label, value, sub, icon, badge, badgeColor, delay, onClick }) => {
  return (
    <div className="op-card" style={{ animationDelay: `${delay}s` }} onClick={onClick}>
      <div className="op-badge"><span className={`badge b-${badgeColor}`}>{badge}</span></div>
      <div style={{ fontSize: '26px', marginBottom: '8px' }}>{icon}</div>
      <div className="op-num">{value}</div>
      <div className="op-label">{label}</div>
      <div className="op-sub">{sub}</div>
    </div>
  );
};

export default OperationCard;

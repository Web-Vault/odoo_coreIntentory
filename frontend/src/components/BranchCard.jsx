import React from 'react';

const BranchCard = ({ name, loc, status, statusColor, capacity, items, value, score, delay }) => {
  return (
    <div className="wh-c" style={{ animationDelay: `${delay}s`, borderTopColor: statusColor === 'red' ? '#B91C1C' : 'var(--caramel)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div>
          <div className="wh-nm">☕ {name}</div>
          <div className="wh-loc">📍 {loc}</div>
        </div>
        <span className={`badge b-${statusColor}`}>{status}</span>
      </div>
      <div className="wh-ms">
        <div className="wh-m"><div className="wh-ml">Capacity</div><div className="wh-mv">{capacity}</div></div>
        <div className="wh-m"><div className="wh-ml">Items</div><div className="wh-mv">{items}</div></div>
        <div className="wh-m"><div className="wh-ml">Stock Value</div><div className="wh-mv" style={{ color: 'var(--matcha-d)' }}>{value}</div></div>
        <div className="wh-m"><div className="wh-ml">AI Score</div><div className="wh-mv" style={{ color: 'var(--caramel)' }}>{score}</div></div>
      </div>
    </div>
  );
};

export default BranchCard;

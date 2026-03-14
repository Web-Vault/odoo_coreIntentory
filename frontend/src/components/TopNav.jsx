import React from 'react';

const TopNav = ({ onToast }) => {
  return (
    <div className="topnav">
      <div className="tn-brand">
        <span style={{ fontSize: '17px' }}>☕</span>
        <span className="tn-logo">BrewIQ</span>
      </div>
      <div className="tn-apps">
        <div className="tn-app">Dashboard</div>
        <div className="tn-app on">Inventory</div>
        <div className="tn-app">Purchase</div>
        <div className="tn-app">Reports</div>
      </div>
      <div className="tn-search">
        <span className="tn-search-ic">🔍</span>
        <input placeholder="Search ingredients, orders, branches..." />
      </div>
      <div className="tn-right">
        <div className="tn-icon" onClick={() => onToast('3 Stock Alerts', 'Arabica, Vanilla Syrup & Oat Milk need attention', 'warn')}>
          🔔<div className="notif-dot"></div>
        </div>
        <div className="tn-icon" onClick={() => onToast('AI Engine Active', 'Demand forecast refreshed — 94.2% accuracy')}>
          🧠
        </div>
        <div className="tn-avatar">AM</div>
      </div>
    </div>
  );
};

export default TopNav;

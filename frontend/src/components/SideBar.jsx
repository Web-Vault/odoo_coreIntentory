import React from 'react';

const SideBar = ({ activePage, onPageChange }) => {
  const sections = [
    {
      label: 'Operations',
      items: [
        { id: 'overview', icon: '📦', label: 'Receipts', badge: '8', badgeColor: 'amber' },
        { id: 'operations', icon: '🚚', label: 'Deliveries', badge: '5', badgeColor: 'amber' },
        { id: 'transfers', icon: '↔️', label: 'Transfers', badge: '3', badgeColor: 'amber' },
        { id: 'adjustments', icon: '⚙️', label: 'Adjustments' },
      ],
    },
    {
      label: 'Ingredients',
      items: [
        { id: 'products', icon: '☕', label: 'All Ingredients' },
        { id: 'low-stock', icon: '⚠️', label: 'Low Stock', badge: '6', badgeColor: 'red' },
        { id: 'expiring', icon: '📅', label: 'Expiring Soon', badge: '4', badgeColor: 'red' },
      ],
    },
    {
      label: 'Branches',
      items: [
        { id: 'branches', icon: '☕', label: 'Mumbai — Bandra' },
        { id: 'branch-pune', icon: '☕', label: 'Pune — Koregaon' },
        { id: 'branch-delhi', icon: '☕', label: 'Delhi — Connaught', badge: '!', badgeColor: 'red' },
      ],
    },
    {
      label: 'AI Features',
      items: [
        { id: 'replenishment', icon: '📈', label: 'Demand Forecast' },
        { id: 'aiassist', icon: '🧠', label: 'Waste Prevention' },
        { id: 'auto-reorder', icon: '🚚', label: 'Auto-Reorder' },
      ],
    },
  ];

  return (
    <div className="sidebar">
      {sections.map((section, idx) => (
        <div key={idx} className="sg-section" style={idx > 0 ? { borderTop: '1px solid var(--border)' } : {}}>
          <div className="sg-label">{section.label}</div>
          {section.items.map((item) => (
            <div
              key={item.id}
              className={`sg-item ${activePage === item.id ? 'on' : ''}`}
              onClick={() => onPageChange(item.id)}
            >
              <span>{item.icon} {item.label}</span>
              {item.badge && <span className={`sg-badge sg-${item.badgeColor}`}>{item.badge}</span>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SideBar;

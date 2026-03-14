import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import TopNav from '../components/TopNav';
import SubBar from '../components/SubBar';
import SideBar from '../components/SideBar';
import StatCard from '../components/StatCard';
import OperationCard from '../components/OperationCard';
import AIAssistant from '../components/AIAssistant';
import ForecastBar from '../components/ForecastBar';
import BranchCard from '../components/BranchCard';
import GlobalNavbar from '../components/GlobalNavbar';

const Dashboard = () => {
  const [activePage, setActivePage] = useState('overview');
  const [toast, setToast] = useState({ show: false, title: '', sub: '', type: '' });
  const [dashboardData, setDashboardData] = useState(null);
  const [recentOps, setRecentOps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productFilter, setProductFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/dashboard');
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        setDashboardData(result);
        setRecentOps(result.recentOperations);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const showToast = (title, sub, type = 'success') => {
    setToast({ show: true, title, sub, type });
    setTimeout(() => setToast({ show: false, title: '', sub: '', type: '' }), 3500);
  };

  const handleAddOp = async () => {
    const newOp = {
      ref: `WH/TR/${Math.floor(Math.random() * 9000) + 1000}`,
      type: 'Internal Transfer',
      type_color: 'blue',
      from_loc: 'Mumbai Main',
      to_loc: 'Pune Branch',
      item: 'Arabica Beans (Batch #442)',
      qty: '120 kg',
      status: 'Ready',
      status_color: 'green',
      date: 'Just now'
    };

    try {
      const response = await fetch('http://localhost:8000/api/operations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOp)
      });
      const result = await response.json();
      
      const formattedOp = {
        ...result,
        from: result.from_loc,
        to: result.to_loc
      };
      setRecentOps([formattedOp, ...recentOps.slice(0, 4)]);
      showToast('Operation Created', `${newOp.ref} has been logged in the system.`);
    } catch (error) {
      console.error('Error creating operation:', error);
      showToast('Error', 'Could not save operation to database', 'error');
    }
  };

  if (loading) {
    return (
      <div className="shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--espresso)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '20px', animation: 'float 3s ease-in-out infinite' }}>☕</div>
          <div style={{ color: 'var(--latte)', fontSize: '20px', fontWeight: '800', fontFamily: 'Playfair Display, serif' }}>Brewing your intelligence...</div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--espresso)' }}>
        <div style={{ textAlign: 'center', color: 'var(--latte)' }}>
          <div style={{ fontSize: '40px', marginBottom: '20px' }}>⚠️</div>
          <div style={{ fontSize: '20px', fontWeight: '800' }}>Could not connect to backend.</div>
          <p style={{ opacity: 0.7, marginTop: '10px' }}>Make sure your FastAPI server is running on http://localhost:8000</p>
          <button className="tb-btn primary" style={{ marginTop: '20px' }} onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  // Filter products based on selected filter and search query
  const filteredProducts = dashboardData.products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (productFilter === 'low-stock') return matchesSearch && (p.statusColor === 'red' || p.status === 'Low');
    if (productFilter === 'expiring') return matchesSearch && p.status === 'Expiring';
    if (productFilter === 'branch-pune') return matchesSearch && p.branch === 'Pune';
    if (productFilter === 'branch-delhi') return matchesSearch && p.branch === 'Delhi';
    if (productFilter === 'branches') return matchesSearch && p.branch === 'Mumbai';
    if (productFilter === 'auto-reorder') return matchesSearch && (p.rule === 'Min-Max' || p.rule === 'Urgent');
    
    return matchesSearch;
  });

  return (
    <div className="shell" style={{ position: 'relative', paddingTop: '64px' }}>
      <GlobalNavbar />
      {toast.show && (
        <div id="toast" className={`toast ${toast.type}`}>
          <div className="toast-title">{toast.title}</div>
          <div className="toast-sub">{toast.sub}</div>
        </div>
      )}

      <SubBar activePage={activePage} onPageChange={setActivePage} onToast={showToast} />

      <div className="body">
        <SideBar activePage={activePage} onPageChange={setActivePage} dashboardData={dashboardData} />

        <div className="main">
          {['overview', 'products', 'operations', 'replenishment', 'branches', 'aiassist', 'low-stock', 'expiring', 'branch-pune', 'branch-delhi', 'auto-reorder'].includes(activePage) && (
            <div className="pg">
              <div className="toolbar">
                <div className="breadcrumb">
                  <span>Inventory</span><span className="bc-sep">/</span><span className="bc-active">
                    {activePage === 'overview' && 'Overview'}
                    {activePage === 'products' && 'All Ingredients'}
                    {activePage === 'low-stock' && 'Low Stock Alert'}
                    {activePage === 'expiring' && 'Expiring Soon'}
                    {activePage === 'branches' && 'Mumbai Branch'}
                    {activePage === 'branch-pune' && 'Pune Branch'}
                    {activePage === 'branch-delhi' && 'Delhi Branch'}
                    {activePage === 'operations' && 'Operations'}
                    {activePage === 'replenishment' && 'Demand Forecast'}
                    {activePage === 'aiassist' && 'Waste Prevention'}
                    {activePage === 'auto-reorder' && 'Auto-Reorder Queue'}
                  </span>
                </div>
                <div className="tb-gap"></div>
                
                {/* Search and Filters - Visible on most ingredient-related pages */}
                {['products', 'low-stock', 'expiring', 'branches', 'branch-pune', 'branch-delhi', 'auto-reorder'].includes(activePage) && (
                  <>
                    <input 
                      type="text" 
                      className="search-input" 
                      placeholder="Search..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ 
                        padding: '8px 12px', 
                        borderRadius: '8px', 
                        border: '1px solid var(--border)', 
                        marginRight: '12px',
                        fontSize: '12px',
                        background: 'var(--card)',
                        color: 'var(--text)'
                      }}
                    />
                    <div 
                      className={`filter-chip ${productFilter === 'low-stock' || activePage === 'low-stock' ? 'on' : ''}`}
                      onClick={() => {
                        if (activePage !== 'low-stock') setProductFilter(productFilter === 'low-stock' ? 'all' : 'low-stock');
                      }}
                    >
                      Low Stock {(productFilter === 'low-stock' || activePage === 'low-stock') ? '✕' : ''}
                    </div>
                  </>
                )}

                {activePage === 'overview' && (
                  <>
                    <div className="view-toggle">
                      <div className={`vt-btn ${viewMode === 'grid' ? 'on' : ''}`} onClick={() => setViewMode('grid')}>■■</div>
                      <div className={`vt-btn ${viewMode === 'list' ? 'on' : ''}`} onClick={() => setViewMode('list')}>☰</div>
                    </div>
                    <div className="tb-btn primary" onClick={handleAddOp}>+ New Transfer</div>
                  </>
                )}

                {['products', 'low-stock', 'expiring', 'branches', 'branch-pune', 'branch-delhi'].includes(activePage) && (
                  <div className="tb-btn primary" onClick={() => showToast('New Ingredient', 'Create ingredient form opened')}>+ New</div>
                )}
              </div>

              {/* OVERVIEW CONTENT */}
              {activePage === 'overview' && (
                <>
                  {viewMode === 'grid' ? (
                    <div className="op-grid" style={{ marginBottom: '24px' }}>
                      {dashboardData.operations.map((op, idx) => (
                        <OperationCard
                          key={op.id}
                          label={op.label}
                          value={op.value}
                          sub={op.sub}
                          badge={op.badge}
                          badgeColor={op.badgeColor}
                          delay={idx * 0.03}
                          icon={['📦', '🚚', '↔️', '✓', '♻️', '⚠️'][idx]}
                          onClick={() => showToast(op.label, op.sub)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="table-wrap" style={{ marginBottom: '24px' }}>
                      <table>
                        <thead>
                          <tr>
                            <th>Operation</th>
                            <th>Sub</th>
                            <th>Status</th>
                            <th>Count</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboardData.operations.map((op, idx) => (
                            <tr key={op.id}>
                              <td className="bold">{op.label}</td>
                              <td>{op.sub}</td>
                              <td><span className={`badge b-${op.badgeColor}`}>{op.badge}</span></td>
                              <td className="bold">{op.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="stat-row">
                    {dashboardData.stats.map((stat, idx) => (
                      <StatCard
                        key={stat.id}
                        label={stat.label}
                        value={stat.value}
                        trend={stat.trend}
                        trendType={stat.trendType}
                        delay={idx * 0.05}
                      />
                    ))}
                  </div>

                  <div className="table-wrap">
                    <div className="tbl-header">
                      <div className="tbl-title">Recent Internal Operations</div>
                      <div className="tb-btn" onClick={() => showToast('Refreshed', 'Database re-synced')}>↻ Sync</div>
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th>Ref</th>
                          <th>Type</th>
                          <th>From</th>
                          <th>To</th>
                          <th>Ingredient</th>
                          <th>Qty</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOps.map((op, idx) => (
                          <tr key={idx} style={{ animation: 'fadeUp .4s ease both', animationDelay: `${idx * 0.05}s` }}>
                            <td className="bold">{op.ref}</td>
                            <td><span className={`badge b-${op.typeColor}`}>{op.type}</span></td>
                            <td>{op.from}</td>
                            <td>{op.to}</td>
                            <td className="bold">{op.item}</td>
                            <td>{op.qty}</td>
                            <td><span className={`badge b-${op.statusColor}`}>{op.status}</span></td>
                            <td style={{ color: 'var(--text3)', fontSize: '11px' }}>{op.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* INGREDIENT LIST CONTENT (REUSED FOR MULTIPLE TABS) */}
              {['products', 'low-stock', 'expiring', 'branches', 'branch-pune', 'branch-delhi', 'auto-reorder'].includes(activePage) && (
                <div className="table-wrap" style={{ marginTop: '14px' }}>
                  <table>
                    <thead>
                      <tr>
                        <th><input type="checkbox" /></th>
                        <th>SKU</th>
                        <th>Ingredient</th>
                        <th>Category</th>
                        <th>Branch</th>
                        <th>On Hand</th>
                        <th>Forecasted</th>
                        <th>Reorder Rule</th>
                        <th>Unit Price</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.products
                        .filter(p => {
                          const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                                p.sku.toLowerCase().includes(searchQuery.toLowerCase());
                          
                          if (activePage === 'low-stock' || productFilter === 'low-stock') return matchesSearch && (p.statusColor === 'red' || p.status === 'Low' || p.status === 'Critical');
                          if (activePage === 'expiring' || productFilter === 'expiring') return matchesSearch && p.status === 'Expiring';
                          if (activePage === 'branches' || productFilter === 'branches') return matchesSearch && p.branch === 'Mumbai';
                          if (activePage === 'branch-pune' || productFilter === 'branch-pune') return matchesSearch && p.branch === 'Pune';
                          if (activePage === 'branch-delhi' || productFilter === 'branch-delhi') return matchesSearch && p.branch === 'Delhi';
                          if (activePage === 'auto-reorder' || productFilter === 'auto-reorder') return matchesSearch && (p.rule === 'Min-Max' || p.rule === 'Urgent');
                          
                          return matchesSearch;
                        })
                        .map((p, idx) => (
                          <tr key={idx}>
                            <td><input type="checkbox" /></td>
                            <td style={{ color: 'var(--caramel)', fontWeight: '700', fontSize: '10px', fontFamily: 'monospace' }}>{p.sku}</td>
                            <td className="bold" style={{ color: 'var(--sky-d)', cursor: 'pointer' }} onClick={() => showToast(p.name, p.sku)}>
                              {(p.statusColor === 'red' || p.status === 'Low' || p.status === 'Critical') && <span className="blink-alert" style={{ marginRight: '6px' }}>⚠️</span>}
                              {p.name}
                            </td>
                            <td><span className={`badge b-${p.categoryColor}`}>{p.category}</span></td>
                            <td>{p.branch}</td>
                            <td>
                              <div className="prog-wrap">
                                <div className="prog-bg">
                                  <div className="prog-f" style={{ '--w': `${p.progress}%`, background: p.progress < 25 ? '#C0392B' : 'var(--matcha)' }}></div>
                                </div>
                                <span style={{ color: p.progress < 25 ? '#B91C1C' : 'var(--matcha-d)', fontSize: '11px', fontWeight: '700', minWidth: '40px' }}>
                                  {p.onHand} {p.unit}
                                </span>
                              </div>
                            </td>
                            <td style={{ color: p.forecast < 0 ? '#B91C1C' : 'var(--matcha-d)' }}>{p.forecast > 0 ? '+' : ''}{p.forecast} {p.unit}</td>
                            <td><span className={`badge b-${p.statusColor === 'red' ? 'red' : 'green'}`}>{p.rule}</span></td>
                            <td>{p.price}</td>
                            <td><span className={`badge b-${p.statusColor}`}>{p.status}</span></td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* OTHER FEATURE CONTENT */}
              {activePage === 'operations' && (
                <div className="kanban-wrap">
                  {dashboardData.operations.map((op, idx) => (
                    <div key={op.id} className="kcard" style={{ animationDelay: `${idx * 0.04}s` }} onClick={() => showToast(op.label, op.sub)}>
                      <div style={{ fontSize: '26px', marginBottom: '8px' }}>{['📦', '🚚', '↔️', '📋', '✓', '♻️'][idx]}</div>
                      <div className="kcard-title">{op.label}</div>
                      <div className="kcard-sub">{op.sub}</div>
                      <div className="kcard-count">{op.value}</div>
                      <div style={{ fontSize: '10px', color: 'var(--cinnamon)', fontWeight: '600' }}>● {Math.floor(op.value/2)} urgent</div>
                    </div>
                  ))}
                </div>
              )}

              {activePage === 'replenishment' && (
                <>
                  <div style={{ padding: '14px 20px 6px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text3)', fontWeight: '600', marginBottom: '8px' }}>7-day demand forecast (click bars for details)</div>
                    <ForecastBar forecast={dashboardData.forecast} onToast={showToast} />
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th><input type="checkbox" defaultChecked /></th>
                          <th>Ingredient</th>
                          <th>Branch</th>
                          <th>On Hand</th>
                          <th>Min Qty</th>
                          <th>To Order</th>
                          <th>Supplier</th>
                          <th>Lead Time</th>
                          <th>Est. Cost</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.products.slice(0, 4).map((p, idx) => (
                          <tr key={idx}>
                            <td><input type="checkbox" defaultChecked /></td>
                            <td className="bold" style={{ color: p.statusColor === 'red' ? '#B91C1C' : 'var(--cinnamon)' }}>
                              {p.statusColor === 'red' ? '⚠️' : '●'} {p.name}
                            </td>
                            <td>{p.branch}</td>
                            <td style={{ color: p.statusColor === 'red' ? '#B91C1C' : 'var(--cinnamon)' }}>{p.onHand} {p.unit}</td>
                            <td>{Math.ceil(p.onHand * 2)} {p.unit}</td>
                            <td style={{ color: 'var(--sky-d)', fontWeight: '700' }}>{Math.ceil(p.onHand * 5)} {p.unit}</td>
                            <td>Supplier Co.</td>
                            <td>{idx + 1} days</td>
                            <td className="bold">₹{Math.floor(Math.random() * 10000 + 2000)}</td>
                            <td>
                              <span className={`badge b-${p.statusColor === 'red' ? 'green' : 'amber'}`} style={{ cursor: 'pointer' }} onClick={() => showToast('PO Sent!', `Order for ${p.name} sent`)}>
                                ✓ Order
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {activePage === 'aiassist' && (
                <AIAssistant 
                  replies={dashboardData.aiReplies.reduce((acc, curr) => {
                    acc[curr.question] = curr.reply;
                    return acc;
                  }, {})} 
                  defaultReply="Based on current inventory data, I can analyze stock levels, predict demand and suggest reorder actions across all 3 branches." 
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

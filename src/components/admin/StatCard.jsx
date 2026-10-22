export default function StatCard({ icon: Icon, value, label, sub }) {
  return (
    <div className="stat-card">
      <div className="stat-icon-wrapper">
        <Icon size={24} />
      </div>
      <div className="stat-info">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {sub && <div className="stat-sub">{sub}</div>}
      </div>
    </div>
  );
}

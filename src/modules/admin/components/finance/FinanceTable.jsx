import React from 'react';
import { formatINR } from '../../data/financeData';

// Reuses the app's existing .data-table / .badge-pill / .avatar-chip /
// .icon-action classes (see Students.jsx) instead of a bespoke Finance
// table style, and centralizes column rendering so every finance page
// doesn't repeat the same <table> markup.
//
// columns: [{ key, label, type: 'text' | 'currency' | 'status' | 'name' }]
// actions: optional (row) => ReactNode, rendered in a trailing Actions column

const STATUS_CLASS = {
  Paid: 'badge-paid',
  Pending: 'badge-pending',
  Overdue: 'badge-unpaid',
};

function initials(name) {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

export default function FinanceTable({ columns, rows, actions, actionsLabel = 'Actions', emptyMessage = 'No records found.', getRowId }) {
  const colCount = columns.length + (actions ? 1 : 0);

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((c) => <th key={c.key}>{c.label}</th>)}
            {actions && <th>{actionsLabel}</th>}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={colCount} style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>{emptyMessage}</td></tr>
          )}
          {rows.map((row) => (
            <tr key={getRowId ? getRowId(row) : row.id}>
              {columns.map((c) => {
                const value = row[c.key];
                if (c.type === 'currency') return <td key={c.key}>{formatINR(value)}</td>;
                if (c.type === 'status') return <td key={c.key}><span className={`badge-pill ${STATUS_CLASS[value] || 'badge-pending'}`}>{value}</span></td>;
                if (c.type === 'name') {
                  return (
                    <td key={c.key}>
                      <div className="d-flex align-center gap-2">
                        <div className="avatar-chip">{initials(value)}</div>
                        {value}
                      </div>
                    </td>
                  );
                }
                return <td key={c.key}>{value}</td>;
              })}
              {actions && <td><div className="d-flex gap-2">{actions(row)}</div></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import React from 'react';
import { useToast } from '../../components/ToastContext';
import StaffSection from '../../components/teachers/StaffSection';
import { OTHER_ROLES, makeNonTeachingStaff } from '../../data/staffData';

export default function NonTeachingStaff() {
  const showToast = useToast();

  function handleExport(type) {
    showToast(`Preparing staff report (${type})…`, type === 'PDF' ? 'ti-file-type-pdf' : 'ti-file-spreadsheet');
  }

  return (
    <div>
      <div className="d-flex align-center justify-between flex-wrap gap-3 mb-4">
        <div className="fin-tab-note">Manage non-teaching staff, attendance and salary by academic year</div>
        <div className="d-flex gap-2">
          <button onClick={() => handleExport('PDF')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', background: 'var(--red-light)', color: 'var(--red)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 16px', fontSize: 13, fontWeight: 600 }}>
            <i className="ti ti-file-type-pdf"></i>PDF
          </button>
          <button onClick={() => handleExport('Excel')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', background: 'var(--green-light)', color: 'var(--green)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 16px', fontSize: 13, fontWeight: 600 }}>
            <i className="ti ti-file-spreadsheet"></i>Excel
          </button>
        </div>
      </div>

      <StaffSection
        staffType="other"
        idPrefix="S"
        roleOptions={OTHER_ROLES}
        roleFieldLabel="Role"
        makeStaff={makeNonTeachingStaff}
        singular="Staff Member"
        plural="staff"
        addButtonLabel="Add staff"
        searchPlaceholder="Search by ID, name or mobile…"
        // designationOptions={OTHER_ROLES}
      />
    </div>
  );
}

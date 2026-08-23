// Mock data source for the Leave Applications page.
// Every staff member has one unique Staff ID, reused consistently across
// their leave applications instead of a separate ID per application row.

export const LEAVE_TYPES = ['Sick Leave', 'Casual Leave', 'Earned Leave', 'Maternity/Paternity Leave', 'Unpaid Leave'];

export const TODAY = new Date('2024-07-10');

export function formatDateDMY(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  const dd = String(d.getDate()).padStart(2, '0');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${dd} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function daysBetween(from, to) {
  const a = new Date(from);
  const b = new Date(to);
  return Math.max(1, Math.round((b - a) / 86400000) + 1);
}

export function makeAllStaff() {
  return [
    { id: 'STF-001', name: 'Mrs. Anjali Nair', role: 'Teacher', department: 'Hindi' },
    { id: 'STF-002', name: 'Mr. Suresh Iyer', role: 'Teacher', department: 'General Knowledge' },
    { id: 'STF-003', name: 'Mrs. Kavita Rao', role: 'Teacher', department: 'Science' },
    { id: 'STF-004', name: 'Mr. Rajesh Kumar', role: 'Teacher', department: 'Social Science' },
    { id: 'STF-005', name: 'Ms. Meera Rao', role: 'Librarian', department: 'Library' },
    { id: 'STF-006', name: 'Mr. Vikram Desai', role: 'Admin Staff', department: 'Administration' },
  ];
}

export function makeLeaveApplications(staff) {
  const seed = [
    { staffId: staff[0]?.id, leaveType: 'Sick Leave', from: '2024-07-02', to: '2024-07-03', reason: 'Fever and viral infection', status: 'Approved', appliedOn: '2024-07-01' },
    { staffId: staff[1]?.id, leaveType: 'Casual Leave', from: '2024-07-08', to: '2024-07-08', reason: 'Personal work', status: 'Pending', appliedOn: '2024-07-06' },
    { staffId: staff[2]?.id, leaveType: 'Earned Leave', from: '2024-07-15', to: '2024-07-19', reason: 'Family function out of town', status: 'Pending', appliedOn: '2024-07-05' },
    { staffId: staff[3]?.id, leaveType: 'Casual Leave', from: '2024-06-28', to: '2024-06-28', reason: 'Medical appointment', status: 'Rejected', appliedOn: '2024-06-25' },
    { staffId: staff[4]?.id, leaveType: 'Unpaid Leave', from: '2024-07-22', to: '2024-07-24', reason: 'Personal travel', status: 'Approved', appliedOn: '2024-07-10' },
    { staffId: staff[5]?.id, leaveType: 'Sick Leave', from: '2024-07-09', to: '2024-07-09', reason: 'Not feeling well', status: 'Pending', appliedOn: '2024-07-09' },
  ];

  return seed
    .filter((s) => s.staffId)
    .map((s, i) => {
      const member = staff.find((m) => m.id === s.staffId);
      return {
        id: 'LV-' + String(i + 1).padStart(3, '0'),
        staffId: s.staffId,
        name: member?.name || '—',
        role: member?.role || '—',
        leaveType: s.leaveType,
        from: s.from,
        to: s.to,
        days: daysBetween(s.from, s.to),
        reason: s.reason,
        status: s.status,
        appliedOn: s.appliedOn,
      };
    });
}

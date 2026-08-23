import React from 'react';
import { useParams } from 'react-router-dom';
import FinanceOverview from './finance/FinanceOverview';
import StudentFees from './finance/StudentFees';
import TeacherSalary from './finance/TeacherSalary';
import NonTeachingSalary from './finance/NonTeachingSalary';
import Expenses from './finance/Expenses';
import Reports from './finance/Reports';

const SECTIONS = [
  { key: 'overview', label: 'Overview', icon: 'ti-layout-dashboard', Component: FinanceOverview },
  { key: 'students', label: 'Student Fees', icon: 'ti-cash', Component: StudentFees },
  { key: 'teachers', label: 'Teacher Salary', icon: 'ti-user-check', Component: TeacherSalary },
  { key: 'nonteaching', label: 'Non-Teaching', icon: 'ti-users', Component: NonTeachingSalary },
  { key: 'expenses', label: 'Expenses', icon: 'ti-receipt', Component: Expenses },
  { key: 'reports', label: 'Reports', icon: 'ti-chart-bar', Component: Reports },
];

export default function Finance() {
  const { section: active = 'overview' } = useParams();
  const section = SECTIONS.find((s) => s.key === active) || SECTIONS[0];
  const ActiveComponent = section.Component;

  return (
    <div>
      <div className="page-title mb-4">
        <h1>Finance</h1>
        <p>Fee collection, salaries, expenses and financial overview</p>
      </div>

      <ActiveComponent />
    </div>
  );
}

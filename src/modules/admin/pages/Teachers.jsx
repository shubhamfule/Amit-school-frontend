import React from 'react';
import { useParams } from 'react-router-dom';
import TeachingStaff from './teachers/TeachingStaff';
import NonTeachingStaff from './teachers/NonTeachingStaff';
import LeaveApplications from './teachers/LeaveApplications';

const SECTIONS = [
  { key: 'teaching', label: 'Teacher', icon: 'ti-user-check', Component: TeachingStaff },
  { key: 'non-teaching', label: 'Non-Teaching', icon: 'ti-users', Component: NonTeachingStaff },
  { key: 'leave', label: 'Leave Applications', icon: 'ti-calendar-off', Component: LeaveApplications },
];

export default function Teachers() {
  const { section: active = 'teaching' } = useParams();
  const section = SECTIONS.find((s) => s.key === active) || SECTIONS[0];
  const ActiveComponent = section.Component;

  return (
    <div>
      <div className="page-title mb-4">
        <h1>Teachers</h1>
        {/* <p>Manage faculty, attendance and salary by academic year</p> */}
      </div>

      <ActiveComponent />
    </div>
  );
}

import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>نظام المرور</h3>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
          <i className="fas fa-home"></i>
          <span>لوحة التحكم</span>
        </NavLink>
        <NavLink to="/register-vehicle" className={({ isActive }) => isActive ? 'active' : ''}>
          <i className="fas fa-car"></i>
          <span>تسجيل مركبة</span>
        </NavLink>
        <NavLink to="/new-violation" className={({ isActive }) => isActive ? 'active' : ''}>
          <i className="fas fa-exclamation-triangle"></i>
          <span>مخالفة جديدة</span>
        </NavLink>
        <NavLink to="/violations" className={({ isActive }) => isActive ? 'active' : ''}>
          <i className="fas fa-list"></i>
          <span>قائمة المخالفات</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;

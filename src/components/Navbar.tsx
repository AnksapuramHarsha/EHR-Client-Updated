import React from 'react';
import { Bell, LayoutDashboard, FileText, CalendarCheck2, Settings } from 'lucide-react';
import SirobiltImage from '../images/sirobilt.png'
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
        <div className="navbar bg-base-100 shadow-md px-4 min-h-12 h-14">
            <div className="navbar-start">
                <img src={SirobiltImage} alt="sirobilt logo" className="h-10 mr-2" />
                <span className="text-lg font-bold">SIROBILT</span>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 text-sm">
                    <li>
                        <Link to="/dashboard" className="flex items-center gap-1">
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to ="/health-records" className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />Health Records
                        </Link>
                    </li>
                    <li>
                        <Link to="/appointmentlist">
                            <CalendarCheck2 className="w-4 h-4" />Appointments
                        </Link>
                        </li>
                    <li>
                        <Link to="/masterdata" className="flex items-center gap-1">
                            <Settings className="w-4 h-4" />Master Data
                        </Link>
                    </li>
                    <li><a><FileText className="w-4 h-4" />Reports</a></li>
                </ul>
            </div>
            <div className="navbar-end gap-4">
                <button className="btn btn-ghost btn-circle">
                    <Bell className="h-5 w-5" />
                </button>
                <div className="flex flex-col items-end text-sm">
                    <span className="font-semibold">Admin</span>
                    <span className="text-gray-500 text-xs">Hyderabad, India</span>
                </div>
                <div className="avatar">
                    <div className="w-10 rounded-full bg-base-200 flex items-center justify-center">
                        <span className="text-xl">👤</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;

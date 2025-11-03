import React from "react";
import {
  Car,
  Users,
  CalendarCheck,
  LayoutDashboard,
  Globe,
    Wallet,
} from "lucide-react";
import { clearUser } from "../../../Store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Store/store";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const dispatch = useDispatch();
  const role = useSelector((state: RootState) => state.user.role); // 🔹 Get role from Redux

  const handleLogout = () => {
    dispatch(clearUser());
    localStorage.removeItem("activeSection");
    window.location.href = "/signin";
  };

  // 🔹 Conditionally build menu based on role
  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    ...(role === "developer"
      ? [{ id: "AddEstimation", icon: CalendarCheck, label: "Add Estimation" }]
      : []),
    ...(role === "admin"
      ? [
          { id: "AllEstimationForAdmin", icon: CalendarCheck, label: "All Estimation" },
          { id: "users", icon: Users, label: "Users" },
        ]
      : []),
          ...(role === "accountant"
      ? [{ id: "PaymentRequests", icon: Wallet, label: "Payment Requests" }]
      : []),

  ];

  return (
    <div
      style={{
        width: "256px",
        backgroundColor: "#111827",
        minHeight: "100vh",
        padding: "16px",
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "32px",
        }}
      >
        <Car style={{ width: "32px", height: "32px", color: "#fff" }} />
        <h1 style={{ color: "#fff", fontSize: "20px", fontWeight: "bold", marginLeft: "8px" }}>
          CarAdmin
        </h1>
      </div>

      {/* Menu */}
      <nav>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "8px",
                cursor: "pointer",
                color: activeSection === item.id ? "#fff" : "#D1D5DB",
                backgroundColor: activeSection === item.id ? "#2563EB" : "transparent",
                border: "none",
                width: "100%",
                textAlign: "left",
              }}
            >
              <Icon style={{ width: "20px", height: "20px", marginRight: "12px" }} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "12px",
          borderRadius: "8px",
          marginTop: "auto",
          cursor: "pointer",
          color: "#D1D5DB",
          backgroundColor: "transparent",
          border: "none",
          width: "100%",
          textAlign: "left",
        }}
      >
        <Globe style={{ width: "20px", height: "20px", marginRight: "12px" }} />
        LOGOUT
      </button>
    </div>
  );
}

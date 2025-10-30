import React, { useState } from "react";
import {
  Car,
  Users,
  ClipboardCheck,
  Clock,
  DollarSign,
} from "lucide-react";

// Skeleton component for a single card
const SkeletonCard = () => (
  <div style={{
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "16px",
    display: "flex",
    alignItems: "center",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    marginBottom: "16px",
    animation: "pulse 1.5s infinite"
  }}>
    <div style={{
      backgroundColor: "#e2e8f0",
      borderRadius: "50%",
      width: "48px",
      height: "48px",
      marginRight: "16px"
    }}></div>
    <div>
      <div style={{ height: "16px", backgroundColor: "#e2e8f0", width: "96px", marginBottom: "8px", borderRadius: "4px" }}></div>
      <div style={{ height: "24px", backgroundColor: "#cbd5e1", width: "128px", borderRadius: "4px" }}></div>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState([
    { icon: Car, label: "Total Cars", value: null, color: "#3B82F6" },
    { icon: Users, label: "Active Users", value: null, color: "#10B981" },
    { icon: ClipboardCheck, label: "Pending Inspections", value: null, color: "#F59E0B" },
    { icon: Clock, label: "Pending Test Drives", value: null, color: "#EF4444" },
    { icon: DollarSign, label: "Total Revenue", value: null, color: "#6366F1" },
  ]);

  const [loading, setLoading] = useState(true);

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "24px"
    }}>
      {loading
        ? stats.map((_, index) => <SkeletonCard key={index} />)
        : stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "16px",
                display: "flex",
                alignItems: "center",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
              }}>
                <div style={{
                  backgroundColor: stat.color,
                  padding: "12px",
                  borderRadius: "50%",
                  color: "#fff",
                  marginRight: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Icon style={{ width: "24px", height: "24px" }} />
                </div>
                <div>
                  <p style={{ color: "#6B7280", fontSize: "14px", margin: 0 }}>{stat.label}</p>
                  <p style={{ fontSize: "24px", fontWeight: "600", margin: 0, display: "flex", alignItems: "center", height: "32px" }}>
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
    </div>
  );
}
//hello world
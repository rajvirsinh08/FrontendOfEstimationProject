import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Dashboard from "./AdminDashboard";
import UserList from "./UserList";
import AddEstimation from "./AddEstimation";
import AllEstimationForAdmin from "./AllEstimationForAdmin";
import { useSelector } from "react-redux";
import { RootState } from "../../../Store/store";
import PaymentRequests from "./PaymentRequests";

function HomePage() {
  const [activeSection, setActiveSection] = useState<string>(
    localStorage.getItem("activeSection") || "dashboard"
  );
  const role = useSelector((state: RootState) => state.user.role);
  const [error, setError] = useState("");

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    localStorage.setItem("activeSection", section);
  };

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      display: "flex",
      minHeight: "100vh",
      backgroundColor: "#f3f4f6",
    },
    main: {
      flex: 1,
      padding: "32px",
      overflowY: "auto",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "32px",
    },
    pageTitle: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#1f2937",
      textTransform: "capitalize",
    },
    errorText: {
      color: "red",
      marginBottom: "16px",
    },
  };

  return (
    <div style={styles.container}>
      <Sidebar activeSection={activeSection} onSectionChange={handleSectionChange} />

      <main style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>{activeSection}</h1>
        </div>

        {error && <p style={styles.errorText}>{error}</p>}

        {activeSection === "dashboard" && <Dashboard />}

        {/* 🔹 Developer-only */}
        {activeSection === "AddEstimation" && role === "developer" && <AddEstimation />}

        {/* 🔹 Admin-only */}
        {activeSection === "AllEstimationForAdmin" && role === "admin" && (
          <AllEstimationForAdmin />
        )}

        {/* 🔹 Admin-only */}
        {activeSection === "users" && role === "admin" && <UserList />}

        {/* Accountant-only */}
                {activeSection === "PaymentRequests"  && role === "accountant" && <PaymentRequests />}

      </main>
    </div>
  );
}

export default HomePage;

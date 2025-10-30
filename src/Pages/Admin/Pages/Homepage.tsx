// import React, { useEffect, useState } from "react";
// import Sidebar from "./Sidebar";
// import Dashboard from "./AdminDashboard";
// import UserList from "./UserList";
// import TestDriveList from "./AddEstimation";
// import AddEstimation from "./AddEstimation";
// import AllEstimationForAdmin from "./AllEstimationForAdmin";

// function HomePage() {
//   const [activeSection, setActiveSection] = useState<string>(
//     localStorage.getItem("activeSection") || "dashboard"
//   );
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [isModalOpen, setModalOpen] = useState(false);

//   useEffect(() => {
//     localStorage.setItem("activeSection", activeSection);
//   }, [activeSection]);

//   const handleSectionChange = (section: string) => {
//     setActiveSection(section);
//   };

//   // ==== Internal CSS styles ====
//   const styles: { [key: string]: React.CSSProperties } = {
//     container: {
//       display: "flex",
//       minHeight: "100vh",
//       backgroundColor: "#f3f4f6",
//     },
//     sidebarContainer: {
//       position: "sticky",
//       top: 0,
//       overflowY: "hidden", // prevent scrollbar
//     },
//     main: {
//       flex: 1,
//       padding: "32px",
//       overflowY: "auto",
//     },
//     header: {
//       display: "flex",
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",
//       marginBottom: "32px",
//       flexWrap: "wrap",
//       gap: "16px",
//     },
//     pageTitle: {
//       fontSize: "24px",
//       fontWeight: "bold",
//       color: "#1f2937",
//       textTransform: "capitalize",
//     },
//     addButton: {
//       padding: "8px 16px",
//       backgroundColor: "#f97316",
//       color: "#ffffff",
//       borderRadius: "8px",
//       border: "none",
//       cursor: "pointer",
//       transition: "background-color 0.2s ease",
//     },
//     addButtonHover: {
//       backgroundColor: "#ea580c",
//     },
//     modalOverlay: {
//       position: "fixed",
//       inset: 0,
//       backgroundColor: "rgba(0,0,0,0.5)",
//       backdropFilter: "blur(4px)",
//       zIndex: 50,
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       padding: "16px",
//     },
//     modalContent: {
//       backgroundColor: "#ffffff",
//       padding: "24px",
//       borderRadius: "16px",
//       boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//       width: "100%",
//       maxWidth: "480px",
//       position: "relative",
//     },
//     modalClose: {
//       position: "absolute",
//       top: "8px",
//       right: "8px",
//       fontSize: "24px",
//       fontWeight: "bold",
//       color: "#6b7280",
//       border: "none",
//       background: "none",
//       cursor: "pointer",
//     },
//     errorText: {
//       color: "red",
//       marginBottom: "16px",
//     },
//   };

//   return (
//     <div style={styles.container}>
//       {/* Sidebar */}
//       <div style={styles.sidebarContainer}>
//         <Sidebar activeSection={activeSection} onSectionChange={handleSectionChange} />
//       </div>

//       {/* Main Content */}
//       <main style={styles.main}>
//         <div style={styles.header}>
//           <h1 style={styles.pageTitle}>{activeSection}</h1>
//         </div>

//         {error && <p style={styles.errorText}>{error}</p>}

//         {activeSection === "dashboard" && <Dashboard />}
//         {activeSection === "users" && <UserList />}
//         {activeSection === "AddEstimation" && <AddEstimation />}
//         {activeSection === "AllEstimationForAdmin" && <AllEstimationForAdmin />}

//         {isModalOpen && (
//           <div style={styles.modalOverlay}>
//             <div style={styles.modalContent}>
//               <button style={styles.modalClose} onClick={() => setModalOpen(false)}>
//                 &times;
//               </button>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// export default HomePage;
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Dashboard from "./AdminDashboard";
import UserList from "./UserList";
import AddEstimation from "./AddEstimation";
import AllEstimationForAdmin from "./AllEstimationForAdmin";
import { useSelector } from "react-redux";
import { RootState } from "../../../Store/store";

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
      </main>
    </div>
  );
}

export default HomePage;

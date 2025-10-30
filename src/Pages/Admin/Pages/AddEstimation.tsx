import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../../Store/store";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { GridValueGetter  } from "@mui/x-data-grid";

const AddEstimation: React.FC = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const [showModal, setShowModal] = useState(false);
  const [estimates, setEstimates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    projectName: "",
    projectType: "",
    description: "",
    techStack: "",
    features: "",
    totalScreens: "",
    estimatedDays: "",
    totalCost: "",
    startDate: "",
    endDate: "",
    additionalNotes: "",
  });

  // 🟢 Fetch all estimates
  const fetchEstimates = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/estimate/");
      if (res.data.success) {
        setEstimates(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching estimates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstimates();
  }, []);

  // 🟢 Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🟢 Submit new estimate
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert("You are not authenticated!");
      return;
    }

    try {
      const payload = {
        ...formData,
        features: formData.features.split(",").map((f) => f.trim()),
      };

      await axios.post("http://localhost:5000/api/estimate/add", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Estimate added successfully!");
      setShowModal(false);
      setFormData({
        projectName: "",
        projectType: "",
        description: "",
        techStack: "",
        features: "",
        totalScreens: "",
        estimatedDays: "",
        totalCost: "",
        startDate: "",
        endDate: "",
        additionalNotes: "",
      });
      fetchEstimates(); // 🔄 Refresh table
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.response?.data?.message || "Failed to add estimation");
    }
  };

  // 🟢 Define columns for DataGrid
 const columns: GridColDef[] = [
  { field: "projectName", headerName: "Project Name", flex: 1.2, minWidth: 200 },
  { field: "projectType", headerName: "Type", flex: 0.8, minWidth: 120 },
  { field: "techStack", headerName: "Tech Stack", flex: 1.5, minWidth: 250 },
  { field: "totalScreens", headerName: "Screens", width: 100 },
  { field: "estimatedDays", headerName: "Days", width: 100 },
  { field: "totalCost", headerName: "Cost", width: 120 },
  { field: "createdBy", headerName: "Created By", flex: 1.2, minWidth: 200 },
  {
    field: "startDate",
    headerName: "Start Date",
    width: 150,
    valueGetter: ((value, row) =>
      value ? new Date(value as string).toLocaleDateString() : "") as GridValueGetter<any, any>,
  },
  {
    field: "endDate",
    headerName: "End Date",
    width: 150,
    valueGetter: ((value, row) =>
      value ? new Date(value as string).toLocaleDateString() : "") as GridValueGetter<any, any>,
  },
    { field: "status", headerName: "Status", width: 120 },

];


  // 🟢 Add "id" for DataGrid
  const rows = estimates.map((item) => ({
    id: item._id,
    ...item,
  }));

  return (
    <div style={styles.pageContainer}>
      <button style={styles.addButton} onClick={() => setShowModal(true)}>
        + Add Estimation
      </button>

      {/* 🟢 DataGrid Section */}
      <div style={{ height: 500, width: "100%", marginTop: 30 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10]}
          loading={loading}
          disableRowSelectionOnClick
          sx={{
            backgroundColor: "#fff",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        />
      </div>

      {/* 🟢 Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContainer}>
            <h2 style={styles.modalTitle}>New Project Estimate</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.row}>
                <input
                  name="projectName"
                  placeholder="Project Name"
                  value={formData.projectName}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
                <input
                  name="projectType"
                  placeholder="Project Type (e.g. Website, App)"
                  value={formData.projectType}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.row}>
                <input
                  name="techStack"
                  placeholder="Tech Stack (e.g. React, Node.js)"
                  value={formData.techStack}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
                <input
                  name="features"
                  placeholder="Features (comma separated)"
                  value={formData.features}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.row}>
                <input
                  name="totalScreens"
                  placeholder="Total Screens"
                  type="number"
                  value={formData.totalScreens}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
                <input
                  name="estimatedDays"
                  placeholder="Estimated Days"
                  type="number"
                  value={formData.estimatedDays}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.row}>
                <input
                  name="totalCost"
                  placeholder="Total Cost"
                  type="number"
                  value={formData.totalCost}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
                <input
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.row}>
                <input
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  style={styles.input}
                />
                <input
                  name="additionalNotes"
                  placeholder="Additional Notes"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <textarea
                name="description"
                placeholder="Project Description"
                value={formData.description}
                onChange={handleChange}
                style={styles.textarea}
                required
              />

              <div style={styles.buttonGroup}>
                <button type="submit" style={styles.submitButton}>
                  Submit
                </button>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// 🎨 Styles
const styles: Record<string, React.CSSProperties> = {
  pageContainer: {
    padding: "30px",
    backgroundColor: "#f4f6f9",
    minHeight: "100vh",
  },
  addButton: {
    backgroundColor: "#ff7a00",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px"
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modalContainer: {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "30px",
    width: "80%",
    maxWidth: "800px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
  },
  modalTitle: {
    color: "#0a192f",
    marginBottom: "20px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  row: {
    display: "flex",
    gap: "15px",
  },
  input: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    backgroundColor: "#f9fafb",
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    minHeight: "80px",
    backgroundColor: "#f9fafb",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "15px",
  },
  submitButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default AddEstimation;

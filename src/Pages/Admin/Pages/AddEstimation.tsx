import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../../Store/store";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { GridValueGetter } from "@mui/x-data-grid";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const AddEstimation: React.FC = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const [showModal, setShowModal] = useState(false);
  const [estimates, setEstimates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false); // 🆕 Add/Edit flag
  const [editId, setEditId] = useState<string | null>(null); // 🆕 store id

  const [formData, setFormData] = useState({
    projectName: "",
    projectType: "",
    description: "",
    techStack: "",
    clientName: "",
    costType: "Hourly",
    estimatedHours: "",
    hourlyCost: "",
    totalCost: "",
    dueDate: "",
    additionalNotes: "",
  });

  // 🟢 Fetch all estimates
    const fetchEstimates = async () => {
    try {
      setLoading(true);

      if (!token) {
        console.warn("No token found — please log in first.");
        setLoading(false);
        return;
      }

      const res = await axios.get("http://localhost:5000/api/estimate/my-estimates", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setEstimates(res.data.data);
      } else {
        console.warn("Failed to fetch estimates:", res.data.message);
      }
    } catch (error) {
      console.error("Error fetching developer estimates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstimates();
  }, []);

  // 🟢 Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (updated.costType === "Hourly" && updated.estimatedHours && updated.hourlyCost) {
        updated.totalCost = (Number(updated.estimatedHours) * Number(updated.hourlyCost)).toString();
      }
      return updated;
    });
  };

  // 🟠 Open modal for editing
  const handleEdit = (row: any) => {
    setFormData({
      projectName: row.projectName || "",
      projectType: row.projectType || "",
      description: row.description || "",
      techStack: row.techStack || "",
      clientName: row.clientName || "",
      costType: row.costType || "Hourly",
      estimatedHours: row.estimatedHours?.toString() || "",
      hourlyCost: row.hourlyCost?.toString() || "",
      totalCost: row.totalCost?.toString() || "",
      dueDate: row.dueDate ? new Date(row.dueDate).toISOString().split("T")[0] : "",
      additionalNotes: row.additionalNotes || "",
    });
    setEditMode(true);
    setEditId(row.id);
    setShowModal(true);
  };

  // 🟢 Handle add estimate
  const handleAddEstimate = async () => {
    const payload = {
      ...formData,
      estimatedHours: formData.costType === "Hourly" ? Number(formData.estimatedHours) : undefined,
      hourlyCost: formData.costType === "Hourly" ? Number(formData.hourlyCost) : undefined,
      totalCost: Number(formData.totalCost),
      dueDate: formData.dueDate || undefined,
    };
    await axios.post("http://localhost:5000/api/estimate/add", payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    alert("Estimate added successfully!");
  };

  // 🟢 Handle update estimate
  const handleUpdateEstimate = async () => {
    if (!editId) return;
    const payload = {
      ...formData,
      estimatedHours: formData.costType === "Hourly" ? Number(formData.estimatedHours) : undefined,
      hourlyCost: formData.costType === "Hourly" ? Number(formData.hourlyCost) : undefined,
      totalCost: Number(formData.totalCost),
      dueDate: formData.dueDate || undefined,
    };
    await axios.put(`http://localhost:5000/api/estimate/update/${editId}`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    alert("Estimate updated successfully!");
  };

  // 🟢 Submit handler (decides add or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert("You are not authenticated!");
      return;
    }

    try {
      if (editMode) {
        await handleUpdateEstimate();
      } else {
        await handleAddEstimate();
      }

      setShowModal(false);
      setEditMode(false);
      setEditId(null);
      setFormData({
        projectName: "",
        projectType: "",
        description: "",
        techStack: "",
        clientName: "",
        costType: "Hourly",
        estimatedHours: "",
        hourlyCost: "",
        totalCost: "",
        dueDate: "",
        additionalNotes: "",
      });
      fetchEstimates();
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.response?.data?.message || "Failed to submit estimation");
    }
  };

  // 🟢 DataGrid Columns
  const columns: GridColDef[] = [
    { field: "projectName", headerName: "Project Name", flex: 1.2, minWidth: 200 },
    { field: "clientName", headerName: "Client", flex: 1, minWidth: 150 },
    { field: "projectType", headerName: "Type", flex: 0.8, minWidth: 120 },
    { field: "techStack", headerName: "Tech Stack", flex: 1.2, minWidth: 200 },
    { field: "description", headerName: "Description", flex: 1.5, minWidth: 250 },
    { field: "costType", headerName: "Cost Type", width: 120 },
    { field: "estimatedHours", headerName: "Estimated Hours", width: 150 },
    { field: "hourlyCost", headerName: "Hourly Cost", width: 130 },
    { field: "totalCost", headerName: "Total Cost", width: 130 },
    {
      field: "dueDate",
      headerName: "Due Date",
      width: 150,
      valueGetter: ((value, row) =>
        value ? new Date(value as string).toLocaleDateString() : "") as GridValueGetter<any, any>,
    },
    { field: "additionalNotes", headerName: "Additional Notes", flex: 1.2, minWidth: 200 },
    { field: "status", headerName: "Status", width: 120 },
    { field: "createdBy", headerName: "Created By", flex: 1.2, minWidth: 200 },
    { field: "developerId", headerName: "Developer ID", flex: 1.2, minWidth: 200 },
    { field: "approvedBy", headerName: "Approved By", flex: 1.2, minWidth: 200 },
    { field: "adminComment", headerName: "Admin Comment", flex: 1.5, minWidth: 250 },
    {
      field: "actions",
      headerName: "Action",
      width: 120,
      renderCell: (params) => {
        if (params.row.status === "ReEdit") {
          return (
            <button
              style={{
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "5px 10px",
                cursor: "pointer",
                fontSize: "14px",
              }}
              onClick={() => handleEdit(params.row)}
            >
              Edit
            </button>
          );
        }
        return null;
      },
    },
  ];

  const rows = estimates.map((item) => ({
    id: item._id,
    ...item,
  }));

  return (
    <div style={styles.pageContainer}>
      <button
        style={styles.addButton}
        onClick={() => {
          setShowModal(true);
          setEditMode(false);
          setEditId(null);
        }}
      >
        + Add Estimation
      </button>

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
            <h2 style={styles.modalTitle}>
              {editMode ? "Edit Project Estimate" : "New Project Estimate"}
            </h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.row}>
                <input name="projectName" placeholder="Project Name" value={formData.projectName} onChange={handleChange} style={styles.input} required />
                <input name="projectType" placeholder="Project Type" value={formData.projectType} onChange={handleChange} style={styles.input} required />
              </div>

              <div style={styles.row}>
                <input name="techStack" placeholder="Tech Stack" value={formData.techStack} onChange={handleChange} style={styles.input} required />
                <input name="clientName" placeholder="Client Name" value={formData.clientName} onChange={handleChange} style={styles.input} required />
              </div>

              <div style={styles.row}>
                <select name="costType" value={formData.costType} onChange={handleChange} style={styles.input}>
                  <option value="Hourly">Total Hours</option>
                  <option value="Fixed">Fixed Price</option>
                </select>

                {formData.costType === "Hourly" && (
                  <>
                    <input name="estimatedHours" type="number" placeholder="Estimated Hours" value={formData.estimatedHours} onChange={handleChange} style={styles.input} required />
                    <input name="hourlyCost" type="number" placeholder="Hourly Cost" value={formData.hourlyCost} onChange={handleChange} style={styles.input} required />
                  </>
                )}

                {formData.costType === "Fixed" && (
                  <input name="totalCost" type="number" placeholder="Total Cost" value={formData.totalCost} onChange={handleChange} style={styles.input} required />
                )}
              </div>

              {formData.costType === "Hourly" && formData.totalCost && (
                <div style={{ color: "#007bff", fontWeight: "bold" }}>
                  Total Cost: ${formData.totalCost}
                </div>
              )}

              <div style={styles.row}>
                <div style={{ flex: 1 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Due Date"
                      value={formData.dueDate ? new Date(formData.dueDate) : null}
                      onChange={(newValue) => {
                        setFormData((prev) => ({
                          ...prev,
                          dueDate: newValue ? newValue.toISOString().split("T")[0] : "",
                        }));
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small",
                          sx: {
                            backgroundColor: "#f9fafb",
                            borderRadius: "6px",
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>
                </div>

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
                  {editMode ? "Update" : "Submit"}
                </button>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => {
                    setShowModal(false);
                    setEditMode(false);
                    setEditId(null);
                  }}
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

// 🎨 Styles (unchanged)
const styles: Record<string, React.CSSProperties> = {
  pageContainer: { padding: "30px", backgroundColor: "#f4f6f9", minHeight: "100vh" },
  addButton: {
    backgroundColor: "#ff7a00",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
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
  modalTitle: { color: "#0a192f", marginBottom: "20px", textAlign: "center" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  row: { display: "flex", gap: "15px", flexWrap: "wrap" },
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
  buttonGroup: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "15px" },
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

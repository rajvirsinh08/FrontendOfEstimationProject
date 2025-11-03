import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Modal,
  Typography,
  CircularProgress,
  styled,
  TextField,
  Tooltip,
} from "@mui/material";
import { DataGrid, GridColDef, GridValueGetter } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { RootState } from "../../../Store/store";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import InfoIcon from "@mui/icons-material/Info";
import EditNoteIcon from "@mui/icons-material/EditNote";
import axiosInstance from "../../../axiosInstance";

const Container = styled(Box)(() => ({ padding: "24px" }));
const Title = styled(Typography)(() => ({
  fontWeight: "bold",
  marginBottom: "16px",
}));
const LoaderBox = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  marginTop: "40px",
}));
const DataTable = styled(DataGrid)(() => ({
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#f8f9fa",
    fontWeight: 600,
  },
}));
const ModalBox = styled(Box)(() => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  backgroundColor: "#fff",
  borderRadius: 10,
  boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
  padding: 24,
}));
const ActionButtons = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  marginTop: "24px",
}));

const AllEstimationForAdmin: React.FC = () => {
  const token = useSelector((state: RootState) => state.user.token);

  const [estimates, setEstimates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [mode, setMode] = useState<"NONE" | "DECLINE" | "REEDIT">("NONE");
  const [adminComment, setAdminComment] = useState("");

const [openReceiptModal, setOpenReceiptModal] = useState(false);
const [receiptPdf, setReceiptPdf] = useState<string | null>(null);

const handleOpenReceiptModal = (pdfUrl: string) => {
  if (!pdfUrl) {
    alert("No receipt available for this payment.");
    return;
  }
  setReceiptPdf(pdfUrl);
  setOpenReceiptModal(true);
};

  const fetchEstimates = async () => {
    try {
      const res = await axiosInstance.get("/estimate/");
      if (res.data.success) setEstimates(res.data.data);
    } catch (error) {
      console.error("Error fetching estimates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstimates();
  }, []);

  const handleStatusUpdate = async (status: "Approved" | "Declined" | "ReEdit") => {
    if (!selectedEstimate?._id || !token) return;

    if (status === "ReEdit" && (!adminComment.trim() || adminComment.trim().length < 3)) {
      alert("Please provide a comment for ReEdit.");
      return;
    }

    setActionLoading(true);
    try {
      const res = await axiosInstance.patch(
        `/estimate/${selectedEstimate._id}/updatestatus`,
        { status, adminComment },
      );

      if (res.data.success) {
        alert(`Estimate ${status.toLowerCase()} successfully.`);
        handleCloseModal();
        fetchEstimates();
      } else {
        alert("Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating status.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenModal = (estimate: any) => {
    setSelectedEstimate(estimate);
    setMode("NONE");
    setAdminComment("");
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEstimate(null);
    setMode("NONE");
    setAdminComment("");
  };
const handleForwardToAccountant = async (estimateId: string) => {
  try {
    const res = await axiosInstance.patch(`/estimate/forward-payment/${estimateId}`);
    if (res.data.success) {
      alert("Payment request sent to accountant successfully!");
      fetchEstimates();
    } else {
      alert(res.data.message || "Failed to update payment request.");
    }
  } catch (error: any) {
    console.error("Error forwarding payment request:", error);
    alert(error.response?.data?.message || "Server error.");
  }
};

const columns: GridColDef[] = [
  { field: "projectName", headerName: "Project Name", flex: 1.2, minWidth: 180 },
  { field: "projectType", headerName: "Type", flex: 0.8, minWidth: 120 },
  { field: "description", headerName: "Description", flex: 1.5, minWidth: 200 },
  { field: "techStack", headerName: "Tech Stack", flex: 1.2, minWidth: 180 },
  { field: "clientName", headerName: "Client Name", width: 150 },
  { field: "costType", headerName: "Cost Type", width: 120 },
  { field: "estimatedHours", headerName: "Est. Hours", width: 120 },
  { field: "hourlyCost", headerName: "Hourly Rate (₹)", width: 150 },
  { field: "totalCost", headerName: "Total Cost (₹)", width: 150 },
  {
    field: "dueDate",
    headerName: "Due Date",
    width: 150,
    valueGetter: (value) =>
      value ? new Date(value as string).toLocaleDateString() : "—",
  },
  { field: "additionalNotes", headerName: "Notes", flex: 1, minWidth: 180 },
  { field: "createdBy", headerName: "Created By", width: 180 },
  { field: "developerId", headerName: "Developer ID", width: 200 },
  { field: "approvedBy", headerName: "Approved By", width: 180 },

  { field: "status", headerName: "Status", width: 120 },
  { field: "adminComment", headerName: "Admin Comment", flex: 1, minWidth: 200 },
  {
    field: "action",
    headerName: "Action",
    width: 220,
    renderCell: (params) => {
      const { status, adminComment } = params.row;

      if (status === "Approved")
        return (
          <Box display="flex" alignItems="center" gap={1}>
            <CheckCircleIcon sx={{ color: "green" }} />
            <Typography variant="body2" color="green">Approved</Typography>
          </Box>
        );

      if (status === "Declined")
        return (
          <Box display="flex" alignItems="center" gap={1}>
            <CancelIcon sx={{ color: "red" }} />
            <Typography variant="body2" color="red">Declined</Typography>
          </Box>
        );

      if (status === "ReEdit")
        return (
          <Box display="flex" alignItems="center" gap={1}>
            <EditNoteIcon sx={{ color: "#ff9800" }} />
            <Typography variant="body2" color="#ff9800">ReEdit</Typography>
            {adminComment && (
              <Tooltip title={adminComment} arrow>
                <InfoIcon sx={{ color: "#888", fontSize: 18, cursor: "pointer" }} />
              </Tooltip>
            )}
          </Box>
        );

      return (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenModal(params.row)}
        >
          Review
        </Button>
      );
    },
  },
    // ✅ Payment Column (status and action)
  {
    field: "payment",
    headerName: "Payment",
    width: 260,
    renderCell: (params) => {
      const { paymentRequest, _id } = params.row;

      if (paymentRequest === "RequestToAdmin") {
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleForwardToAccountant(_id)}
            sx={{ backgroundColor: "#1976d2", textTransform: "none", fontWeight: 500 }}
          >
            Send to Accountant
          </Button>
        );
      }

      if (paymentRequest === "RequestToAccountant") {
        return (
          <Typography variant="body2" sx={{ color: "#ff7a00", fontWeight: 500 }}>
            Payment request sent to accountant
          </Typography>
        );
      }

      if (paymentRequest === "PaymentDone") {
        return (
          <Typography variant="body2" sx={{ color: "green", fontWeight: 600 }}>
            Payment Completed ✅
          </Typography>
        );
      }

      return <Typography variant="body2">—</Typography>;
    },
  },

  // ✅ New Separate Column for Payment Receipt
  {
    field: "paymentReceipt",
    headerName: "Payment Receipt",
    width: 180,
    renderCell: (params) => {
      const { paymentPdf } = params.row;

      if (paymentPdf) {
        return (
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleOpenReceiptModal(paymentPdf)}
          >
            View Receipt
          </Button>
        );
      }

      return <Typography variant="body2">—</Typography>;
    },
  },
];

  return (
    <Container>
      <Title variant="h5">All Project Estimations</Title>

      {loading ? (
        <LoaderBox><CircularProgress /></LoaderBox>
      ) : (
        <DataTable
          rows={estimates}
          columns={columns}
          getRowId={(row) => row._id}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
        />
      )}

      {/* 🟣 Review Modal */}
     <Modal open={openModal} onClose={handleCloseModal}>
  <ModalBox>
    {selectedEstimate && (
      <>
        <Typography variant="h6" fontWeight="bold" marginBottom={2}>
          Project Estimation Details
        </Typography>

        {/* Project Info */}
        <Typography variant="body2" marginBottom={1}>
          <strong>Project Name:</strong> {selectedEstimate.projectName}
        </Typography>
        <Typography variant="body2" marginBottom={1}>
          <strong>Project Type:</strong> {selectedEstimate.projectType}
        </Typography>
        <Typography variant="body2" marginBottom={1}>
          <strong>Client Name:</strong> {selectedEstimate.clientName || "—"}
        </Typography>
        <Typography variant="body2" marginBottom={1}>
          <strong>Description:</strong> {selectedEstimate.description || "—"}
        </Typography>
        <Typography variant="body2" marginBottom={1}>
          <strong>Tech Stack:</strong> {selectedEstimate.techStack}
        </Typography>

        {/* Cost & Time Details */}
        <Typography variant="body2" marginBottom={1}>
          <strong>Cost Type:</strong> {selectedEstimate.costType}
        </Typography>
        <Typography variant="body2" marginBottom={1}>
          <strong>Est. Hours:</strong> {selectedEstimate.estimatedHours || "—"}
        </Typography>
        <Typography variant="body2" marginBottom={1}>
          <strong>Hourly Rate:</strong> ₹{selectedEstimate.hourlyCost || "—"}
        </Typography>
        <Typography variant="body2" marginBottom={1}>
          <strong>Total Cost:</strong> ₹{selectedEstimate.totalCost}
        </Typography>

        {/* Dates */}
        <Typography variant="body2" marginBottom={1}>
          <strong>Due Date:</strong>{" "}
          {selectedEstimate.dueDate
            ? new Date(selectedEstimate.dueDate).toLocaleDateString()
            : "—"}
        </Typography>
        <Typography variant="body2" marginBottom={1}>
          <strong>Created On:</strong>{" "}
          {selectedEstimate.createdAt
            ? new Date(selectedEstimate.createdAt).toLocaleString()
            : "—"}
        </Typography>
        <Typography variant="body2" marginBottom={1}>
          <strong>Updated On:</strong>{" "}
          {selectedEstimate.updatedAt
            ? new Date(selectedEstimate.updatedAt).toLocaleString()
            : "—"}
        </Typography>

        {/* User Info */}
        <Typography variant="body2" marginBottom={1}>
          <strong>Created By:</strong> {selectedEstimate.createdBy}
        </Typography>
        <Typography variant="body2" marginBottom={1}>
          <strong>Developer ID:</strong> {selectedEstimate.developerId}
        </Typography>
        <Typography variant="body2" marginBottom={1}>
          <strong>Approved By:</strong> {selectedEstimate.approvedBy || "—"}
        </Typography>

        {/* Status & Comments */}
        <Typography variant="body2" marginBottom={1}>
          <strong>Status:</strong> {selectedEstimate.status}
        </Typography>
        <Typography variant="body2" marginBottom={1}>
          <strong>Admin Comment:</strong> {selectedEstimate.adminComment || "—"}
        </Typography>
        <Typography variant="body2" marginBottom={1}>
          <strong>Decline Reason:</strong> {selectedEstimate.declineReason || "—"}
        </Typography>

        <Typography variant="body2" marginBottom={2}>
          <strong>Additional Notes:</strong> {selectedEstimate.additionalNotes || "—"}
        </Typography>

        {/* Actions */}
        <ActionButtons>
          {mode === "NONE" && (
            <>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleStatusUpdate("Approved")}
                disabled={actionLoading}
              >
                {actionLoading ? "Processing..." : "Approve"}
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => setMode("DECLINE")}
              >
                Decline
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#ff9800" }}
                onClick={() => setMode("REEDIT")}
              >
                Request ReEdit
              </Button>
            </>
          )}

          {mode === "DECLINE" && (
            <Box sx={{ width: "100%" }}>
              <Typography fontSize={14} marginBottom={1}>
                This will decline the estimate immediately.
              </Typography>
              <Box display="flex" justifyContent="space-between" marginTop={2}>
                <Button variant="outlined" onClick={() => setMode("NONE")}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleStatusUpdate("Declined")}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Processing..." : "Confirm Decline"}
                </Button>
              </Box>
            </Box>
          )}

          {mode === "REEDIT" && (
            <Box sx={{ width: "100%" }}>
              <TextField
                label="Admin Comment / Suggestion"
                variant="outlined"
                fullWidth
                required
                multiline
                rows={3}
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
              />
              <Box display="flex" justifyContent="space-between" marginTop={2}>
                <Button variant="outlined" onClick={() => setMode("NONE")}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#ff9800" }}
                  onClick={() => handleStatusUpdate("ReEdit")}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Processing..." : "Send ReEdit Request"}
                </Button>
              </Box>
            </Box>
          )}
        </ActionButtons>
      </>
    )}
  </ModalBox>
</Modal>
{/* 🧾 Receipt Modal */}
<Modal open={openReceiptModal} onClose={() => setOpenReceiptModal(false)}>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "80%",
      height: "80%",
      backgroundColor: "#fff",
      boxShadow: 24,
      borderRadius: 2,
      p: 2,
      display: "flex",
      flexDirection: "column",
    }}
  >
    {/* Header with title and close button */}
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
      }}
    >
      <Typography variant="h6" fontWeight={600}>
        Payment Receipt
      </Typography>
      <Button
        onClick={() => setOpenReceiptModal(false)}
        sx={{
          color: "white",
          backgroundColor: "#d32f2f",
          textTransform: "none",
          "&:hover": { backgroundColor: "#b71c1c" },
        }}
      >
        Close
      </Button>
    </Box>

    {/* PDF Viewer */}
    {receiptPdf ? (
      <iframe
        src={receiptPdf}
        title="Payment Receipt"
        width="100%"
        height="100%"
        style={{ border: "none", borderRadius: "8px" }}
      ></iframe>
    ) : (
      <Typography>No receipt PDF available.</Typography>
    )}
  </Box>
</Modal>


    </Container>
  );
};

export default AllEstimationForAdmin;

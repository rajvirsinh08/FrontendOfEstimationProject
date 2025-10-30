import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Modal,
  Typography,
  CircularProgress,
  styled,
} from "@mui/material";
import { DataGrid, GridColDef, GridValueGetter } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { RootState } from "../../../Store/store";
import { TextField } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import InfoIcon from "@mui/icons-material/Info";
import { Tooltip } from "@mui/material";

// 🎨 Internal styled components
const Container = styled(Box)(() => ({
  padding: "24px",
}));

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
  "& .MuiDataGrid-cell": {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
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

const InfoRow = styled("div")(() => ({
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "8px",
}));

const InfoColumn = styled("div")(() => ({
  flex: 1,
  padding: "4px 8px",
}));

// 🟢 Component
const AllEstimationForAdmin: React.FC = () => {
  const [estimates, setEstimates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);
const [declineMode, setDeclineMode] = useState(false);
const [declineReason, setDeclineReason] = useState("");

  // 🔐 Token from Redux
  const token = useSelector((state: RootState) => state.user.token);

  // 🟢 Fetch all estimates
  const fetchEstimates = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/estimate/");
      if (res.data.success) {
        setEstimates(res.data.data);
      } else {
        console.error("Failed to load estimates");
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

const handleStatusUpdate = async (status: "Approved" | "Rejected") => {
  if (!selectedEstimate?._id || !token) return;

  // 🟢 Require reason if rejected
  if (status === "Rejected" && (!declineReason.trim() || declineReason.trim().length < 3)) {
    alert("Please provide a valid reason or suggestion for declining this estimate.");
    return;
  }

  setActionLoading(true);
  try {
    const res = await axios.patch(
      `http://localhost:5000/api/estimate/${selectedEstimate._id}/updatestatus`,
      { status, declineReason },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
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

  // 🟢 Modal Handlers
  const handleOpenModal = (estimate: any) => {
    setSelectedEstimate(estimate);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedEstimate(null);
    setOpenModal(false);
  };

  // 🟠 DataGrid Columns

const columns: GridColDef[] = [
  { field: "projectName", headerName: "Project Name", flex: 1.2, minWidth: 200 },
  { field: "projectType", headerName: "Type", flex: 0.8, minWidth: 120 },
  { field: "techStack", headerName: "Tech Stack", flex: 1.5, minWidth: 250 },
  { field: "totalScreens", headerName: "Screens", width: 100 },
  { field: "estimatedDays", headerName: "Days", width: 100 },
  { field: "totalCost", headerName: "Cost (₹)", width: 120 },
  {
    field: "startDate",
    headerName: "Start Date",
    width: 150,
    valueGetter: ((value) =>
      value ? new Date(value as string).toLocaleDateString() : "") as GridValueGetter<any, any>,
  },
  {
    field: "endDate",
    headerName: "End Date",
    width: 150,
    valueGetter: ((value) =>
      value ? new Date(value as string).toLocaleDateString() : "") as GridValueGetter<any, any>,
  },
  { field: "status", headerName: "Status", width: 120 },
  { field: "createdBy", headerName: "Created By", flex: 1, minWidth: 150 },

  // 🟢 Action column logic
  {
    field: "action",
    headerName: "Action",
    width: 200,
    renderCell: (params) => {
      const { status, declineReason } = params.row;

      if (status === "Approved") {
        return (
          <Box display="flex" alignItems="center" gap={1}>
            <CheckCircleIcon sx={{ color: "green" }} />
            <Typography variant="body2" color="green">Approved</Typography>
          </Box>
        );
      }

      if (status === "Rejected") {
        return (
          <Box display="flex" alignItems="center" gap={1}>
            <CancelIcon sx={{ color: "red" }} />
            <Typography variant="body2" color="red">Rejected</Typography>
            {declineReason && (
              <Tooltip title={declineReason} arrow>
                <InfoIcon sx={{ color: "#888", fontSize: 18, cursor: "pointer" }} />
              </Tooltip>
            )}
          </Box>
        );
      }

      // Default (Pending)
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
];

  return (
    <Container>
      <Title variant="h5">All Project Estimations</Title>

      {loading ? (
        <LoaderBox>
          <CircularProgress />
        </LoaderBox>
      ) : (
        <DataTable
          rows={estimates}
          columns={columns}
          getRowId={(row) => row._id}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
        />
      )}

      {/* 🟣 Approve/Reject Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <ModalBox>
          {selectedEstimate && (
            <>
              <Typography variant="h6" fontWeight="bold" marginBottom={2}>
                Project Estimation Details
              </Typography>

              <InfoRow>
                <InfoColumn>
                  <Typography variant="body2">
                    <strong>Project Name:</strong> {selectedEstimate.projectName}
                  </Typography>
                </InfoColumn>
                <InfoColumn>
                  <Typography variant="body2">
                    <strong>Type:</strong> {selectedEstimate.projectType}
                  </Typography>
                </InfoColumn>
              </InfoRow>

              <InfoRow>
                <InfoColumn>
                  <Typography variant="body2">
                    <strong>Tech Stack:</strong> {selectedEstimate.techStack}
                  </Typography>
                </InfoColumn>
              </InfoRow>

              <InfoRow>
                <InfoColumn>
                  <Typography variant="body2">
                    <strong>Total Screens:</strong> {selectedEstimate.totalScreens}
                  </Typography>
                </InfoColumn>
                <InfoColumn>
                  <Typography variant="body2">
                    <strong>Estimated Days:</strong> {selectedEstimate.estimatedDays}
                  </Typography>
                </InfoColumn>
              </InfoRow>

              <InfoRow>
                <InfoColumn>
                  <Typography variant="body2">
                    <strong>Total Cost:</strong> ₹{selectedEstimate.totalCost}
                  </Typography>
                </InfoColumn>
                <InfoColumn>
                  <Typography variant="body2">
                    <strong>Created By:</strong> {selectedEstimate.createdBy}
                  </Typography>
                </InfoColumn>
              </InfoRow>

              <InfoRow>
                <InfoColumn>
                  <Typography variant="body2">
                    <strong>Start Date:</strong>{" "}
                    {selectedEstimate.startDate
                      ? new Date(selectedEstimate.startDate).toLocaleDateString()
                      : "—"}
                  </Typography>
                </InfoColumn>
                <InfoColumn>
                  <Typography variant="body2">
                    <strong>End Date:</strong>{" "}
                    {selectedEstimate.endDate
                      ? new Date(selectedEstimate.endDate).toLocaleDateString()
                      : "—"}
                  </Typography>
                </InfoColumn>
              </InfoRow>

              <InfoRow>
                <InfoColumn style={{ flex: "1 1 100%" }}>
                  <Typography variant="body2">
                    <strong>Description:</strong> {selectedEstimate.description}
                  </Typography>
                </InfoColumn>
              </InfoRow>

          <ActionButtons>
  {!declineMode ? (
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
        onClick={() => setDeclineMode(true)}
      >
        Decline
      </Button>
    </>
  ) : (
    <Box sx={{ width: "100%" }}>
      <TextField
        label="Reason / Suggestion for Decline"
        variant="outlined"
        fullWidth
        required
        multiline
        rows={3}
        value={declineReason}
        onChange={(e) => setDeclineReason(e.target.value)}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
        <Button
          variant="outlined"
          onClick={() => {
            setDeclineMode(false);
            setDeclineReason("");
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => handleStatusUpdate("Rejected")}
          disabled={actionLoading}
        >
          {actionLoading ? "Processing..." : "Confirm Decline"}
        </Button>
      </Box>
    </Box>
  )}
</ActionButtons>

            </>
          )}
        </ModalBox>
      </Modal>
    </Container>
  );
};

export default AllEstimationForAdmin;

// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   CircularProgress,
//   styled,
//   Modal,
// } from "@mui/material";
// import { DataGrid, GridColDef } from "@mui/x-data-grid";
// import axiosInstance from "../../../axiosInstance";
// import { useSelector } from "react-redux";
// import { RootState } from "../../../Store/store";

// const Container = styled(Box)(() => ({ padding: "24px" }));
// const Title = styled(Typography)(() => ({
//   fontWeight: "bold",
//   marginBottom: "16px",
// }));
// const LoaderBox = styled(Box)(() => ({
//   display: "flex",
//   justifyContent: "center",
//   marginTop: "40px",
// }));
// const DataTable = styled(DataGrid)(() => ({
//   backgroundColor: "#fff",
//   borderRadius: "10px",
//   boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//   "& .MuiDataGrid-columnHeaders": {
//     backgroundColor: "#f8f9fa",
//     fontWeight: 600,
//   },
// }));
// const ModalBox = styled(Box)(() => ({
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 500,
//   backgroundColor: "#fff",
//   borderRadius: 10,
//   boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
//   padding: 24,
// }));

// const PaymentRequests: React.FC = () => {
//   const [estimates, setEstimates] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [openModal, setOpenModal] = useState(false);
//   const [selectedEstimate, setSelectedEstimate] = useState<any>(null);

//   const token = useSelector((state: RootState) => state.user.token);

//   const fetchEstimates = async () => {
//     try {
//       const res = await axiosInstance.get("/estimate/");
//       if (res.data.success) {
//         // ✅ Show only those with paymentRequest sent to accountant
//         const filtered = res.data.data.filter(
//           (item: any) => item.paymentRequest === "RequestToAccountant"
//         );
//         setEstimates(filtered);
//       }
//     } catch (error) {
//       console.error("Error fetching estimates:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEstimates();
//   }, []);

//   const handleOpenModal = (estimate: any) => {
//     setSelectedEstimate(estimate);
//     setOpenModal(true);
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//     setSelectedEstimate(null);
//   };

//   const columns: GridColDef[] = [
//     { field: "projectName", headerName: "Project Name", flex: 1.2, minWidth: 180 },
//     { field: "projectType", headerName: "Type", flex: 0.8, minWidth: 120 },
//     { field: "description", headerName: "Description", flex: 1.5, minWidth: 200 },
//     { field: "techStack", headerName: "Tech Stack", flex: 1.2, minWidth: 180 },
//     { field: "clientName", headerName: "Client Name", width: 150 },
//     { field: "costType", headerName: "Cost Type", width: 120 },
//     { field: "estimatedHours", headerName: "Est. Hours", width: 120 },
//     { field: "hourlyCost", headerName: "Hourly Rate (₹)", width: 150 },
//     { field: "totalCost", headerName: "Total Cost (₹)", width: 150 },
//     {
//       field: "dueDate",
//       headerName: "Due Date",
//       width: 150,
//       valueGetter: (value) =>
//         value ? new Date(value as string).toLocaleDateString() : "—",
//     },
//     { field: "additionalNotes", headerName: "Notes", flex: 1, minWidth: 180 },
//     { field: "createdBy", headerName: "Created By", width: 180 },
//     { field: "developerId", headerName: "Developer ID", width: 200 },
//     { field: "approvedBy", headerName: "Approved By", width: 180 },
//     { field: "status", headerName: "Status", width: 120 },
//     { field: "adminComment", headerName: "Admin Comment", flex: 1, minWidth: 200 },
//   ];

//   return (
//     <Container>

//       {loading ? (
//         <LoaderBox>
//           <CircularProgress />
//         </LoaderBox>
//       ) : (
//         <DataTable
//           rows={estimates}
//           columns={columns}
//           getRowId={(row) => row._id}
//           pageSizeOptions={[5, 10]}
//           disableRowSelectionOnClick
//           onRowClick={(params) => handleOpenModal(params.row)}
//         />
//       )}

//       {/* 📘 View Details Modal */}
//       <Modal open={openModal} onClose={handleCloseModal}>
//         <ModalBox>
//           {selectedEstimate && (
//             <>
//               <Typography variant="h6" fontWeight="bold" marginBottom={2}>
//                 Project Estimation Details
//               </Typography>

//               <Typography variant="body2" marginBottom={1}>
//                 <strong>Project Name:</strong> {selectedEstimate.projectName}
//               </Typography>
//               <Typography variant="body2" marginBottom={1}>
//                 <strong>Project Type:</strong> {selectedEstimate.projectType}
//               </Typography>
//               <Typography variant="body2" marginBottom={1}>
//                 <strong>Client Name:</strong> {selectedEstimate.clientName || "—"}
//               </Typography>
//               <Typography variant="body2" marginBottom={1}>
//                 <strong>Description:</strong> {selectedEstimate.description || "—"}
//               </Typography>
//               <Typography variant="body2" marginBottom={1}>
//                 <strong>Tech Stack:</strong> {selectedEstimate.techStack}
//               </Typography>
//               <Typography variant="body2" marginBottom={1}>
//                 <strong>Cost Type:</strong> {selectedEstimate.costType}
//               </Typography>
//               <Typography variant="body2" marginBottom={1}>
//                 <strong>Est. Hours:</strong> {selectedEstimate.estimatedHours || "—"}
//               </Typography>
//               <Typography variant="body2" marginBottom={1}>
//                 <strong>Hourly Rate:</strong> ₹{selectedEstimate.hourlyCost || "—"}
//               </Typography>
//               <Typography variant="body2" marginBottom={1}>
//                 <strong>Total Cost:</strong> ₹{selectedEstimate.totalCost}
//               </Typography>
//               <Typography variant="body2" marginBottom={1}>
//                 <strong>Due Date:</strong>{" "}
//                 {selectedEstimate.dueDate
//                   ? new Date(selectedEstimate.dueDate).toLocaleDateString()
//                   : "—"}
//               </Typography>
//               <Typography variant="body2" marginBottom={1}>
//                 <strong>Created On:</strong>{" "}
//                 {selectedEstimate.createdAt
//                   ? new Date(selectedEstimate.createdAt).toLocaleString()
//                   : "—"}
//               </Typography>
//               <Typography variant="body2" marginBottom={1}>
//                 <strong>Updated On:</strong>{" "}
//                 {selectedEstimate.updatedAt
//                   ? new Date(selectedEstimate.updatedAt).toLocaleString()
//                   : "—"}
//               </Typography>
//               <Typography variant="body2" marginBottom={1}>
//                 <strong>Created By:</strong> {selectedEstimate.createdBy}
//               </Typography>
//               <Typography variant="body2" marginBottom={1}>
//                 <strong>Developer ID:</strong> {selectedEstimate.developerId}
//               </Typography>
//               <Typography variant="body2" marginBottom={1}>
//                 <strong>Approved By:</strong> {selectedEstimate.approvedBy || "—"}
//               </Typography>
//               <Typography variant="body2" marginBottom={1}>
//                 <strong>Status:</strong> {selectedEstimate.status}
//               </Typography>
//               <Typography variant="body2" marginBottom={1}>
//                 <strong>Admin Comment:</strong> {selectedEstimate.adminComment || "—"}
//               </Typography>
//               <Typography variant="body2" marginBottom={1}>
//                 <strong>Additional Notes:</strong>{" "}
//                 {selectedEstimate.additionalNotes || "—"}
//               </Typography>
//             </>
//           )}
//         </ModalBox>
//       </Modal>
//     </Container>
//   );
// };

// export default PaymentRequests;
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  styled,
  Modal,
  Button,
  TextField,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axiosInstance from "../../../axiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../../Store/store";

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

const PaymentRequests: React.FC = () => {
  const [estimates, setEstimates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState<any>(null);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const token = useSelector((state: RootState) => state.user.token);

  // Fetch all estimates for accountant
  const fetchEstimates = async () => {
    try {
      const res = await axiosInstance.get("/estimate/");
      if (res.data.success) {
        // Show only those ready for accountant payment
        const filtered = res.data.data.filter(
          (item: any) => item.paymentRequest === "RequestToAccountant"
        );
        setEstimates(filtered);
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

  // Open modal to pay
  const handleOpenModal = (estimate: any) => {
    setSelectedEstimate(estimate);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEstimate(null);
    setPaymentFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentFile(e.target.files[0]);
    }
  };

//   // ✅ Submit payment
//   const handlePaymentSubmit = async () => {
//     debugger;
//     if (!paymentFile || !selectedEstimate) {
//       alert("Please select a payment proof image first!");
//       return;
//     }

//     try {
//       setSubmitting(true);
//       const formData = new FormData();
//       formData.append("file", paymentFile);

//       const res = await axiosInstance.post(
//         `/estimate/payment/${selectedEstimate._id}`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data"
//           },
//         }
//       );

//       if (res.data.success) {
//         alert("✅ Payment completed successfully!");
//         handleCloseModal();
//         fetchEstimates(); // Refresh list
//       }
//     } catch (err: any) {
//       console.error("Payment submission error:", err);
//       alert("Error submitting payment. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };
const handlePaymentSubmit = async () => {
  if (!paymentFile || !selectedEstimate) {
    alert("Please select a payment proof image first!");
    return;
  }

  try {
    setSubmitting(true);

    // ✅ Create FormData and use field name that backend expects: "file"
    const formData = new FormData();
    formData.append("file", paymentFile); // 👈 must match upload.single("file")

    const res = await axiosInstance.post(
      `/estimate/payment/${selectedEstimate._id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (res.data.success) {
      alert("✅ Payment completed successfully!");
      handleCloseModal();
      fetchEstimates(); // Refresh list
    } else {
      alert(res.data.message || "Something went wrong.");
    }
  } catch (err: any) {
    console.error("Payment submission error:", err);
    if (err.response && err.response.data && err.response.data.message) {
      alert(`Error: ${err.response.data.message}`);
    } else {
      alert("Server error while submitting payment.");
    }
  } finally {
    setSubmitting(false);
  }
};

  // Table columns
  const columns: GridColDef[] = [
    { field: "projectName", headerName: "Project Name", flex: 1.2, minWidth: 180 },
    { field: "projectType", headerName: "Type", flex: 0.8, minWidth: 120 },
    { field: "clientName", headerName: "Client", width: 140 },
    { field: "totalCost", headerName: "Total Cost (₹)", width: 150 },
    { field: "dueDate", headerName: "Due Date", width: 140,
      valueGetter: (value) =>
        value ? new Date(value as string).toLocaleDateString() : "—"
    },
    { field: "status", headerName: "Status", width: 130 },
    {
      field: "payment",
      headerName: "Payment",
      width: 160,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="success"
          onClick={() => handleOpenModal(params.row)}
        >
          Pay
        </Button>
      ),
    },
  ];

  return (
    <Container>
      <Title variant="h5">Payment Requests (Accountant)</Title>

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

      {/* 💳 Payment Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <ModalBox>
          {selectedEstimate && (
            <>
              <Typography variant="h6" fontWeight="bold" marginBottom={2}>
                Complete Payment
              </Typography>

              <Typography variant="body2" marginBottom={1}>
                <strong>Project Name:</strong> {selectedEstimate.projectName}
              </Typography>
              <Typography variant="body2" marginBottom={1}>
                <strong>Client:</strong> {selectedEstimate.clientName}
              </Typography>
              <Typography variant="body2" marginBottom={1}>
                <strong>Total Cost:</strong> ₹{selectedEstimate.totalCost}
              </Typography>
              <Typography variant="body2" marginBottom={2}>
                <strong>Due Date:</strong>{" "}
                {new Date(selectedEstimate.dueDate).toLocaleDateString()}
              </Typography>

              <Typography variant="body2" marginBottom={1}>
                Upload Payment Receipt (JPG/PNG)
              </Typography>
              <TextField
                type="file"
                inputProps={{ accept: "image/png, image/jpeg" }}
                onChange={handleFileChange}
                fullWidth
                sx={{ mb: 2 }}
              />

              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button onClick={handleCloseModal} color="error" variant="outlined">
                  Cancel
                </Button>
                <Button
                  onClick={handlePaymentSubmit}
                  variant="contained"
                  color="success"
                  disabled={submitting}
                >
                  {submitting ? "Processing..." : "Submit Payment"}
                </Button>
              </Box>
            </>
          )}
        </ModalBox>
      </Modal>
    </Container>
  );
};

export default PaymentRequests;

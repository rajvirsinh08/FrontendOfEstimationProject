import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, Box, Typography } from "@mui/material";
import axios from "axios";
import axiosInstance from "../../../axiosInstance";

interface User {
  _id: string;
  fullName: string;
  email: string;
  contactNumber: string;
  role: string;
  createdAt: string;
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 🟢 Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/users/all");
        setUsers(res.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // 🟢 Columns for DataGrid
  const columns: GridColDef[] = [
    { field: "fullName", headerName: "Full Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "contactNumber", headerName: "Contact Number", flex: 1 },
    { field: "role", headerName: "Role", width: 120 },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 180,
      valueGetter: (value, row) =>
        new Date(row.createdAt).toLocaleDateString(),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => alert(`Update for ${params.row.fullName} coming soon...`)}
          >
            Update
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => alert(`Delete for ${params.row.fullName} coming soon...`)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: 500, width: "100%", p: 2 }}>
      
      <DataGrid
        rows={users}
        columns={columns}
        getRowId={(row) => row._id}
        loading={loading}
        pageSizeOptions={[5, 10, 20]}
        initialState={{
          pagination: { paginationModel: { pageSize: 5, page: 0 } },
        }}
      />
    </Box>
  );
}

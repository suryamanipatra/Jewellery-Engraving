import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Paper,
    IconButton,
    Tooltip,
    Typography,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { RiDeleteBin5Fill } from "react-icons/ri";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
}
const handleCloseSnackbar = () => {
    setMessage(null);
    setError(null);
};
const getComparator = (order, orderBy) => {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
    { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
    { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
    { id: 'phone', numeric: false, disablePadding: false, label: 'Phone' },
    { id: 'message', numeric: false, disablePadding: false, label: 'Message' },
];

const AdminMenageMessages = () => {
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState(null);
    const [page, setPage] = useState(0);
    const [dense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/users`);
                setMessages(response?.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };
        fetchMessages();
    }, []);

    const handleDelete = async (email) => {
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/delete-message?mail=${encodeURIComponent(email)}`
            );
            if (response?.data?.message === "Message deleted successfully") {
                setMessages(messages.filter(message => message.email !== email));
            }
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - messages.length) : 0;

    const visibleRows = useMemo(
        () =>
            [...messages]
                .sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [messages, order, orderBy, page, rowsPerPage]
    );

    return (
        <Box sx={{
            width: '100%',

            p: 3,
            borderRadius: 2,
            // boxShadow: 3
        }}>
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={error ? 'error' : 'success'}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {error ? error : "Action completed successfully"}
                </Alert>
            </Snackbar>

            <Paper sx={{
                width: '100%',
                mb: 2,
                background: '#D9D9D94F',
                borderRadius: 2,
                overflow: 'hidden'
            }}>
                <TableContainer sx={{ maxHeight: 400, overflowY: 'auto' }}>
                    <Table
                        sx={{
                            minWidth: 750,
                            '& .MuiTableCell-root': {
                                // border: '2px solid rgba(113, 110, 110, 0.5)'
                            }
                        }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <TableHead>
                            <TableRow>
                                {headCells.map((headCell) => (
                                    <TableCell
                                        key={headCell.id}
                                        align={headCell.numeric ? 'right' : 'left'}
                                        padding={headCell.disablePadding ? '26' : 'normal'}
                                        sortDirection={orderBy === headCell.id ? order : false}
                                        sx={{ color: "white", padding: "20" }}
                                    >
                                        <TableSortLabel
                                            active={orderBy === headCell.id}
                                            direction={orderBy === headCell.id ? order : 'asc'}
                                            onClick={(event) => handleRequestSort(event, headCell.id)}
                                            sx={{ color: "white" }}
                                        >
                                            {headCell.label}
                                            {orderBy === headCell.id ? (
                                                <Box component="span" sx={visuallyHidden}>
                                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                </Box>
                                            ) : null}
                                        </TableSortLabel>
                                    </TableCell>
                                ))}
                                <TableCell align="right" sx={{ color: "white" }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {messages.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                        <Typography variant="h6" color="textSecondary">
                                            There are no queries
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <>
                                    {visibleRows.map((row) => (
                                        <TableRow
                                            hover
                                            tabIndex={-1}
                                            key={row.email}
                                            sx={{ px: 4 }}
                                        >
                                            <TableCell style={{ color: "white" }} component="th" padding="24">{row.name}</TableCell>
                                            <TableCell style={{ color: "white" }}>{row.email}</TableCell>
                                            <TableCell style={{ color: "white" }}>{row.phone}</TableCell>
                                            <TableCell style={{ color: "white" }}>{row.message}</TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Delete">
                                                    <IconButton onClick={() => handleDelete(row.email)}>
                                                        <RiDeleteBin5Fill className="text-red-700" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                            <TableCell colSpan={5} style={{ color: "white" }} />
                                        </TableRow>
                                    )}
                                </>

                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={messages.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                        '& .MuiTablePagination-root, & .MuiTablePagination-selectLabel, & .MuiSelect-root, & .MuiTablePagination-displayedRows': {
                            color: 'white'
                        }
                    }}

                />
            </Paper>
            {/* <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Dense padding"
            /> */}
        </Box>
    );
};

export default AdminMenageMessages;
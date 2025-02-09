import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Alert,
  Snackbar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reservations');
      setReservations(response.data);
    } catch (error) {
      setError('Gagal mengambil data reservasi');
      setOpenSnackbar(true);
      console.error('Error fetching reservations:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus reservasi ini?')) {
      try {
        await axios.delete(`http://localhost:5000/api/reservations/${id}`);
        setOpenSnackbar(true);
        fetchReservations();
      } catch (error) {
        setError('Gagal menghapus reservasi');
        setOpenSnackbar(true);
        console.error('Error deleting reservation:', error);
      }
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Daftar Reservasi
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nama Pasien</TableCell>
              <TableCell>Tanggal</TableCell>
              <TableCell>Waktu</TableCell>
              <TableCell>Dokter</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>{reservation.patient_name}</TableCell>
                <TableCell>{reservation.reservation_date}</TableCell>
                <TableCell>{reservation.reservation_time}</TableCell>
                <TableCell>{reservation.doctor}</TableCell>
                <TableCell>{reservation.status}</TableCell>
                <TableCell>
                  <IconButton 
                    onClick={() => navigate(`/edit/${reservation.id}`)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDelete(reservation.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={error ? "error" : "success"}
        >
          {error || "Operasi berhasil"}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ReservationList;
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  Alert,
  Snackbar
} from '@mui/material';
import axios from 'axios';

const ReservationForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    reservation_date: '',
    reservation_time: '',
    doctor: '',
    notes: '',
    status: 'pending'
  });

  useEffect(() => {
    if (id) {
      fetchReservation();
    }
  }, [id]);

  const fetchReservation = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reservations/${id}`);
      setFormData(response.data);
    } catch (error) {
      setError('Gagal mengambil data reservasi');
      setOpenSnackbar(true);
      console.error('Error fetching reservation:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`http://localhost:5000/api/reservations/${id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/reservations', formData);
      }
      navigate('/');
    } catch (error) {
      setError('Gagal menyimpan reservasi');
      setOpenSnackbar(true);
      console.error('Error saving reservation:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {id ? 'Edit Reservasi' : 'Buat Reservasi Baru'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Nama Pasien"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Nomor Telepon"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Tanggal Reservasi"
              name="reservation_date"
              type="date"
              value={formData.reservation_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Waktu Reservasi"
              name="reservation_time"
              type="time"
              value={formData.reservation_time}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Dokter"
              name="doctor"
              value={formData.doctor}
              onChange={handleChange}
              select
            >
              <MenuItem value="Dr. Andi">Dr. Andi</MenuItem>
              <MenuItem value="Dr. Budi">Dr. Budi</MenuItem>
              <MenuItem value="Dr. Citra">Dr. Citra</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Catatan"
              name="notes"
              multiline
              rows={4}
              value={formData.notes}
              onChange={handleChange}
            />
          </Grid>
          {id && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                select
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </TextField>
            </Grid>
          )}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mr: 1 }}
            >
              {id ? 'Update' : 'Simpan'}
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/')}
            >
              Batal
            </Button>
          </Grid>
        </Grid>
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity="error"
        >
          {error}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default ReservationForm;
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Klinik Reservasi
        </Typography>
        <Button 
          color="inherit" 
          component={RouterLink} 
          to="/"
          sx={{ mr: 2 }}
        >
          Daftar Reservasi
        </Button>
        <Button 
          color="inherit" 
          component={RouterLink} 
          to="/create"
        >
          Buat Reservasi
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
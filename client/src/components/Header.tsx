import { useState } from 'react';
import { AppBar, Toolbar, IconButton, InputBase, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <AppBar position="static" sx={{ bgcolor: '#ffffff', color: '#2c3e50' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Menu e Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton edge="start" color="inherit">
            <MenuIcon />
          </IconButton>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>HealthMVP</h1>
        </Box>

        {/* Barra de Pesquisa */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f5f6fa',
            borderRadius: '8px',
            px: 2,
            width: '40%',
          }}
        >
          <SearchIcon sx={{ color: '#aecfe3', mr: 1 }} />
          <InputBase
            placeholder="Pesquisar médicos, especialidades..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flex: 1 }}
          />
        </Box>

        {/* Ícone do Perfil */}
        <IconButton color="inherit">
          <AccountCircleIcon fontSize="large" />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

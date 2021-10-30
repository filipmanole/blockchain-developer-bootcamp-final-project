import React, { useContext } from 'react';

import {
  IconButton, Button, ButtonGroup,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';

import { AppContext } from '../AppContext';

import './Menu.css';

const Menu = () => {
  const { setAppState } = useContext(AppContext);

  return (
    <div id="menu">
      <IconButton
        color="inherit"
        onClick={() => setAppState((prevAppState) => ({
          darkTheme: !prevAppState.darkTheme,
        }))}
      >
        <Brightness4Icon />
      </IconButton>

      <ButtonGroup variant="outlined" aria-label="outlined button group">
        <Button>Swap</Button>
        <Button>Pool</Button>
      </ButtonGroup>
    </div>
  );
};

export default Menu;

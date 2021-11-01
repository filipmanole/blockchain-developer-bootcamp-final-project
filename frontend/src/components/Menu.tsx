import React, { useContext } from 'react';

import {
  IconButton, Button, ButtonGroup,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';

import { AppContext } from '../AppContext';

import './Menu.css';

const Menu = () => {
  const { dispatchState } = useContext(AppContext);

  return (
    <div id="menu">
      <IconButton
        color="inherit"
        onClick={() => dispatchState({ type: 'SWITCH_THEME' })}
      >
        <Brightness4Icon />
      </IconButton>

      <ButtonGroup variant="contained" aria-label="outlined button group">
        <Button onClick={() => {
          dispatchState({ type: 'SWITCH_MODE', payload: 'swap' });
        }}
        >
          Swap
        </Button>
        <Button onClick={() => {
          dispatchState({ type: 'SWITCH_MODE', payload: 'pool' });
        }}
        >
          Pool

        </Button>
      </ButtonGroup>
    </div>
  );
};

export default Menu;

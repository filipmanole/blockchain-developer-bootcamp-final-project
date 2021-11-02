import React, { useContext } from 'react';

import {
  Button, ButtonGroup,
} from '@mui/material';

import { AppContext } from '../AppContext';

import './Menu.css';

const Menu = () => {
  const { dispatchState } = useContext(AppContext);

  return (
    <div id="menu">
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

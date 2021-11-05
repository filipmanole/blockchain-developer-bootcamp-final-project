import React from 'react';

import {
  Button, ButtonGroup,
} from '@mui/material';

import { useAtom } from 'jotai';
import { appMode } from '../states';

import './Menu.css';

const Menu = () => {
  const [, setMode] = useAtom(appMode);

  return (
    <div id="menu">
      <ButtonGroup variant="contained" aria-label="outlined button group">
        <Button onClick={() => { setMode('swap'); }}>
          Swap
        </Button>
        <Button onClick={() => { setMode('pool'); }}>
          Pool
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default Menu;

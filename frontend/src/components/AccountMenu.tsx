import React from 'react';

import { Button, ButtonGroup } from '@mui/material';
import { useAtom } from 'jotai';
import { accountPageState } from '../states';

const textStyle = { fontFamily: 'Monospace', fontWeight: 'bold' };

const AccountMenu = () => {
  const [, setAccountPage] = useAtom(accountPageState);

  return (
    <div id="menu">
      <ButtonGroup sx={{ borderRadius: '15px' }} variant="contained" aria-label="outlined button group">
        <Button sx={textStyle} onClick={() => { setAccountPage('main'); }}>
          Info
        </Button>
        <Button sx={textStyle} onClick={() => { setAccountPage('token'); }}>
          Manage Tokens
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default AccountMenu;

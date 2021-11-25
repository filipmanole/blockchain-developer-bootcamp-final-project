import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useAtom } from 'jotai';
import { slippageSetting } from '../states';

const SlippageSelect = () => {
  const [slippage, setSlippage] = useAtom(slippageSetting);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="demo-positioned-button"
        aria-controls="demo-positioned-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant="outlined"
        style={{ fontFamily: 'Monospace', fontWeight: 'bold' }}
      >
        {`${Number(slippage).toFixed(1)}%`}
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={() => { setSlippage(0.1); handleClose(); }}>0.1%</MenuItem>
        <MenuItem onClick={() => { setSlippage(0.5); handleClose(); }}>0.5%</MenuItem>
        <MenuItem onClick={() => { setSlippage(1.0); handleClose(); }}>1.0%</MenuItem>
      </Menu>
    </div>
  );
};

export default SlippageSelect;

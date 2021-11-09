import React from 'react';
import { Box } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const Signature: React.FC<{}> = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Monospace',
      zIndex: '3',
      pt: '15px',
    }}
  >
    Made with&nbsp;
    <FavoriteBorderIcon style={{ fill: 'red' }} />
    &nbsp;by Filip.
  </Box>
);

export default Signature;

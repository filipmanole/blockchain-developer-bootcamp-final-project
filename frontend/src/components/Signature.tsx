import React from 'react';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const Signature: React.FC<{}> = () => (
  <p
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Monospace',
    }}
  >
    Made with&nbsp;
    <FavoriteBorderIcon style={{ fill: 'red' }} />
    &nbsp;by Filip.
  </p>
);

export default Signature;

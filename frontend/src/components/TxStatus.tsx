import React from 'react';
import { useAtom } from 'jotai';
import { Paper, Button, CircularProgress } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { appTheme, transactionStatus, transactionMessage } from '../states';

const bluredPaper = {
  position: 'absolute' as 'absolute',
  width: '100%',
  height: '100%',
  zIndex: '3',

  display: 'grid',
  justifyItems: 'center',
  alignItems: 'center',

  background: 'rgba(0,0,0,0)',
  backdropFilter: 'blur(10px)',
  borderRadius: '13px',
  padding: '5px',
};

const buttonStyle = {
  borderRadius: '13px',
  fontFamily: 'Monospace',
  fontSize: '20px',
  fontWeight: 'bold',
};

const TxStatus = () => {
  const [theme] = useAtom(appTheme);
  const [txStatus, setTxStatus] = useAtom(transactionStatus);
  const [message] = useAtom(transactionMessage);

  if (txStatus === 'NOT_SUBMITED') return (null);

  if (txStatus === 'ERROR') {
    return (
      <Paper sx={bluredPaper}>
        <h3 style={{ fontFamily: 'Monospace', textAlign: 'center' }}>
          {message}
        </h3>
        <Button fullWidth variant="contained" sx={buttonStyle} onClick={() => window.location.reload()}>REFRESH</Button>
      </Paper>
    );
  }

  return (
    <Paper sx={bluredPaper}>
      <h3 style={{ fontFamily: 'Monospace', textAlign: 'center' }}>
        {message}
      </h3>
      <div style={{
        height: '80px',
        display: 'flex',
        alignItems: 'center',
      }}
      >
        {txStatus === 'LOADING' && <CircularProgress style={{ color: theme === 'dark' ? 'white' : 'black' }} />}
        {txStatus === 'COMPLETE' && <CheckIcon />}
      </div>

      <div style={{ height: '80px', width: '100%' }}>
        {txStatus === 'COMPLETE' && <Button fullWidth variant="contained" sx={buttonStyle} onClick={() => setTxStatus('NOT_SUBMITED')}>OK</Button>}
      </div>
    </Paper>
  );
};

export default TxStatus;

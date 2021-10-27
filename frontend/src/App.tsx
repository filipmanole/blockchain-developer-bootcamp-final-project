import React, { useState, useEffect } from 'react';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import {
  Box, Grid, Card, TextField, Button,
} from '@mui/material';
import getWeb3 from './getWeb3';
import { SimpleStorage, SimpleStorage__factory } from './typechain';

import './App.css';

interface AppState {
  storageValue: string,
  web3provider?: Web3Provider,
  contract?: SimpleStorage,
}

function App() {
  const defaultState: AppState = { storageValue: '' };

  const [state, setState] = useState(defaultState);
  const [inputValue, setInputValue] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const web3provider: Web3Provider = await getWeb3();
        const signer: JsonRpcSigner = web3provider.getSigner();

        const contract: SimpleStorage = SimpleStorage__factory.connect(
          process.env.REACT_APP_SIMPLE_STORAGE_ADDRESS,
          signer,
        );

        const response = await contract.get();

        setState({ storageValue: response.toString(), web3provider, contract });
      } catch (error) {
        // Catch any errors for any of the above operations.
        // alert(
        //   'Failed to load web3, accounts, or contract. Check console for details.',
        // );
        // console.error(error);
      }
    })();
  }, []);

  const handleInput = (event: any) => {
    setInputValue(event.target.value);
  };

  const setValue = async (value: number) => {
    const { contract } = state;

    const txResponse = await contract?.set(value);
    await txResponse?.wait();
  };

  const getValue = async () => {
    const { contract } = state;

    const response = await contract?.get();

    if (response) setState({ ...state, storageValue: response?.toString() });
  };

  if (!state.web3provider) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return (
    <Grid container spacing={2} id="grid">
      <Card id="card" variant="outlined">
        <div className="App">
          <h2>Simple Storage Example</h2>

          <hr />

          <p>
            Enter a number that will be stored on the blockchain.
          </p>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Input Value"
            variant="outlined"
            onChange={handleInput}
            inputProps={{ style: { textAlign: 'center' } }}
          />
          <br />
          <br />
          <Button
            fullWidth
            onClick={() => { setValue(inputValue); }}
            variant="contained"
          >
            Set Storage Value
          </Button>

          <br />
          <br />
          <hr />

          <p>
            Display the number stored on the blockchain.
          </p>
          <Box display="inline-block">
            <Card id="displayValue" variant="outlined">
              {state.storageValue}
            </Card>
          </Box>
          <br />
          <br />
          <Button fullWidth onClick={getValue} variant="contained">Get Storage Value</Button>
        </div>
      </Card>
    </Grid>
  );
}

export default App;

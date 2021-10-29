import React, { useState, createContext } from 'react';

export interface IAppState {
  darkTheme: boolean;
}

const defaultAppState: IAppState = {
  darkTheme: true,
};

export interface IAppContext {
  appState: IAppState;
  setAppState?: React.Dispatch<React.SetStateAction<IAppState>>;
}

const defaultContext: IAppContext = {
  appState: defaultAppState,
};

export const AppContext = createContext<IAppContext>(defaultContext);

export interface IAppProvider {
  children: JSX.Element;
}

export const AppProvider: React.FC<IAppProvider> = ({ children }) => {
  const [appState, setAppState] = useState(defaultAppState);

  return (
    <AppContext.Provider value={{ appState, setAppState }}>
      {children}
    </AppContext.Provider>
  );
};

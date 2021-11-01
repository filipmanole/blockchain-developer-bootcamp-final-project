import React, { useReducer, createContext } from 'react';
import produce from 'immer';

/* Application State */
export interface IAppState {
  darkTheme: boolean;
  mode: 'swap' | 'pool';
}

const defaultAppState: IAppState = {
  darkTheme: true,
  mode: 'swap',
};

/* Setting context for the application */
export interface IAppContext {
  appState: IAppState;
  dispatchState?: React.Dispatch<TAction>;
}

const defaultContext: IAppContext = {
  appState: defaultAppState,
};

export const AppContext = createContext<IAppContext>(defaultContext);

/* Setting the application state provider */
export interface IAppProvider {
  children: JSX.Element;
}

type TAction =
  { type: 'SWITCH_THEME'; } |
  { type: 'SWITCH_MODE'; payload: any; };

const reducer = (state: IAppState, action: TAction) => produce(state, (draft) => {
  switch (action.type) {
    case 'SWITCH_THEME':
      draft.darkTheme = !draft.darkTheme;
      break;

    case 'SWITCH_MODE':
      draft.mode = action.payload;
      break;

    default:
      throw Error('Dispatch unknown data action');
  }
});

export const AppProvider: React.FC<IAppProvider> = ({ children }) => {
  const [appState, dispatchState] = useReducer(reducer, defaultAppState);

  return (
    <AppContext.Provider value={{ appState, dispatchState }}>
      {children}
    </AppContext.Provider>
  );
};

import * as React from "react";

const LOCAL_STORAGE_KEY = "ayaneo-tdp-settings";
type State = {
  min: number;
  max: number;
};

type Action =
  | { type: "set-min"; value: State["min"] }
  | { type: "set-max"; value: State["max"] }
  | { type: "load"; value: State };

type Dispatch = (action: Action) => void;

type SettingsProviderProps = { children: React.ReactNode };

export const SettingsStateContext = React.createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

const defaultSettings: State = {
  min: 5,
  max: 18,
} as const;

function settingsReducer(state: State, action: Action) {
  switch (action.type) {
    case "set-min": {
      const newState = { ...state, min: action.value };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
      return newState;
    }
    case "set-max": {
      const newState = { ...state, max: action.value };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
      return newState;
    }
    case "load": {
      return action.value;
    }
  }
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const [state, dispatch] = React.useReducer(settingsReducer, defaultSettings);
  React.useEffect(() => {
    async function getSettings() {
      const settingsString = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!settingsString) {
        dispatch({
          type: "load",
          value: defaultSettings,
        });
        return;
      }
      const storedSettings = JSON.parse(settingsString);
      dispatch({
        type: "load",
        value: {
          min: storedSettings?.min || defaultSettings.min,
          max: storedSettings?.max || defaultSettings.max,
        },
      });
    }
    getSettings();
  }, []);
  const value = { state, dispatch };
  return (
    <SettingsStateContext.Provider value={value}>
      {children}
    </SettingsStateContext.Provider>
  );
};

export const useSettings = () => {
  const context = React.useContext(SettingsStateContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

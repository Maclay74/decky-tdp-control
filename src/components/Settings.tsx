import {
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  TextField,
  DialogButton,
  Field,
} from "decky-frontend-lib";
import React, { VFC, useEffect, useState } from "react";
import { useSettings } from "../utils/getSettings";
import { SetTDPMethodArgs } from "../types";

export const DeckyPanel: VFC<{ serverApi: ServerAPI }> = ({ serverApi }) => {
  const { state, dispatch } = useSettings();
  const [min, setMin] = useState<string>(state.min.toString());
  const [max, setMax] = useState<string>(state.max.toString());

  const onChangeMin = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMin(e.target.value);
  const onChangeMax = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMax(e.target.value);

  console.log(serverApi);

  useEffect(() => {
    setMin(state.min.toString());
    setMax(state.max.toString());
  }, [state]);

  const apply = async () => {
    // Update settings
    dispatch({ type: "set-min", value: parseInt(min, 10) });
    dispatch({ type: "set-max", value: parseInt(max, 10) });

    // Update current TDP to make sure it's in bounds
    const currentTdp = await serverApi.callPluginMethod<{}, string>(
      "get_tdp",
      {}
    );
    if (!currentTdp.success) return;

    const newTdp = Math.min(
      Math.max(parseInt(currentTdp.result, 10), parseInt(min, 10)),
      parseInt(max, 10)
    );
    await serverApi.callPluginMethod<SetTDPMethodArgs, number>("set_tdp", {
      tdp: newTdp,
    });

    // @ts-ignore: decky global is not typed
    window.SystemPerfStore.SetTDPLimit(newTdp);
  };

  return (
    <PanelSection title={"Settings"}>
      <PanelSectionRow>
        <Field
          childrenLayout="below"
          description={"The lowest TDP supported by the device"}
        >
          <TextField
            value={min}
            mustBeNumeric
            label={"Minimum TDP"}
            onChange={onChangeMin}
          />
        </Field>
      </PanelSectionRow>
      <PanelSectionRow>
        <Field
          childrenLayout="below"
          description={"The highest TDP supported by the device"}
        >
          <TextField
            value={max}
            mustBeNumeric
            label={"Maximum TDP"}
            onChange={onChangeMax}
          />
        </Field>
      </PanelSectionRow>
      <PanelSectionRow>
        <Field
          childrenLayout="below"
          description={"New limits will take effect after a Steam restart"}
        >
          <DialogButton onClick={apply}>Save</DialogButton>
        </Field>
      </PanelSectionRow>
    </PanelSection>
  );
};

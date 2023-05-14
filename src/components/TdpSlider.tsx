import { ServerAPI } from "decky-frontend-lib";
import React, { VFC, useLayoutEffect, useState } from "react";
import { useSettings } from "../utils/getSettings";
import { SetTDPMethodArgs } from "../types";

export const TdpSlider: VFC<{ originalSlider: any; serverApi: ServerAPI }> = ({
  originalSlider,
  serverApi,
}) => {
  const [currentTdp, setCurrentTdp] = useState(originalSlider.props.value);
  const { state } = useSettings();

  useLayoutEffect(() => {
    serverApi.callPluginMethod<{}, string>("get_tdp", {}).then((response) => {
      if (response.success) {
        const newTdp = parseInt(response.result, 10);
        setCurrentTdp(newTdp);
        // @ts-ignore: decky global is not typed
        window.SystemPerfStore.SetTDPLimit(newTdp);
      }
    });
  }, []);

  const onChange = async (value: any) => {
    await serverApi.callPluginMethod<SetTDPMethodArgs, number>("set_tdp", {
      tdp: value,
    });
    setCurrentTdp(value);
  };

  return React.createElement(originalSlider.type, {
    ...originalSlider.props,
    ...state,
    value: currentTdp,
    onChange,
  });
};

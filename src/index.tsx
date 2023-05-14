import {
  definePlugin,
  ServerAPI,
  staticClasses,
  afterPatch,
} from "decky-frontend-lib";
import { FaBolt } from "react-icons/fa";
import { getTdpSlider } from "./utils/getSlider";
import { SettingsProvider } from "./utils/getSettings";
import { DeckyPanel } from "./components/Settings";
import { TdpSlider } from "./components/TdpSlider";

export default definePlugin((serverApi: ServerAPI) => {
  getTdpSlider().then((slider) => {
    if (!slider) return;

    afterPatch(
      slider.return,
      "type",
      (_: Record<string, unknown>[], ret?: any) => {
        if (!ret) return null;
        return (
          <SettingsProvider>
            <TdpSlider originalSlider={ret} serverApi={serverApi} />
          </SettingsProvider>
        );
      }
    );

    serverApi.callPluginMethod<{}, string>("get_tdp", {}).then((response) => {
      if (response.success) {
        // @ts-ignore: decky global is not typed
        window.SystemPerfStore.SetTDPLimit(parseInt(response.result, 10));
      }
    });
  });

  return {
    title: <div className={staticClasses.Title}>TDP Control</div>,
    content: (
      <SettingsProvider>
        <DeckyPanel serverApi={serverApi} />
      </SettingsProvider>
    ),
    icon: <FaBolt />,
  };
});

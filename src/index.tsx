import {
  ButtonItem,
  definePlugin,
  DialogButton,
  PanelSection,
  PanelSectionRow,
  Router,
  ServerAPI,
  staticClasses,
} from "decky-frontend-lib";
import { VFC, useState } from "react";
import { FaShip } from "react-icons/fa";

// interface AddMethodArgs {
//   left: number;
//   right: number;
// }

interface SetTDPMethodArgs {
  tdp: number;
}

const Content: VFC<{ serverAPI: ServerAPI }> = ({serverAPI}) => {
  const [current, setCurrent] = useState<string>("Unknown");

  // const onClick = async () => {
  //   const result = await serverAPI.callPluginMethod<AddMethodArgs, number>(
  //     "add",
  //     {
  //       left: 2,
  //       right: 2,
  //     }
  //   );
  //   if (result.success) {
  //     setResult(result.result);
  //   }
  // };

  const setTDP = async(tdp: number) => {
    const result = await serverAPI.callPluginMethod<SetTDPMethodArgs, number>("set_tdp", { tdp });

  
    if (result.success) {
      setCurrent(result.result.toString());
    } else {
      setCurrent(result.result);
    }
  }

  return (
    <PanelSection title={"Current: " + current}>
      <PanelSectionRow>
        <ButtonItem
          layout="below"
          onClick={() => setTDP(5)} 
        >
          Set 5 TDP
        </ButtonItem>
        <ButtonItem
          layout="below"
          onClick={() => setTDP(18)}
        >
          Set 18 TDP
        </ButtonItem>
      </PanelSectionRow>

      {/*<PanelSectionRow>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img src={logo} />
        </div>
      </PanelSectionRow>

      <PanelSectionRow>
        <ButtonItem
          layout="below"
          onClick={() => {
            Router.CloseSideMenus();
            Router.Navigate("/decky-plugin-test");
          }}
        >
          Router
        </ButtonItem>
        </PanelSectionRow>*/}
    </PanelSection>
  );
};

const DeckyPluginRouterTest: VFC = () => {
  return (
    <div style={{ marginTop: "50px", color: "white" }}>
      Hello World!
      <DialogButton onClick={() => Router.NavigateToLibraryTab()}>
        Go to Library
      </DialogButton>
    </div>
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  serverApi.routerHook.addRoute("/decky-plugin-test", DeckyPluginRouterTest, {
    exact: true,
  });

  return {
    title: <div className={staticClasses.Title}>Example Plugin</div>,
    content: <Content serverAPI={serverApi} />,
    icon: <FaShip />,
    onDismount() {
      serverApi.routerHook.removeRoute("/decky-plugin-test");
    },
  };
});

import { findInTree } from "decky-frontend-lib";
import { Fiber } from "../types";

const findSlider = (): Fiber | null => {
  return findInTree(
    // @ts-ignore: decky global is not typed
    window.DeckyPluginLoader.tabsHook.qAMRoot.child,
    (x) => x?.memoizedProps?.label === "Watts",
    {
      walkable: ["props", "children", "child", "memoizedProps", "sibling"],
    }
  );
};

export const getTdpSlider = async (): Promise<Fiber> => {
  // @ts-ignore: decky global is not typed
  while (!window.DeckyPluginLoader?.tabsHook?.qAMRoot) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  let slider: Fiber | null = null;

  while (!slider) {
    slider = findSlider();
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  return slider;
};

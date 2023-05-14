declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

export interface SetTDPMethodArgs {
  tdp: number;
}

export type Fiber = {
  tag: TypeOfWork;
  key: null | string;
  elementType: any;
  type: any;
  stateNode: any;
  return: Fiber | null;
  child: Fiber | null;
  sibling: Fiber | null;
  index: number;
  ref: null | (((handle: mixed) => void) & { _stringRef: ?string }) | RefObject;
  pendingProps: any;
  memoizedProps: any;
  updateQueue: mixed;
  memoizedState: any;
  mode: TypeOfMode;
  effectTag: SideEffectTag;
  subtreeTag: SubtreeTag;
  deletions: Array<Fiber> | null;
  nextEffect: Fiber | null;
  firstEffect: Fiber | null;
  lastEffect: Fiber | null;
  alternate: Fiber | null;
};

import { useState } from "react";

type TUseBoolean = readonly [
  boolean,
  {
    readonly setTrue: () => void;
    readonly setFalse: () => void;
  }
];

export default function useBoolean(initialValue = false): TUseBoolean {

  const [bool, setBool] = useState(initialValue);

  const setTrue = (): void => setBool(true);
  const setFalse = (): void => setBool(false);

  return [bool, { setTrue, setFalse }] as const;

}
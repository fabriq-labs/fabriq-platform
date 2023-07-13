/* eslint-disable max-len */
import { useCallback, useMemo, useState } from "react";
import localOptions from "./localOptions";

export default function useAutocompleteFlags(schema) {
  const isAvailable = useMemo(
    () => schema && schema.tokensCount <= 5000,
    [schema]
  );
  const [isEnabled, setIsEnabled] = useState(
    localOptions.get("liveAutocomplete", true)
  );

  const toggleAutocomplete = useCallback((state) => {
    setIsEnabled(state);
    localOptions.set("liveAutocomplete", state);
  }, []);

  return useMemo(
    () => [isAvailable, isEnabled, toggleAutocomplete],
    [isAvailable, isEnabled, toggleAutocomplete]
  );
}

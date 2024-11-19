//@ts-nocheck
import hotkeys from "utils/common/hotkeys"; //{ HotkeysEvent, KeyHandler }
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectHotkeyContext } from "store/applicationSettings/selectors";
import {
  HotkeyAvailableTags,
  HotkeyOptions,
  HotkeysEvent,
  HotkeyKeyHandler,
} from "utils/common/types";
import { HotkeyContext } from "utils/common/enums";

// We implement our own custom filter system.

const tagFilter = (
  { target }: KeyboardEvent,
  enableOnTags?: HotkeyAvailableTags[]
) => {
  const targetTagName = target && (target as HTMLElement).tagName;

  return Boolean(
    targetTagName &&
      enableOnTags &&
      enableOnTags.includes(targetTagName as HotkeyAvailableTags)
  );
};

const isKeyboardEventTriggeredByInput = (ev: KeyboardEvent) => {
  return tagFilter(ev, ["INPUT", "TEXTAREA", "SELECT"]);
};

export function useHotkeys(
  keys: string,
  callback: HotkeyKeyHandler,
  hotkeyContext: HotkeyContext | Array<HotkeyContext>,
  options?: HotkeyOptions
): void;
export function useHotkeys(
  keys: string,
  callback: HotkeyKeyHandler,
  hotkeyContext: HotkeyContext | Array<HotkeyContext>,
  deps?: any[]
): void;
export function useHotkeys(
  keys: string,
  callback: HotkeyKeyHandler,
  hotkeycontext: HotkeyContext | Array<HotkeyContext>,
  options?: HotkeyOptions,
  deps?: any[]
): void;
export function useHotkeys(
  keys: string,
  callback: () => void,
  hotkeyContext: HotkeyContext | Array<HotkeyContext>,
  options?: any[] | HotkeyOptions,
  deps?: any[]
): void {
  if (options instanceof Array) {
    deps = options;
    options = undefined;
  }

  const {
    enableOnTags,
    filter,
    keyup,
    keydown,
    filterPreventDefault = true,
    enabled = true,
    enableOnContentEditable = false,
  } = (options as HotkeyOptions) || {};
  const currentHotkeyContext = useSelector(selectHotkeyContext);
  // The return value of this callback determines if the browsers default behavior is prevented.

  const memoisedCallback = useCallback(
    (keyboardEvent: KeyboardEvent, hotkeysEvent: HotkeysEvent) => {
      if (filter && !filter(keyboardEvent)) {
        return !filterPreventDefault;
      }

      // Check whether the hotkeys was triggered inside an input and that input is enabled or if it was triggered by a content editable tag and it is enabled.
      if (
        (isKeyboardEventTriggeredByInput(keyboardEvent) &&
          !tagFilter(keyboardEvent, enableOnTags)) ||
        ((keyboardEvent.target as HTMLElement)?.isContentEditable &&
          !enableOnContentEditable)
      ) {
        return true;
      }

      if (
        (Array.isArray(hotkeyContext) &&
          hotkeyContext.includes(currentHotkeyContext)) ||
        (!Array.isArray(hotkeyContext) &&
          hotkeyContext === currentHotkeyContext)
      ) {
        callback(keyboardEvent, hotkeysEvent);
        return true;
      }

      return false;
    }, //eslint-disable-next-line react-hooks/exhaustive-deps
    deps
      ? [hotkeyContext, currentHotkeyContext, enableOnTags, filter, ...deps]
      : [hotkeyContext, currentHotkeyContext, enableOnTags, filter]
  );

  useEffect(() => {
    if (!enabled) {
      hotkeys.unbind(keys, memoisedCallback);

      return;
    }

    // In this case keydown is likely undefined, so we set it to false,
    // since hotkeys sets `keydown` to true in absense of explicit setting.
    if (keyup && keydown !== true) {
      (options as HotkeyOptions).keydown = false;
    }
    hotkeys(keys, (options as HotkeyOptions) || {}, memoisedCallback);

    return () => {
      hotkeys.unbind(keys, memoisedCallback);
    };
  }, [keyup, keydown, options, memoisedCallback, keys, enabled]);
}

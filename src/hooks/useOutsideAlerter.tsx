import { type MutableRefObject, useEffect } from "react";
/*
 * Hook that alerts clicks outside of the passed ref
 */
export const useOutsideAlerter = (
  ref: MutableRefObject<HTMLElement | null>,
  callback: () => void,
) => {
  useEffect(() => {
    // init callback if clicked on outside of element
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};

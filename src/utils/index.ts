import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
export type UnwrapArray<T> = T extends Array<infer U> ? U : T;
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
  }
  export function getRandomColor() {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return "#" + randomColor.padStart(6, '0');
}

export function getContrastedHexColor() {
  const randomColor = Math.floor(Math.random() * (0xFFFFFF + 1));
  const darkColor = randomColor & 0x7F7F7F; // Bitwise AND to reduce brightness
  return `#${darkColor.toString(16).padStart(6, '0')}`;
}


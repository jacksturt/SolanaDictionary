import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
export type UnwrapArray<T> = T extends Array<infer U> ? U : T;
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
  }
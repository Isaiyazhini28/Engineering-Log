

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getBase64 = (file: File | Blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

export function getShortName(name?: string) {
  if (!name) return "";
  return name.split(" ").reduce((prev, cur) => prev + cur.charAt(0), "")[0];
}

export function stringToColor(str: string) {
  if (str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
      let value = (hash >> (i * 20)) & 0x7f;
      color += ("00" + value.toString(16)).substr(-2);
    }
    return color;
  }
}

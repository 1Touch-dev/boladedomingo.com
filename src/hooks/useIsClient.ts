"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export const useIsClient = () => useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);

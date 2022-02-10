import { writable, readable } from "svelte/store";

export const file = writable(null);
export const state = writable("loading")
export const presignedPOST = readable({},function start(set){
    return function stop(){}
})

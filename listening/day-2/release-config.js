import {activities} from './content.js';
export const workshop='listening-day-2';
export const stages=activities.filter(a=>a.answers).map(a=>({id:a.id,label:`${a.audio} · ${a.title}`}));
// The deployed Worker registers all ten Day 2 activities.
export const serviceReady=true;

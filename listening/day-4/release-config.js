import {activities} from './content.js';
export const workshop='listening-day-4';
export const stages=activities.filter(a=>!a.independent).map(a=>({id:a.id,label:a.title}));
export const serviceReady=true;

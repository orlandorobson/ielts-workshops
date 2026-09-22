import {activities} from './content.js';
export const workshop='listening-day-3';
export const stages=[...new Map(activities.filter(a=>a.ready!==false&&!a.independent).map(a=>[a.releaseId,{id:a.releaseId,label:({vocabulary31:'3.1 · Vocabulary practice',conversation33:'3.3 · Spoken follow-up',language34:'3.4 · Phrase and vocabulary checking',say34:'3.4 · Say It models'})[a.releaseId]||a.title}])).values()];
// Day 3 uses the established production classroom service.
export const serviceReady=true;

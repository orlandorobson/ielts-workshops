import {createReleaseControl} from '../shared/release-control.js';
// Keep release changes usable in this tab even if storage becomes full/read-only.
// Shared rendering, config shape and cross-tab refresh remain unchanged.
export function createDay4Control(config){
 const base=createReleaseControl(config),ids=config.stages.map(s=>s.id);
 let memory=base.read();
 const read=()=>memory;
 const write=value=>{memory=value;try{localStorage.setItem(config.storageKey,JSON.stringify(value));}catch{}};
 function open(id,through=false){const i=ids.indexOf(id);if(i<0)return;write({...memory,released:[...new Set([...memory.released,...(through?ids.slice(0,i+1):[id])])]});}
 function unlockAll(){write({...memory,released:ids.slice()});}
 return {...base,read,open,unlockAll,isOpen:id=>memory.released.includes(id),
  applyCode(code){const text=code.trim();if(text===config.allAccessCode){unlockAll();return {valid:true,all:true};}const stage=config.stages.find(s=>s.code===text||s.throughCode===text);if(!stage)return {valid:false};open(stage.id,stage.throughCode===text);return {valid:true,stage};},
  complete(id){if(memory.released.includes(id))write({...memory,completed:[...new Set([...memory.completed,id])]});},
  refresh(){memory=base.refresh();return memory;},
  reset(){base.reset();memory={released:[config.defaultUnlockedStage],completed:[]};}
 };
}

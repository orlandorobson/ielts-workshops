// Separate, unmodified LGPL encoder; see vendor/README.md.
importScripts('vendor/lame.min.js');
onmessage = ({data:{samples,sampleRate}}) => {
 try {
  const encoder=new lamejs.Mp3Encoder(1,sampleRate,96), parts=[];
  for(let i=0;i<samples.length;i+=1152){const part=encoder.encodeBuffer(samples.subarray(i,i+1152));if(part.length)parts.push(new Uint8Array(part));}
  const tail=encoder.flush();if(tail.length)parts.push(new Uint8Array(tail));
  postMessage({blob:new Blob(parts,{type:'audio/mpeg'})});
 }catch(error){postMessage({error:error.message});}
};

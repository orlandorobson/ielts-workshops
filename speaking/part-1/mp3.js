// All decoding and encoding stays on the device. Originals are never replaced.
export async function toMP3(blob) {
 const AudioContext=window.AudioContext || window.webkitAudioContext;
 const context=new AudioContext();let decoded;
 try {decoded=await context.decodeAudioData(await blob.arrayBuffer());}
 finally {await context.close();}
 // Mono 44.1 kHz gives predictable speech exports across recording formats.
 const offline=new OfflineAudioContext(1,Math.ceil(decoded.duration*44100),44100);
 const source=offline.createBufferSource();source.buffer=decoded;source.connect(offline.destination);source.start();
 const audio=await offline.startRendering(), floats=audio.getChannelData(0), samples=new Int16Array(floats.length);
 for(let i=0;i<floats.length;i++){const n=Math.max(-1,Math.min(1,floats[i]));samples[i]=n<0?n*32768:n*32767;}
 return new Promise((resolve,reject)=>{
  const worker=new Worker(new URL('./mp3-worker.js',import.meta.url));
  const done=(error,result)=>{clearTimeout(timeout);worker.terminate();error?reject(error):resolve(result);};
  const timeout=setTimeout(()=>done(Error('MP3 conversion timed out')),120000);
  worker.onerror=()=>done(Error('MP3 encoder could not load'));
  worker.onmessage=({data})=>data.error?done(Error(data.error)):data.blob?.size?done(null,data.blob):done(Error('Empty MP3'));
  worker.postMessage({samples,sampleRate:44100},[samples.buffer]);
 });
}

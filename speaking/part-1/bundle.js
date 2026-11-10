// Uncompressed ZIP: each native audio file stays independently playable.
export async function bundle(files) {
 const encoder = new TextEncoder(), parts = [], directory = []; let offset = 0;
 const header = size => { const bytes = new Uint8Array(size); return [bytes, new DataView(bytes.buffer)]; };
 for (const file of files) {
  const name = encoder.encode(file.name), data = new Uint8Array(await file.blob.arrayBuffer());
  let crc = 0xffffffff;
  for (const byte of data) { crc ^= byte; for(let i=0;i<8;i++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0); }
  crc = (crc ^ 0xffffffff) >>> 0;
  const [local,l] = header(30); l.setUint32(0,0x04034b50,true); l.setUint16(4,20,true); l.setUint16(12,33,true);
  l.setUint32(14,crc,true); l.setUint32(18,data.length,true); l.setUint32(22,data.length,true); l.setUint16(26,name.length,true);
  parts.push(local,name,data);
  const [central,c] = header(46); c.setUint32(0,0x02014b50,true); c.setUint16(4,20,true); c.setUint16(6,20,true); c.setUint16(14,33,true);
  c.setUint32(16,crc,true); c.setUint32(20,data.length,true); c.setUint32(24,data.length,true); c.setUint16(28,name.length,true); c.setUint32(42,offset,true);
  directory.push(central,name); offset += local.length + name.length + data.length;
 }
 const size = directory.reduce((sum,p)=>sum+p.length,0), [end,e] = header(22);
 e.setUint32(0,0x06054b50,true); e.setUint16(8,files.length,true); e.setUint16(10,files.length,true); e.setUint32(12,size,true); e.setUint32(16,offset,true);
 return new Blob([...parts,...directory,end],{type:'application/zip'});
}

/* Gerador local de PDF: páginas A4 com imagens inteiras, proporção preservada (PDF 1.4, JPEG/DCT).
   Não depende de servidores externos, bibliotecas remotas nem impressão do navegador. */
(() => {
 'use strict';
 const utf8=new TextEncoder();
 const A4W=595.28,A4H=841.89;
 function bytes(s){return utf8.encode(s)}
 function concat(list){let n=0;for(const b of list)n+=b.length;const out=new Uint8Array(n);let o=0;for(const b of list){out.set(b,o);o+=b.length}return out}
 function strPDF(s){
  // Escapar como sequências octais de bytes WinAnsi, conservando acentos em português.
  const mapping={'€':128,'‚':130,'ƒ':131,'„':132,'…':133,'†':134,'‡':135,'ˆ':136,'‰':137,'Š':138,'‹':139,'Œ':140,'Ž':142,'‘':145,'’':146,'“':147,'”':148,'•':149,'–':150,'—':151,'˜':152,'™':153,'š':154,'›':155,'œ':156,'ž':158,'Ÿ':159,'−':45,'→':62,'✔':43,'📎':35,'📷':35};
  return Array.from(String(s)).map(c=>{let code=c.codePointAt(0);if(mapping[c]!==undefined)code=mapping[c];if(code===10||code===13)code=32;if(code===40||code===41||code===92)return '\\'+c;if(code<32||code>=127&&code<=255)return '\\'+code.toString(8).padStart(3,'0');if(code>255)return '?';return c}).join('');
 }
 function safeText(s){return String(s||'').replace(/\s+/g,' ').trim()}
 function wrapText(raw,limit=76){const result=[];for(const parag of String(raw||'').split(/\n/)){const words=parag.trim().split(/\s+/);let line='';for(const word of words){if(!word)continue;if((line+' '+word).trim().length>limit&&line){result.push(line);line=word}else line+=(line?' ':'')+word;}if(line)result.push(line);}return result}
 class PDF {
  constructor(){this.objects=[];this.pageRefs=[];this.fontReg=this.obj(bytes('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>'));this.fontBold=this.obj(bytes('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'));this.pagesRef=this.reserve();this.catalogRef=this.reserve()}
  reserve(){this.objects.push(null);return this.objects.length}
  obj(b){const n=this.reserve();this.objects[n-1]=b;return n}
  set(n,b){this.objects[n-1]=b}
  stream(body,prefix=''){return this.obj(concat([bytes(`<< ${prefix} /Length ${body.length} >>\nstream\n`),body,bytes('\nendstream')]))}
  page(commands,imageData){let imageRef=null;
   if(imageData){const {width,height,jpg}=imageData;imageRef=this.stream(jpg,`/Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode`)}
   const contentRef=this.stream(bytes(commands.join('\n')+'\n'));
   const res=`/Font << /F1 ${this.fontReg} 0 R /F2 ${this.fontBold} 0 R >>`+(imageRef?` /XObject << /Im1 ${imageRef} 0 R >>`:'');
   const page=this.obj(bytes(`<< /Type /Page /Parent ${this.pagesRef} 0 R /MediaBox [0 0 ${A4W} ${A4H}] /Resources << ${res} >> /Contents ${contentRef} 0 R >>`));this.pageRefs.push(page)
  }
  save(){this.set(this.pagesRef,bytes(`<< /Type /Pages /Count ${this.pageRefs.length} /Kids [${this.pageRefs.map(n=>n+' 0 R').join(' ')}] >>`));this.set(this.catalogRef,bytes(`<< /Type /Catalog /Pages ${this.pagesRef} 0 R >>`));
   const chunks=[bytes('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n')];const offs=[0];let len=chunks[0].length;
   for(let i=0;i<this.objects.length;i++){offs.push(len);const body=this.objects[i];if(!body)throw Error('Objeto PDF não preenchido');const ch=concat([bytes(`${i+1} 0 obj\n`),body,bytes('\nendobj\n')]);chunks.push(ch);len+=ch.length}
   const startXref=len;let table=`xref\n0 ${this.objects.length+1}\n0000000000 65535 f \n`;for(let i=1;i<offs.length;i++)table+=`${String(offs[i]).padStart(10,'0')} 00000 n \n`;
   table+=`trailer\n<< /Size ${this.objects.length+1} /Root ${this.catalogRef} 0 R >>\nstartxref\n${startXref}\n%%EOF\n`;chunks.push(bytes(table));return new Blob(chunks,{type:'application/pdf'})
  }
 }
 const bg=['0.025 0.078 0.13 rg',`0 0 ${A4W} ${A4H} re f`];
 function rect(cmd,x,y,w,h,color){cmd.push(color+' rg',`${x} ${y} ${w} ${h} re f`)}
 function line(cmd,x,y,x2,y2,color='0.25 0.74 0.81',w=1){cmd.push(`${color} RG`,`${w} w`,`${x} ${y} m ${x2} ${y2} l S`)}
 function tx(cmd,t,x,y,sz=11,bold=false,col='0.94 0.98 1') {cmd.push('BT',`${col} rg`,`/${bold?'F2':'F1'} ${sz} Tf`,`1 0 0 1 ${x} ${y} Tm`,`(${strPDF(t)}) Tj`,'ET')}
 function base(cmd,title,section,folio){cmd.push(...bg);rect(cmd,0,816,A4W,26,'0.065 0.21 0.29');
  tx(cmd,'ANATOMIA IMMERSIVE 3D',39,823,11,true,'0.98 0.8 0.44');
  tx(cmd,'SISTEMA GENITAL MASCULINO',39,787,12,true);tx(cmd,section,39,769,9,false,'0.55 0.86 0.94');
  line(cmd,39,759,A4W-39,759);line(cmd,39,57,A4W-39,57,'0.24 0.51 0.6',.7);
  tx(cmd,'UEM  /  DCM  /  MEDICINA      •      Roteiro prático',39,41,8,false,'0.68 0.82 0.89');tx(cmd,`Página ${folio}`,A4W-95,41,8,false,'0.8 0.85 0.9');
 }
 function putLong(cmd,str,x,y,limit=75,size=10,color='0.93 0.97 1',maxLines=999){const lines=wrapText(str,limit);for(let i=0;i<Math.min(lines.length,maxLines);i++)tx(cmd,lines[i],x,y-i*15,size,false,color);return lines.length}
 async function asJpeg(blob){
  let bitmap;
  try{bitmap=await createImageBitmap(blob,{imageOrientation:'from-image'})}catch{bitmap=await createImageBitmap(blob)}
  const maxDim=2600,scale=Math.min(1,maxDim/Math.max(bitmap.width,bitmap.height));
  const width=Math.max(1,Math.round(bitmap.width*scale)),height=Math.max(1,Math.round(bitmap.height*scale));
  const cv=document.createElement('canvas');cv.width=width;cv.height=height;let ctx=cv.getContext('2d',{alpha:false});ctx.fillStyle='#ffffff';ctx.fillRect(0,0,width,height);ctx.drawImage(bitmap,0,0,width,height);bitmap.close?.();
  const jpeg=await new Promise((res,rej)=>cv.toBlob(b=>b?res(b):rej(Error('Não foi possível preparar imagem')),'image/jpeg',.91));cv.width=0;cv.height=0;
  return {width,height,jpg:new Uint8Array(await jpeg.arrayBuffer())};
 }
 function summary(pdf,caption,entries){let page=1;let cmd=[];const sections=window.ROTEIRO;
  let y=724;const newPage=()=>{cmd=[];base(cmd,'',caption,page++);y=724};const flush=()=>{pdf.page(cmd);newPage()};newPage();
  for(const g of sections){
   if(y<110)flush();tx(cmd,g.title.toUpperCase(),40,y,11,true,'0.96 0.75 0.38');y-=22;
   for(const e of g.items){const a=entries.get(e.id)||{};const extra=a.imgCount?`  [${a.imgCount} imagem(ns)]`:'';const files=a.filesCount?`  [${a.filesCount} arquivo(s)]`:'';const lines=wrapText(`${e.number}  ${e.name}${extra}${files}`,83);
    for(const s of lines){if(y<96)flush();tx(cmd,s,48,y,9,false,'0.89 0.96 0.98');y-=15;}
   }y-=12;
  }
  pdf.page(cmd);return page-1
 }
 function notePages(pdf,e,notes,indexStart=1){let left=wrapText(notes,77);let number=0;while(left.length){number++;const c=[];base(c,'',e.section,indexStart+number-1);putLong(c,`${e.number}  ${e.name}`,40,737,68,13);tx(c,'ANOTAÇÕES',40,696,10,true,'0.97 0.79 0.42');const pg=left.splice(0,35);pg.forEach((line,i)=>tx(c,line,40,666-i*17,10));pdf.page(c);}return number}
 function photoPage(pdf,e,item,image,folio,index,total){const cmd=[];base(cmd,'',e.section,folio);const title=`${e.number}  ${e.name}`;const headLines=wrapText(title,62).slice(0,3);headLines.forEach((x,i)=>tx(cmd,x,40,737-i*17,13,i===0));
  tx(cmd,`Imagem ${index+1} de ${total}: ${safeText(item.name).slice(0,86)}`,41,676,9,false,'0.70 0.88 0.94');
  rect(cmd,40,105,515,556,'0.063 0.16 0.21');line(cmd,40,105,555,105,'0.28 0.54 0.62',.7);line(cmd,555,105,555,661,'0.28 0.54 0.62',.7);
  const usableW=497,usableH=538,scale=Math.min(usableW/image.width,usableH/image.height),w=(image.width*scale).toFixed(2),h=(image.height*scale).toFixed(2),x=(297.5-w/2).toFixed(2),y=(383-h/2).toFixed(2);
  cmd.push('q',`${w} 0 0 ${h} ${x} ${y} cm`,'/Im1 Do','Q');
  tx(cmd,'Imagem integral • proporção original mantida',40,82,8,false,'0.73 0.85 0.91');pdf.page(cmd,image)
 }
 function fileListingPages(pdf,entries,allFiles,initialFolio){const infos=allFiles.map(f=>{let en=entries.get(f.entryId);return {f,en}});if(!infos.length)return 0;let c=[],y=735,p=0;
  function newPage(){c=[];base(c,'','Arquivos anexados',initialFolio+p);p++;y=735;if(p===1){tx(c,'ARQUIVOS NÃO VISUAIS ANEXADOS',40,y,14,true,'0.97 0.77 0.40');y-=35;tx(c,'Apenas nomes e referências. Os originais são baixados pelo aplicativo.',40,y,9);y-=26}}
  function flush(){pdf.page(c);newPage()}
  newPage();
  for(const {f,en} of infos){let lines=wrapText(`${en?.number||''} ${en?.name||''} - ${f.name}`,78);for(const l of lines){if(y<110)flush();tx(c,l,42,y,9);y-=17;}y-=6}
  pdf.page(c);return p
 }
 async function generate(items,options={}){
  // items [{entry, media: [{id,name,blob,...}], files: [], notes}]
  const pdf=new PDF();let p=1;
  if(options.mode==='complete'){
   const m=new Map(items.map(a=>[a.entry.id,{imgCount:a.media.length,filesCount:a.files.length}]));p+=summary(pdf,'Roteiro completo',m);
  }
  let count=0;
  for(const data of items){
   const photos=data.media.filter(f=>f.blob?.type.startsWith('image/'));
   for(let i=0;i<photos.length;i++){
    try{const img=await asJpeg(photos[i].blob);photoPage(pdf,data.entry,photos[i],img,p++,i,photos.length);count++}
    catch(e){console.warn('Imagem não exportada',photos[i].name,e);options.onWarning?.(`Não foi possível converter ${photos[i].name}: ${e.message}`)}
    options.onProgress?.(count,options.expected||0)
   }
   if(data.notes?.trim()&&(options.mode==='complete'||photos.length))p+=notePages(pdf,data.entry,data.notes,p);
  }
  const attachmentList=items.flatMap(a=>a.files.map(f=>({...f,entryId:a.entry.id})));
  if(attachmentList.length)p+=fileListingPages(pdf,new Map(items.map(x=>[x.entry.id,x.entry])),attachmentList,p);
  if(pdf.pageRefs.length===0)throw Error('Não há conteúdo para gerar o PDF. Anexe imagens, marque estruturas ou escolha Roteiro completo.');
  return {blob:pdf.save(),pages:pdf.pageRefs.length,photos:count}
 }
 window.PDFExport={generate};
})();

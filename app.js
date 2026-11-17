(()=>{'use strict';
 const $=id=>document.getElementById(id),groups=window.ROTEIRO,entries=groups.flatMap(g=>g.items);
 const entryMap=new Map(entries.map(x=>[x.id,x]));
 let db=null,allAttachments=[],notes=new Map(),selectedStruct=new Set(),selectedImages=new Set(),urls=new Map(),openEntries=new Set(),rendered=false;
 const status=$('status'),exportMessage=$('exportMessage');
 const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const k='anatomia-imm-roteiro-v1-';
 try{selectedStruct=new Set(JSON.parse(localStorage.getItem(k+'selectedStruct')||'[]'));selectedImages=new Set(JSON.parse(localStorage.getItem(k+'selectedImages')||'[]'))}catch{}
 function saveSelections(){try{localStorage.setItem(k+'selectedStruct',JSON.stringify([...selectedStruct]));localStorage.setItem(k+'selectedImages',JSON.stringify([...selectedImages]))}catch{}}
 function inform(m,isError=false){status.textContent=m;status.style.color=isError?'#ffbbab':'#b8e9f5'}
 function msg(m,isError=false){exportMessage.textContent=m;exportMessage.style.color=isError?'#ffbab1':'#f8dda1'}
 function sprite(button,prefix,on){button.querySelector('img').src=`assets/${prefix}_${on?'ativo':'normal'}.webp`;button.setAttribute('aria-pressed',String(on));}
 function syncPrefs(){const reduced=localStorage.getItem(k+'reduced')==='true'||window.matchMedia('(prefers-reduced-motion: reduce)').matches;const access=localStorage.getItem(k+'accessible')==='true';document.body.classList.toggle('reduce-motion',reduced);document.body.classList.toggle('a11y',access);sprite($('motionBtn'),'reduzir',reduced);sprite($('accessBtn'),'acessivel',access)}
 function setIntro(show){$('intro').classList.toggle('hidden',!show);$('workspace').classList.toggle('hidden',show);if(!show){if(!rendered){rendered=true;render()}window.scrollTo(0,0)}}
 $('startBtn').addEventListener('click',()=>setIntro(false));$('skipBtn').addEventListener('click',()=>setIntro(false));$('homeBtn').addEventListener('click',()=>setIntro(true));
 $('motionBtn').addEventListener('click',()=>{const on=!document.body.classList.contains('reduce-motion');localStorage.setItem(k+'reduced',String(on));document.body.classList.toggle('reduce-motion',on);sprite($('motionBtn'),'reduzir',on)});
 $('accessBtn').addEventListener('click',()=>{const on=!document.body.classList.contains('a11y');localStorage.setItem(k+'accessible',String(on));document.body.classList.toggle('a11y',on);sprite($('accessBtn'),'acessivel',on)});
 try{syncPrefs()}catch{}
 function openDB(){return new Promise((resolve,reject)=>{if(!('indexedDB' in window))return reject(Error('IndexedDB indisponível'));let req=indexedDB.open('anatomia-immersive-roteiro',1);req.onupgradeneeded=()=>{const b=req.result;if(!b.objectStoreNames.contains('attachments')){const s=b.createObjectStore('attachments',{keyPath:'id'});s.createIndex('entryId','entryId',{unique:false})}if(!b.objectStoreNames.contains('notes'))b.createObjectStore('notes',{keyPath:'entryId'})};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
 function storeAction(storeName,method,argument){return new Promise((resolve,reject)=>{const tr=db.transaction(storeName,method==='getAll'?'readonly':'readwrite'),s=tr.objectStore(storeName);let req=(method==='getAll')?s.getAll():s[method](argument);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);tr.onerror=()=>reject(tr.error)})}
 function listEntryAttachments(id){return allAttachments.filter(a=>a.entryId===id)}
 function newId(){return typeof crypto.randomUUID==='function'?crypto.randomUUID():String(Date.now())+'-'+String(Math.random()).slice(2)}
 async function addFiles(entryId,list,kind){if(!db){inform('Armazenamento local indisponível. Publique o aplicativo via HTTPS ou localhost.',true);return}const files=[...list];if(!files.length)return;let added=0;for(const f of files){if(kind==='image'&&!f.type.startsWith('image/'))continue;const item={id:newId(),entryId,name:f.name||`Imagem ${Date.now()}`,blob:f,kind,addedAt:Date.now()};try{await storeAction('attachments','put',item);allAttachments.push(item);if(kind==='image')selectedImages.add(item.id);added++}catch(e){inform('Falha ao salvar '+f.name+': '+e.message,true);break}}
  saveSelections();if(added){refreshEntry(entryId);updateStats();inform(`${added} arquivo(s) incluído(s) e salvo(s) neste aparelho.`)}}
 async function deleteAttachment(a){if(!confirm(`Excluir definitivamente o anexo "${a.name}"?`))return;await storeAction('attachments','delete',a.id);allAttachments=allAttachments.filter(x=>x.id!==a.id);selectedImages.delete(a.id);if(urls.has(a.id)){URL.revokeObjectURL(urls.get(a.id));urls.delete(a.id)}saveSelections();refreshEntry(a.entryId);updateStats()}
 function blobUrl(item){if(!urls.has(item.id))urls.set(item.id,URL.createObjectURL(item.blob));return urls.get(item.id)}
 function download(blob,name){let url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.style.display='none';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),120000)}
 function showPreview(item){const area=$('previewContent');area.replaceChildren();const img=document.createElement('img');img.src=blobUrl(item);img.alt=item.name;area.appendChild(img);$('previewDialog').showModal()}
 $('closePreview').addEventListener('click',()=>$('previewDialog').close());$('previewDialog').addEventListener('click',e=>{if(e.target===$('previewDialog'))$('previewDialog').close()});
 function render(){
  const toc=$('toc'),wrap=$('sections'),filter=$('sectionFilter'),template=$('entryTemplate');toc.replaceChildren();wrap.replaceChildren();
  groups.forEach((g,gi)=>{
   const opt=document.createElement('option');opt.value=g.id;opt.textContent=g.title;filter.append(opt);
   const nav=document.createElement('a');nav.href='#'+g.id;nav.innerHTML=`<span>${String(gi+1).padStart(2,'0')}. ${escape(g.title)}</span><span>${g.items.length}</span>`;toc.append(nav);
   const sec=document.createElement('section');sec.className='section';sec.id=g.id;sec.dataset.section=g.id;
   sec.innerHTML=`<div class="section-heading"><h2>${String(gi+1).padStart(2,'0')}. ${escape(g.title)}</h2><small>${g.items.length} itens</small></div>`;
   const holder=document.createElement('div');holder.className='entries';
   for(const entry of g.items){const card=template.content.firstElementChild.cloneNode(true);card.dataset.entry=entry.id;card.dataset.search=`${entry.number} ${entry.name} ${entry.section}`.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    card.querySelector('.structure-num').textContent=entry.number;card.querySelector('.structure-name').textContent=entry.name;
    const ch=card.querySelector('.structure-check');ch.checked=selectedStruct.has(entry.id);ch.addEventListener('change',()=>{ch.checked?selectedStruct.add(entry.id):selectedStruct.delete(entry.id);saveSelections();updateStats()});
    const btn=card.querySelector('.entry-open'),body=card.querySelector('.entry-body');btn.setAttribute('aria-label',`Abrir ${entry.name}`);btn.addEventListener('click',()=>{const show=body.hidden;body.hidden=!show;btn.setAttribute('aria-expanded',String(show));show?openEntries.add(entry.id):openEntries.delete(entry.id);if(show)renderMedia(entry.id,card)});
    const cam=card.querySelector('.camera-input'),im=card.querySelector('.images-input'),file=card.querySelector('.files-input');cam.addEventListener('change',async e=>{await addFiles(entry.id,e.target.files,'image');e.target.value=''}) ;im.addEventListener('change',async e=>{await addFiles(entry.id,e.target.files,'image');e.target.value=''}) ;file.addEventListener('change',async e=>{await addFiles(entry.id,e.target.files,'file');e.target.value=''}) ;
    const notesBox=card.querySelector('.notes');notesBox.value=notes.get(entry.id)||'';let debounce;notesBox.addEventListener('input',()=>{clearTimeout(debounce);const val=notesBox.value;notes.set(entry.id,val);debounce=setTimeout(async()=>{if(db)await storeAction('notes','put',{entryId:entry.id,value:val});inform('Anotação salva automaticamente.')},400)});
    holder.append(card);
   }sec.append(holder);wrap.append(sec)
  });refreshCounts();updateStats();applyFilter()
 }
 function refreshCounts(){for(const e of entries){const card=document.querySelector(`[data-entry="${e.id}"]`);if(!card)continue;const at=listEntryAttachments(e.id);const pics=at.filter(a=>a.kind==='image').length,other=at.filter(a=>a.kind==='file').length;card.querySelector('.entry-count').textContent=pics||other?`${pics} 📷  ${other} 📎`:''}}
 function refreshEntry(id){const card=document.querySelector(`[data-entry="${id}"]`);if(!card)return;refreshCounts();if(!card.querySelector('.entry-body').hidden)renderMedia(id,card)}
 function renderMedia(entryId,card){const grid=card.querySelector('.media-grid'),files=card.querySelector('.attachments');grid.replaceChildren();files.replaceChildren();const items=listEntryAttachments(entryId);
  for(const item of items){if(item.kind==='image'){
   const tile=document.createElement('div');tile.className='media-card';const pic=document.createElement('img');pic.src=blobUrl(item);pic.loading='lazy';pic.alt='Visualizar: '+item.name;pic.addEventListener('click',()=>showPreview(item));tile.append(pic);
   const meta=document.createElement('div');meta.className='media-meta';meta.innerHTML=`<div class="media-title" title="${escape(item.name)}">${escape(item.name)}</div>`;
   const acts=document.createElement('div');acts.className='media-actions';const lab=document.createElement('label');lab.className='media-check';const ch=document.createElement('input');ch.type='checkbox';ch.checked=selectedImages.has(item.id);ch.setAttribute('aria-label','Incluir imagem no PDF: '+item.name);ch.addEventListener('change',()=>{ch.checked?selectedImages.add(item.id):selectedImages.delete(item.id);saveSelections();updateStats()});lab.append(ch,document.createTextNode('No PDF'));acts.append(lab);
   const dl=document.createElement('button');dl.className='mini-btn';dl.type='button';dl.textContent='↓';dl.title='Baixar imagem';dl.addEventListener('click',()=>download(item.blob,item.name));acts.append(dl);
   const del=document.createElement('button');del.className='mini-btn danger';del.type='button';del.textContent='✕';del.title='Excluir imagem';del.addEventListener('click',()=>deleteAttachment(item));acts.append(del);
   meta.append(acts);tile.append(meta);grid.append(tile)
  }else{
   const row=document.createElement('div');row.className='file-line';const name=document.createElement('span');name.textContent='📎 '+item.name+' ('+Math.ceil(item.blob.size/1024)+' KB)';const ctr=document.createElement('div');ctr.className='file-buttons';const dl=document.createElement('button');dl.className='mini-btn';dl.textContent='Baixar';dl.addEventListener('click',()=>download(item.blob,item.name));const del=document.createElement('button');del.className='mini-btn danger';del.textContent='Excluir';del.addEventListener('click',()=>deleteAttachment(item));ctr.append(dl,del);row.append(name,ctr);files.append(row)
  }}
 }
 function updateStats(){const pictures=allAttachments.filter(a=>a.kind==='image');$('totalStructs').textContent=entries.length+' estruturas';$('selectedStructs').textContent=selectedStruct.size+' estruturas marcadas';$('totalImages').textContent=pictures.length+' imagens';$('selectedImages').textContent=pictures.filter(a=>selectedImages.has(a.id)).length+' imagens marcadas';$('totalFiles').textContent=allAttachments.filter(a=>a.kind==='file').length+' arquivos';}
 $('search').addEventListener('input',applyFilter);$('sectionFilter').addEventListener('change',applyFilter);
 function applyFilter(){const q=$('search').value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim(),chosen=$('sectionFilter').value;for(const g of groups){const sec=$(g.id);if(!sec)continue;let found=0;for(const card of sec.querySelectorAll('.entry')){const show=(!q||card.dataset.search.includes(q))&&(!chosen||g.id===chosen);card.hidden=!show;if(show)found++}sec.hidden=!found}}
 $('selectAll').onclick=()=>{entries.forEach(e=>selectedStruct.add(e.id));document.querySelectorAll('.structure-check').forEach(e=>e.checked=true);saveSelections();updateStats()};
 $('selectNone').onclick=()=>{selectedStruct.clear();document.querySelectorAll('.structure-check').forEach(e=>e.checked=false);saveSelections();updateStats()};
 $('expandAll').onclick=()=>document.querySelectorAll('.entry:not([hidden]) .entry-open[aria-expanded="false"]').forEach(b=>b.click());
 $('collapseAll').onclick=()=>document.querySelectorAll('.entry-open[aria-expanded="true"]').forEach(b=>b.click());
 $('markAllImages').onclick=()=>{allAttachments.filter(a=>a.kind==='image').forEach(a=>selectedImages.add(a.id));saveSelections();document.querySelectorAll('.media-check input').forEach(x=>x.checked=true);updateStats()};
 $('unmarkAllImages').onclick=()=>{selectedImages.clear();saveSelections();document.querySelectorAll('.media-check input').forEach(x=>x.checked=false);updateStats()};
 async function exportPDF(){const mode=$('exportMode').value;const btn=$('exportBtn');const items=[];let n=0;
  for(const e of entries){const at=listEntryAttachments(e.id);let photos=at.filter(x=>x.kind==='image');const files=at.filter(x=>x.kind==='file');if(mode==='marked')photos=photos.filter(a=>selectedImages.has(a.id));if(mode==='structure'&&!selectedStruct.has(e.id))continue;
   if(mode==='marked'&&!photos.length)continue;if(mode==='all'&&!photos.length)continue;
   items.push({entry:e,media:photos,files,notes:notes.get(e.id)||''});n+=photos.length
  }
  if((mode==='all'||mode==='marked')&&!n){msg('Não há imagens nesse modo. Anexe fotografias ou selecione "Roteiro completo".',true);return}
  if(mode==='structure'&&selectedStruct.size===0){msg('Marque ao menos uma estrutura para exportar.',true);return}
  if(mode==='structure'&&!n){msg('As estruturas escolhidas não têm imagens. Use "Roteiro completo" para imprimir nomes sem fotografias.',true);return}
  btn.disabled=true;btn.textContent='Preparando PDF...';msg('Organizando '+n+' imagem(ns) sem cortes. Não feche esta aba.');
  try{const out=await window.PDFExport.generate(items,{mode,expected:n,onProgress:(x,total)=>{msg(`Preparando PDF: ${x} de ${total} imagem(ns).`);},onWarning:w=>console.warn(w)});
   const f=`ANATOMIA_IMMERSIVE_3D_${mode==='complete'?'ROTEIRO_COMPLETO':mode==='marked'?'IMAGENS_MARCADAS':mode==='structure'?'ESTRUTURAS_SELECIONADAS':'TODAS_AS_IMAGENS'}.pdf`;
   download(out.blob,f);msg(`PDF pronto: ${out.pages} página(s), ${out.photos} imagem(ns). Download iniciado. Imagens completas, sem recortes.`)
  }catch(e){console.error(e);msg('Não foi possível gerar o PDF: '+e.message,true)}finally{btn.disabled=false;btn.textContent='⬇ Gerar e baixar PDF'}
 }
 $('exportBtn').addEventListener('click',exportPDF);
 function blobBase64(blob){return new Promise((resolve,reject)=>{const fr=new FileReader();fr.onload=()=>resolve(String(fr.result).split(',')[1]);fr.onerror=()=>reject(fr.error);fr.readAsDataURL(blob)})}
 $('backupBtn').onclick=async()=>{const btn=$('backupBtn');btn.disabled=true;try{msg('Preparando backup. Pode ficar grande se houver muitas fotos.');const attachments=[];for(let i=0;i<allAttachments.length;i++){const a=allAttachments[i];attachments.push({id:a.id,entryId:a.entryId,kind:a.kind,name:a.name,addedAt:a.addedAt,mime:a.blob.type,base64:await blobBase64(a.blob)})}
  const data={version:1,created:new Date().toISOString(),notes:Object.fromEntries(notes),selectedStruct:[...selectedStruct],selectedImages:[...selectedImages],attachments};download(new Blob([JSON.stringify(data)],{type:'application/json'}),'ANATOMIA_IMMERSIVE_BACKUP.json');msg('Backup gerado: '+attachments.length+' arquivo(s) incluído(s).')
 }catch(e){msg('Falha no backup: '+e.message,true)}finally{btn.disabled=false}};
 $('restoreBtn').onclick=()=>$('restoreInput').click();
 $('restoreInput').onchange=async(e)=>{const file=e.target.files?.[0];if(!file)return;if(!confirm('Restaurar os anexos do backup? Arquivos com mesmo identificador serão atualizados.'))return;
  try{const data=JSON.parse(await file.text());if(data.version!==1||!Array.isArray(data.attachments))throw Error('Formato de backup não reconhecido');let restored=0;
   for(const a of data.attachments){if(!entryMap.has(a.entryId))continue;const bin=atob(a.base64||'');const arr=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)arr[i]=bin.charCodeAt(i);await storeAction('attachments','put',{id:a.id,entryId:a.entryId,name:a.name,kind:a.kind,addedAt:a.addedAt,blob:new Blob([arr],{type:a.mime||'application/octet-stream'})});restored++}
   for(const [id,value] of Object.entries(data.notes||{})){if(entryMap.has(id))await storeAction('notes','put',{entryId:id,value})}
   if(Array.isArray(data.selectedStruct))selectedStruct=new Set([...selectedStruct,...data.selectedStruct].filter(x=>entryMap.has(x)));if(Array.isArray(data.selectedImages))selectedImages=new Set([...selectedImages,...data.selectedImages]);saveSelections();
   allAttachments=await storeAction('attachments','getAll');notes=new Map((await storeAction('notes','getAll')).map(o=>[o.entryId,o.value]));for(const url of urls.values())URL.revokeObjectURL(url);urls.clear();render();inform(`Backup restaurado: ${restored} arquivo(s).`)
  }catch(err){msg('Falha ao restaurar backup: '+err.message,true)}e.target.value=''
 };
 async function startup(){try{db=await openDB();allAttachments=await storeAction('attachments','getAll');notes=new Map((await storeAction('notes','getAll')).map(x=>[x.entryId,x.value]));inform('Anexos salvos localmente no dispositivo. Faça backup regularmente.');if(rendered)render()}catch(e){inform('Aviso: armazenamento de anexos indisponível. Use HTTPS (GitHub Pages) ou localhost. '+e.message,true)}
  if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(e=>console.warn('PWA:',e))
 }
 startup();
})();

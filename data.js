// Nomenclatura preservada do Roteiro Prático - Sistema Genital Masculino (UEM/DCM/Medicina).
// A numeração original reinicia entre diferentes blocos; as chaves internas são independentes.
window.ROTEIRO = [
 {id:'escroto',title:'Escroto (tegumento)',items:[
 ['1','Pele do escroto (Rafe do escroto)'],['2','Túnica de Dartos'],['3','Sem identificação no roteiro original']
 ]},
 {id:'testiculo',title:'Testículo',items:[
 ['4','Polo superior'],['5','Polo inferior'],['6','Face lateral'],['7','Face medial'],
 ['8','Margem anterior'],['9','Margem posterior'],
 ['10','Lâmina visceral da túnica vaginal do testículo'],['11','Lâmina parietal da túnica vaginal do testículo'],
 ['12','Ligamento superior do epidídimo'],['13','Ligamento inferior do epidídimo'],['14','Seio do epidídimo'],
 ['15','Cabeça do epidídimo'],['16','Corpo do epidídimo'],['17','Cauda do epidídimo']
 ]},
 {id:'funiculo',title:'Revestimento do testículo e constituintes do funículo espermático',items:[
 ['18','Fáscia espermática interna'],['19','Fáscia cremastérica'],['20','Músculo cremaster'],['21','Fáscia espermática externa']
 ]},
 {id:'deferente',title:'Ducto deferente',items:[
 ['1','Parte escrotal'],['2','Parte funicular'],['3','(Parte inguinal)'],['4','Parte pélvica'],['5','Ampola do ducto deferente']
 ]},
 {id:'seminal',title:'Glândula seminal',items:[['—','Glândula seminal'],['*','Ducto ejaculatório']]},
 {id:'prostata',title:'Próstata',items:[
 ['6','Base da próstata'],['7','Ápice da próstata'],['8','Face inferior da próstata'],
 ['9','Face posterior da próstata'],['10','Face ínfero-lateral da próstata']
 ]},
 {id:'uretra',title:'Uretra prostática',items:[
 ['11','Crista uretral'],['12','Colículo seminal'],['13','Utrículo prostático'],['14','Seio prostático']
 ]},
 {id:'bulbouretral',title:'Glândula bulbouretral',items:[['—','Glândula bulbouretral']]},
 {id:'penis',title:'Pênis',items:[
 ['16','Raiz do pênis'],['17','Ramos do pênis'],['18','Bulbo do pênis'],['19','Corpo do pênis'],
 ['20','Rafe do pênis'],['21','Dorso do pênis'],['22','Corpos cavernosos do pênis'],['23','Corpo esponjoso do pênis'],
 ['24','Glande do pênis'],['25','Coroa da glande'],['26','Colo da glande'],
 ['27','Prepúcio do pênis'],['28','Frênulo do prepúcio']
 ]},
 {id:'corte',title:'Corte transversal do pênis',items:[
 ['29','Pele do pênis'],['30','Tela subcutânea do pênis'],
 ['31','Túnica albugínea dos corpos cavernosos (fáscia profunda do pênis)'],
 ['32','Septo do pênis'],
 ['33','Túnica albugínea do corpo esponjoso (fáscia profunda do pênis)']
 ]}
].map(g=>({...g,items:g.items.map(([number,name],i)=>({id:`${g.id}-${i+1}`,number,name,sectionId:g.id,section:g.title}))}));

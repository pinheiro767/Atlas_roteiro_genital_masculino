# ANATOMIA IMMERSIVE 3D — Sistema Genital Masculino

Aplicativo web progressivo (PWA) pronto para GitHub Pages, HTTPS ou localhost. Contém **capa** e **sprites** fornecidos pela usuária, e a nomenclatura do roteiro prático UEM/DCM/Medicina.

## Instalar / publicar

1. Extraia todos os arquivos do ZIP, **sem alterar a estrutura de pastas**.
2. Envie `index.html`, `style.css`, `data.js`, `app.js`, `pdf-export.js`, `sw.js`, `manifest.webmanifest` e a pasta `assets` para a raiz de um repositório GitHub.
3. Em `Settings > Pages`, selecione **Deploy from a branch**, branch `main`, diretório `/ (root)`.
4. Abra a URL HTTPS do Pages no celular. No navegador Android/Chrome, toque no menu e escolha **Instalar app**.
5. Para testar no computador, use `python -m http.server 8000` dentro da pasta e abra `http://localhost:8000`.

## Uso

- Abertura com capa original e botões Iniciar, Pular, Reduzir animações e Modo acessível.
- Em cada seção/estrutura, toque no nome; use **Tirar foto**, **Adicionar imagens** (seleção múltipla) ou **Adicionar arquivos** (qualquer extensão, seleção múltipla).
- As fotos ficam associadas à estrutura; marque **No PDF** em cada imagem desejada. Os arquivos permanecem disponíveis para baixar.
- Selecione estruturas usando as caixas à esquerda dos nomes. Há funções **Selecionar todas** e **Limpar seleção**.
- Na parte inferior, configure o PDF: **Todas as imagens**, **Somente imagens marcadas**, **Imagens das estruturas selecionadas**, ou **Roteiro completo**.
- Clique **Gerar e baixar PDF**. O navegador gera um PDF diretamente sem enviar imagens para servidor. Cada foto ocupa uma página A4 e é **reduzida proporcionalmente para caber por inteiro, sem recortes**; fotos panorâmicas, verticais e horizontais são preservadas.
- Em **Roteiro completo**, as seções e nomes originais também são listados nas páginas iniciais.
- Anexos que não são imagens (PDF, DOCX etc.) ficam listados **pelo nome** no PDF; **seu conteúdo não é incorporado**. Baixe esses originais diretamente no app.

## Armazenamento

- Imagens, arquivos e anotações ficam salvos em **IndexedDB do próprio navegador/aparelho**. Eles **não são sincronizados automaticamente** entre celulares e computadores.
- Use **Salvar backup dos anexos** para baixar `ANATOMIA_IMMERSIVE_BACKUP.json` e **Restaurar backup** quando necessário. **Atenção: arquivos grandes geram backups grandes.**
- Limpar dados do navegador, trocar de endereço ou usar navegação privada pode apagar os anexos. Faça backup antes.
- Os arquivos da pasta `assets` são estáticos e podem funcionar offline após cache do PWA; os anexos IndexedDB também ficam locais.

## Precisão da fonte

Nomes e números foram recuperados do PDF **Roteiro_Pratico_Sistema_Genital_Masculino_UEM_Sem_Rodape.pdf**, incluindo a numeração reiniciada por seção. O item 3 do Escroto aparece sem identificação. **Glândula seminal** e **Glândula bulbouretral** são cabeçalhos no original e foram adicionadas como entradas sem numeração para permitir anexos. Foram normalizadas apenas as abreviaturas "Lig." e "M." para "Ligamento" e "Músculo".

## Limitações

- A capa é imagem estática; **não finge interação 3D**. A incorporação de um modelo GLB científico é um módulo independente, ainda não incluído neste ZIP.
- A aplicação gera o PDF sem serviço externo. Imagens são preparadas em JPEG em até 2600 px no maior lado, por economia de memória. Mesmo assim, o contorno completo da imagem é preservado.
- Muitos arquivos de grande tamanho podem atingir o limite de armazenamento do navegador; a exportação de PDFs muito extensos depende da memória do aparelho.

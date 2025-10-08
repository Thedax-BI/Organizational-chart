(() => {
  const SAMPLE = `Presidencia -> Diretor 01 -> Produção 01 -> Coordenacao 01 -> Venoc -> Liderança 01 -> Colaborador 01
Presidencia -> Diretor 01 -> Produção 01 -> Coordenacao 01 -> Venoc -> Liderança 01 -> Colaborador 02
Presidencia -> Diretor 01 -> Produção 01 -> Coordenacao 01 -> Venoc -> Liderança 01 -> Colaborador 03
Presidencia -> Diretor 01 -> Produção 01 -> Coordenacao 01 -> Venoc -> Liderança 01 -> Colaborador 04
Presidencia -> Diretor 01 -> Produção 01 -> Coordenacao 01 -> Venoc -> Liderança 01 -> Colaborador 05
Presidencia -> Diretor 01 -> Produção 01 -> Coordenacao 01 ->  Manutenção -> Liderança 01 -> Colaborador 01 
Presidencia -> Diretor 01 -> Produção 01 -> Coordenacao 01 ->  Manutenção -> Liderança 01 -> Colaborador 02
Presidencia -> Diretor 01 -> Produção 01 -> Coordenacao 01 ->  Corte / Dobradeira -> Liderança 01 -> Colaborador 01
Presidencia -> Diretor 01 -> Produção 01 -> Coordenacao 01 ->  Corte / Dobradeira -> Liderança 01 -> Colaborador 02
Presidencia -> Diretor 01 -> Produção 01 -> Coordenacao 01 ->  Corte / Dobradeira -> Liderança 01 -> Colaborador 03
Presidencia -> Diretor 01 -> Produção 02 -> Coordenacao 07 ->  Grelha -> Liderança 02 -> Colaborador 01
Presidencia -> Diretor 01 -> Produção 02 -> Coordenacao 07 ->  Grelha -> Liderança 02 -> Colaborador 02
Presidencia -> Diretor 01 -> Produção 02 -> Coordenacao 01 ->  Difusor -> Liderança 02 -> Colaborador 01 
Presidencia -> Diretor 01 -> Produção 02 -> Coordenacao 01 ->  Difusor -> Liderança 02 -> Colaborador 02
Presidencia -> Diretor 01 -> Produção 02 -> Coordenacao 01 ->  Registro -> Liderança 02 -> Colaborador 01 
Presidencia -> Diretor 01 -> Produção 02 -> Coordenacao 01 ->  Registro -> Liderança 02 -> Colaborador 02
Presidencia -> Diretor 01 -> Produção 02 -> Coordenacao 01 ->  Caixa Plenum -> Liderança 02 -> Colaborador 01 
Presidencia -> Diretor 01 -> Produção 02 -> Coordenacao 01 ->  Caixa Plenum -> Liderança 02 -> Colaborador 02
Presidencia -> Diretor 01 -> Produção 02 -> Coordenacao 01 ->  Solda -> Liderança 03 -> Colaborador 01 
Presidencia -> Diretor 01 -> Produção 02 -> Coordenacao 01 ->  Solda -> Liderança 03 -> Colaborador 02 
Presidencia -> Diretor 01 -> Produção 02 -> Coordenacao 01 ->  Solda -> Liderança 03 -> Colaborador 03
Presidencia -> Diretor 01 -> Produção 02 -> Coordenacao 01 ->  Almoxarifado -> Liderança 03 -> Colaborador 01 
Presidencia -> Diretor 01 -> Produção 02 -> Coordenacao 01 ->  Almoxarifado -> Liderança 03 -> Colaborador 02
Presidencia -> Diretor 01 -> Produção 02 -> Coordenacao 01 ->  Compras -> Liderança 03 -> Colaborador 01 
Presidencia -> Diretor 01 -> Produção 02 -> Coordenacao 01 ->  Compras -> Liderança 03 -> Colaborador 02
Presidencia -> Diretor 01 -> Produção 02 -> Coordenacao 01 ->  PPCP -> Liderança 03 -> Colaborador 01 
Presidencia -> Diretor 01 -> Produção 02 -> Coordenacao 01 ->  PPCP -> Liderança 03 -> Colaborador 02
Presidencia -> Diretor 02 -> Comercial -> Coordenacao 01 ->  Vendas -> Liderança 01 -> Colaborador 01
Presidencia -> Diretor 02 -> Comercial -> Coordenacao 01 ->  Vendas -> Liderança 01 -> Colaborador 02
Presidencia -> Diretor 02 -> Comercial -> Coordenacao 01 ->  Estoque / Expedição -> Liderança 02 -> Colaborador 01
Presidencia -> Diretor 02 -> Comercial -> Coordenacao 01 ->  Estoque / Expedição -> Liderança 02 -> Colaborador 02
Presidencia -> Diretor 03 -> Administrativo -> Coordenacao 01 ->  Financeiro -> Liderança 01 -> Colaborador 01
Presidencia -> Diretor 03 -> Administrativo -> Coordenacao 01 ->  Financeiro -> Liderança 01 -> Colaborador 02
Presidencia -> Diretor 03 -> Administrativo -> Coordenacao 01 ->  Financeiro -> Liderança 01 -> Colaborador 03
Presidencia -> Diretor 03 -> Administrativo -> Coordenacao 01 ->  Fiscal -> Liderança 01 -> Colaborador 01
Presidencia -> Diretor 03 -> Administrativo -> Coordenacao 01 ->  Fiscal -> Liderança 01 -> Colaborador 02
Presidencia -> Diretor 03 -> Administrativo -> Coordenacao 01 ->  Contábil -> Liderança 01 -> Colaborador 01
Presidencia -> Diretor 03 -> Administrativo -> Coordenacao 01 ->  Contábil -> Liderança 01 -> Colaborador 02
Presidencia -> Diretor 03 -> Administrativo -> Coordenacao 01 ->  RH -> Liderança 01 -> Colaborador 01
Presidencia -> Diretor 03 -> Administrativo -> Coordenacao 01 ->  RH -> Liderança 01 -> Colaborador 02
Presidencia -> Diretor 03 -> Administrativo -> Coordenacao 01 ->  RH -> Liderança 01 -> Colaborador 03
Presidencia -> Diretor 03 -> Administrativo -> Coordenacao 01 ->  RH -> Liderança 01 -> Colaborador 04`;
  // =========================
  // Helpers
  // =========================
  const $  = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  function normalizeName(s){ return (s??"").toString().trim().replace(/\s+/g," ").toLowerCase(); }
  function getOrSetDisplay(map, raw){
    const k = normalizeName(raw);
    if(!map.has(k)) map.set(k,(raw??"").toString().trim());
    return { key:k, display: map.get(k) };
  }
  function escapeXML(s){
    return (s??"").toString().replace(/&/g,"&amp;").replace(/</g,"&lt;")
      .replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");
  }
  function hashCode(str){ let h=0; for(let i=0;i<str.length;i++){ h=((h<<5)-h)+str.charCodeAt(i); h|=0; } return h; }

  // =========================
  // Estado
  // =========================
  let ROWS = []; // {presidencia,diretoria,departamento,coordenacao,subarea,lideranca,colaborador}

  // Cores
  const directorColorMap = new Map(); // key(normalized) -> {display,color}
  const leadColorMap     = new Map(); // key(normalized) -> {display,color}
  const DEFAULT_DIRECTOR_COLORS = ["#4C6FFF","#E07A5F","#3A86FF","#8AC926","#FF8066","#7B61FF","#FFB703","#2A9D8F","#E76F51","#6A4C93","#118AB2","#EF476F"];
  let directorColorCursor = 0;
  function pickNextDirectorColor(){ const c=DEFAULT_DIRECTOR_COLORS[directorColorCursor%DEFAULT_DIRECTOR_COLORS.length]; directorColorCursor++; return c; }
  function ensureDirectorColor(raw){
    const key = normalizeName(raw||"(sem diretoria)");
    if(!directorColorMap.has(key)){
      directorColorMap.set(key, { display:(raw||"(sem diretoria)").trim(), color: pickNextDirectorColor() });
    }
  }
  function setDirectorColor(raw, color){
    const key = normalizeName(raw||"(sem diretoria)");
    const cur = directorColorMap.get(key) || { display:(raw||"(sem diretoria)").trim(), color };
    directorColorMap.set(key, { display:cur.display, color });
  }
  function getDirectorColor(raw){
    const key = normalizeName(raw||"(sem diretoria)");
    return directorColorMap.get(key)?.color || "#4C6FFF";
  }
  function ensureLeadColor(raw){
    const key = normalizeName(raw||"");
    if(!key) return;
    if(!leadColorMap.has(key)){
      const h = Math.abs(hashCode(key)) % 360;
      leadColorMap.set(key, { display:(raw||"").trim(), color:`hsl(${h},60%,55%)` });
    }
  }
  function setLeadColor(raw, color){
    const key = normalizeName(raw||"");
    if(!key) return;
    const cur = leadColorMap.get(key) || { display:(raw||"").trim(), color };
    leadColorMap.set(key, { display:cur.display, color });
  }
  function getLeadColor(raw){
    const key = normalizeName(raw||"");
    return leadColorMap.get(key)?.color || "#5E6B7E";
  }

  // =========================
  // Parser (6 ou 7 níveis)
  // =========================
  function parseLineToRecord(line){
    if(!line || !line.trim()) return null;
    const parts = line.split("->").map(s=>s.trim());
    while(parts.length < 7) parts.push("");
    const [pres,dir,dept,coord,sub,lead,colab] = parts.slice(0,7);
    return { presidencia:pres, diretoria:dir, departamento:dept, coordenacao:coord, subarea:sub, lideranca:lead, colaborador:colab };
  }
  function parseTextarea(){
    const lines = ($("#rawInput")?.value||"").split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
    const out = [];
    for(const l of lines){ const r = parseLineToRecord(l); if(r) out.push(r); }
    return out;
  }

  // =========================
  // Tabela editável
  // =========================
  const COLS = [
    { key:"presidencia", label:"Presidência" },
    { key:"diretoria",   label:"Diretoria" },
    { key:"departamento",label:"Departamento" },
    { key:"coordenacao", label:"Coordenação" },
    { key:"subarea",     label:"Subárea" },
    { key:"lideranca",   label:"Liderança" },
    { key:"colaborador", label:"Colaborador" }
  ];

  function rebuildTable(){
    const tbody = $("#dataTable tbody"); if(!tbody) return;
    tbody.innerHTML="";
    ROWS.forEach((row, idx)=>{
      const tr = document.createElement("tr");

      // checkbox
      const tdC = document.createElement("td");
      tdC.style.textAlign="center";
      const cb = document.createElement("input");
      cb.type="checkbox"; cb.className="row-select"; cb.dataset.index=String(idx);
      tdC.appendChild(cb); tr.appendChild(tdC);

      // cells
      for(const col of COLS){
        const td = document.createElement("td");
        const inp = document.createElement("input");
        inp.type="text"; inp.value = row[col.key]??"";
        inp.addEventListener("input", ()=>{
          row[col.key]=inp.value;
          if(col.key==="diretoria") ensureDirectorColor(inp.value);
          if(col.key==="lideranca") ensureLeadColor(inp.value);
          renderColorPanels();
        });
        td.appendChild(inp);
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    });
    if($("#rowCounter")) $("#rowCounter").textContent = `${ROWS.length} linha(s)`;
  }

  function addRow(r = { presidencia:"",diretoria:"",departamento:"",coordenacao:"",subarea:"",lideranca:"",colaborador:"" }){
    ROWS.push(r);
    rebuildTable();
  }

  function deleteSelected(){
    const marks = $$(".row-select").filter(cb=>cb.checked).map(cb=>Number(cb.dataset.index));
    if(!marks.length) return;
    marks.sort((a,b)=>b-a).forEach(i=> ROWS.splice(i,1));
    rebuildTable();
    $("#checkAll") && ($("#checkAll").checked=false);
  }

  // Select all
  function setSelectAll(on){
    $$(".row-select").forEach(cb=>cb.checked=on);
  }

  // =========================
  // CSV
  // =========================
  function csvEscape(v){
    const s=(v??"").toString();
    return /[",\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s;
  }
  function exportCSV(){
    const header = COLS.map(c=>c.label).join(",");
    const body = ROWS.map(r=> COLS.map(c=>csvEscape(r[c.key]??"")).join(",")).join("\n");
    const csv = header + "\n" + body;
    const blob = new Blob([csv],{type:"text/csv;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href=url; a.download="organograma.csv";
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }
  function parseCSVLine(line){
    const cols=[]; let cur=""; let inQ=false;
    for(let i=0;i<line.length;i++){
      const ch=line[i];
      if(inQ){
        if(ch === '"'){
          if(line[i+1] === '"'){ cur+='"'; i++; }
          else inQ=false;
        } else cur+=ch;
      } else {
        if(ch === '"') inQ=true;
        else if(ch === ','){ cols.push(cur); cur=""; }
        else cur+=ch;
      }
    }
    cols.push(cur);
    const obj={}; COLS.forEach((c,i)=> obj[c.key]=(cols[i]??"").trim());
    return obj;
  }
  function importCSV(file){
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result||"");
      const lines = text.split(/\r?\n/).filter(Boolean);
      if(!lines.length) return;
      const data = lines.slice(1).map(parseCSVLine).filter(Boolean);
      ROWS = data;
      // reconstruir cores
      directorColorMap.clear(); leadColorMap.clear(); directorColorCursor=0;
      ROWS.forEach(r=>{ ensureDirectorColor(r.diretoria); ensureLeadColor(r.lideranca); });
      rebuildTable();
      renderColorPanels();
      enableSvgButtons(false);
      $("#svgContainer") && ($("#svgContainer").innerHTML="");
    };
    reader.readAsText(file,"utf-8");
  }

  // =========================
  // Painéis de Cores
  // =========================
  function renderColorPanels(){
    // Diretoria
    const dirPanel = $("#directorColors");
    if(dirPanel){
      dirPanel.innerHTML="";
      const entries = Array.from(directorColorMap.entries()).sort((a,b)=>a[1].display.localeCompare(b[1].display,"pt-BR"));
      for(const [,info] of entries){
        const row = document.createElement("div"); row.className="row"; row.style.gap="8px"; row.style.alignItems="center";
        const span = document.createElement("span"); span.textContent = info.display || "(sem diretoria)";
        span.style.minWidth="180px";
        const inp = document.createElement("input"); inp.type="color"; inp.value=info.color;
        inp.addEventListener("input", ()=> setDirectorColor(info.display, inp.value));
        row.append(span, inp); dirPanel.appendChild(row);
      }
    }
    // Liderança
    const leadPanel = $("#leadColors");
    if(leadPanel){
      leadPanel.innerHTML="";
      const entries = Array.from(leadColorMap.entries()).sort((a,b)=>a[1].display.localeCompare(b[1].display,"pt-BR"));
      for(const [,info] of entries){
        const row = document.createElement("div"); row.className="row"; row.style.gap="8px"; row.style.alignItems="center";
        const span = document.createElement("span"); span.textContent = info.display || "(sem liderança)";
        span.style.minWidth="180px";
        const inp = document.createElement("input"); inp.type="color"; inp.value=info.color;
        inp.addEventListener("input", ()=> setLeadColor(info.display, inp.value));
        row.append(span, inp); leadPanel.appendChild(row);
      }
    }
  }

  // =========================
  // Fusão por Diretoria (árvore)
  // =========================
  function buildOrgTree(rows){
    const tree = new Map(); // presKey -> { name, diretorias: Map }
    const presDisplay = new Map();
    const dirDisplayByPres = new Map();

    for(const r of rows){
      const {key:presKey, display:presName} = getOrSetDisplay(presDisplay, r.presidencia || "(sem presidência)");
      if(!tree.has(presKey)) tree.set(presKey, { name: presName, diretorias: new Map() });

      if(!dirDisplayByPres.has(presKey)) dirDisplayByPres.set(presKey, new Map());
      const dMap = dirDisplayByPres.get(presKey);
      const {key:dirKey, display:dirName} = getOrSetDisplay(dMap, r.diretoria || "(sem diretoria)");

      const presNode = tree.get(presKey);
      if(!presNode.diretorias.has(dirKey)){
        presNode.diretorias.set(dirKey, { name: dirName, departamentos: new Map() });
      }
      const dirNode = presNode.diretorias.get(dirKey);

      const deptKey = normalizeName(r.departamento || "(sem departamento)");
      if(!dirNode.departamentos.has(deptKey)){
        dirNode.departamentos.set(deptKey, { name:(r.departamento||"(sem departamento)").trim(), coordenacoes: new Map() });
      }
      const deptNode = dirNode.departamentos.get(deptKey);

      const coordKey = normalizeName(r.coordenacao || "(sem coordenação)");
      if(!deptNode.coordenacoes.has(coordKey)){
        deptNode.coordenacoes.set(coordKey, { name:(r.coordenacao||"(sem coordenação)").trim(), subareas: new Map() });
      }
      const coordNode = deptNode.coordenacoes.get(coordKey);

      const subKey = normalizeName(r.subarea || "(sem subárea)");
      if(!coordNode.subareas.has(subKey)){
        coordNode.subareas.set(subKey, { name:(r.subarea||"(sem subárea)").trim(), lideranca:(r.lideranca||"").trim(), colaboradores: new Set() });
      }
      const subNode = coordNode.subareas.get(subKey);
      const colab = (r.colaborador||"").trim();
      if(colab) subNode.colaboradores.add(colab);

      // cores
      ensureDirectorColor(r.diretoria);
      ensureLeadColor(r.lideranca);
    }
    return tree;
  }

  // =========================
  // Renderização SVG
  // =========================
  function renderSVG(rows){
    const title = ($("#chartTitle")?.value || "Organograma").trim();
    const svgW = parseInt($("#svgWidth")?.value || "1600",10);
    const svgHmin = parseInt($("#svgHeight")?.value || "1400",10);

    const P=24, GAP_X=28, GAP_DIR=56, GAP_Y=22;
    const MIN_DIR_CARD_GAP = 32; // px
    const ELBOW_OFFSET = 8; // distância do cotovelo acima do topo do Departamento
    const ELBOW_OFFSET_PRES = 10; // distância do cotovelo acima do topo da Diretoria

    // Novos gaps verticais (mais espaços)
    const GAP_PRES_TO_DIR = 40;   // antes: usava GAP_Y
    const GAP_DIR_TO_DEPT = 35;   // antes: usava GAP_Y
    const COL_W=300, CARD_H=52, PRES_H=52, HEAD_H=40, SUB_H_BASE=40, SUB_LINE_H=18;
    const DIR_CARD_W = 320; // largura fixa do card de Diretoria
    const COORD_HEAD_H = 32;   // altura do "sub-cabeçalho" de Coordenação
    // Colunas internas de Coordenação (lado a lado sob o Departamento)
    const COORD_COL_W = 260;   // largura de cada coluna de Coordenação
    const COORD_GAP_X = 16;    // gap horizontal entre coordenações

    const tree = buildOrgTree(rows);

    // Agora: cada coluna representa UM Departamento; dentro dela, N Coordenações
    // Agora: cada "coluna lógica" é um Departamento, mas sua LARGURA depende da quantidade de Coordenações (lado a lado)
    const blocks = [];
    for (const [, presNode] of tree) {
      for (const [, dirNode] of presNode.diretorias) {
        const depts = [];
        for (const [, deptNode] of dirNode.departamentos) {
          // Altura total do Departamento (cabeçalho + todas coordenações e subáreas)
          let deptH = HEAD_H; 
          const coordEntries = [];
          for (const [, coordNode] of deptNode.coordenacoes) {
            let coordBlockH = COORD_HEAD_H; // sub-cabecalho coord
            for (const [, subNode] of coordNode.subareas) {
              const n = subNode.colaboradores.size;
              coordBlockH += (SUB_H_BASE + (n ? n * SUB_LINE_H : 0)) + GAP_Y;
            }
            coordBlockH += GAP_Y; // respiro pós-coord
            coordEntries.push({ coordNode, coordBlockH });
            deptH += coordBlockH;
          }

          // Largura horizontal ocupada por esse Departamento (coordenações lado a lado)
          const coordCount = Math.max(coordEntries.length, 1);
          const deptUsedW = coordCount * COORD_COL_W + (coordCount - 1) * COORD_GAP_X;

          depts.push({ deptNode, coords: coordEntries, deptH, deptUsedW });
        }

        // Largura total desse bloco (Diretoria) = soma das larguras dos Departamentos + gaps entre eles
        const usedW = (depts.length
          ? depts.reduce((acc, d) => acc + d.deptUsedW, 0) + (depts.length - 1) * GAP_X
          : COORD_COL_W);

        // Altura máxima entre os Departamentos (para o cálculo de altura do SVG)
        const maxDeptH = depts.length ? Math.max(...depts.map(d => d.deptH)) : HEAD_H;

        blocks.push({ presName: presNode.name, dirNode, depts, usedW, maxDeptH });
      }
    }

    const sumBlocksW = blocks.reduce((acc, b) => acc + b.usedW, 0);
    const contentW = P*2 + (blocks.length ? sumBlocksW + (blocks.length - 1) * GAP_DIR : COORD_COL_W);

    const hasPres = Array.from(tree.values()).some(p => (p.name && p.name!=="(sem presidência)"));
    const headerH = 44;
    const presLayerH = hasPres ? (PRES_H + GAP_PRES_TO_DIR) : 0;
    const blockHeights = blocks.map(b => CARD_H + GAP_DIR_TO_DEPT + b.maxDeptH);

    const contentH = blockHeights.length ? Math.max(...blockHeights) : CARD_H;
    const svgH = Math.max(svgHmin, headerH + presLayerH + contentH + P + 32);

    const W = Math.max(svgW, contentW);

    const parts=[];
    parts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${svgH}" viewBox="0 0 ${W} ${svgH}" font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial">`);
    parts.push(`<rect x="0" y="0" width="100%" height="100%" fill="#ffffff"/>`);

    let y = P;
    const today = new Date().toLocaleDateString("pt-BR");
    parts.push(svgText(P, y+20, title, { size:20, weight:700 }));
    parts.push(svgText(W-P, y+20, today, { size:12, anchor:"end", fill:"#6B7280" }));
    y += headerH;

    // Presidências únicas (se houver) — CENTRALIZADAS
    const presAnchors = new Map();
    if (hasPres) {
      // 1) Descobrir presidências únicas e largura total do grupo
      const seen = new Map();
      const uniquePres = [];
      for (const [, presNode] of tree) {
        const key = normalizeName(presNode.name || "(sem presidência)");
        if (seen.has(key)) continue;
        uniquePres.push(presNode.name);
        seen.set(key, true);
      }
      const PRES_CARD_W = 220;
      const PRES_GAP = 16;
      const groupW = uniquePres.length * PRES_CARD_W + Math.max(uniquePres.length - 1, 0) * PRES_GAP;

      // 2) Calcular X inicial para centralizar no SVG (W já está calculado acima)
      let px = Math.max((W - groupW) / 2, 0);

      // 3) Desenhar cards e gravar anchors
      for (const name of uniquePres) {
        const x = px, h = PRES_H;
        parts.push(svgCard(x, y, PRES_CARD_W, h, { title: name || "(sem presidência)", color: "#0F172A" }));
        presAnchors.set(name, { x: x + PRES_CARD_W / 2, y: y + h });
        px += PRES_CARD_W + PRES_GAP;
      }
      y += PRES_H + GAP_PRES_TO_DIR;
    }

    // === INÍCIO: DIRETORIAS + COLUNAS (Dept -> N Coordenações) ===
    let x = P; // cursor horizontal do bloco (Diretoria)
    // marcador da borda direita do último card de diretoria já desenhado
    let prevDirRight = null;
    // iremos coletar os centros das diretorias por Presidência e desenhar depois
    const presConn = new Map(); // presName -> [{ cx, topY }]

    for (const block of blocks) {
      // Card Diretoria CENTRALIZADO sobre a largura usada pelo bloco,
      // mas respeitando um espaçamento mínimo em relação ao card anterior
      const dirW = DIR_CARD_W;
      let dirXBase = x + Math.max((block.usedW - dirW) / 2, 0);

      if (prevDirRight !== null) {
        const need = prevDirRight + MIN_DIR_CARD_GAP;
        if (dirXBase < need) {
          const shift = need - dirXBase;
          x += shift;           // empurra o bloco (colunas) para a direita
          dirXBase += shift;    // atualiza a posição base do card
        }
      }

      const dirX = dirXBase;
      const dirY = y, dirH = CARD_H;
      const dirColor = getDirectorColor(block.dirNode.name);
      parts.push(
        svgCard(dirX, dirY, dirW, dirH, {
          title: block.dirNode.name || "(sem diretoria)",
          color: dirColor,
          stripe: true
        })
      );
      // atualiza a borda direita deste card (para o próximo comparar)
      prevDirRight = dirX + dirW;

      // Conector Presidência -> Diretoria
      // Coleciona ligação Presidência -> (centro da Diretoria)
      if (hasPres) {
        if (!presConn.has(block.presName)) presConn.set(block.presName, []);
        presConn.get(block.presName).push({ cx: dirX + dirW / 2, topY: dirY });
      }


      // Desenhar Departamentos (cada um ocupa sua própria largura, com coordenações lado a lado)
      const topDeptY = dirY + dirH + GAP_DIR_TO_DEPT;
      let deptX = x; // começa no início do bloco (x pode ter sido ajustado pelo "shift")
      // const elbowY = topDeptY - ELBOW_OFFSET;
      const dirCenterX = dirX + dirW / 2;
      const hasMultipleDepts = block.depts.length > 1;
      const elbowY = hasMultipleDepts ? (topDeptY - ELBOW_OFFSET) : null;

      // Se houver múltiplos departamentos, desce só uma vez a perna vertical até o nível do cotovelo
      if (hasMultipleDepts) {
        parts.push(svgLine(dirCenterX, dirY + dirH, dirCenterX, elbowY, { stroke: "#CBD5E1" }));
      }

      for (const d of block.depts) {
        // Cabeçalho de Departamento ocupando a LARGURA do seu conjunto de coordenações
        parts.push(svgDeptHead(deptX, topDeptY, d.deptUsedW, HEAD_H, d.deptNode.name));
        // Conector Diretoria -> Departamento (centro do card até centro do dept)
        // Centro do departamento atual
        const deptCenterX = deptX + d.deptUsedW / 2;

        // Se houver 2+ departamentos: cotovelo (horizontal + queda)
        if (hasMultipleDepts) {
          // horizontal do eixo da diretoria até o centro deste departamento (no nível do cotovelo)
          parts.push(svgLine(dirCenterX, elbowY, deptCenterX, elbowY, { stroke: "#CBD5E1" }));
          // vertical: do cotovelo até o topo do departamento
          parts.push(svgLine(deptCenterX, elbowY, deptCenterX, topDeptY, { stroke: "#CBD5E1" }));
        } else {
          // Só 1 departamento: linha reta (vertical) da diretoria ao topo do departamento
          parts.push(svgLine(dirCenterX, dirY + dirH, dirCenterX, topDeptY, { stroke: "#CBD5E1" }));
        }

        let coordX = deptX;
        const coordTopY = topDeptY + HEAD_H + GAP_Y;

        for (const entry of d.coords) {
          const coordNode = entry.coordNode;

          // Cabeçalho da Coordenação
          parts.push(svgCoordHead(coordX, coordTopY, COORD_COL_W, COORD_HEAD_H, coordNode.name));

          // Conector Departamento -> Coordenação (vertical no centro do dept para o topo do coord)
          parts.push(svgLine(deptX + d.deptUsedW / 2, topDeptY + HEAD_H, coordX + COORD_COL_W / 2, coordTopY, { stroke: "#CBD5E1" }));

          // Subáreas dessa Coordenação (em coluna)
          let subY = coordTopY + COORD_HEAD_H + GAP_Y;
          for (const [, subNode] of coordNode.subareas) {
            const n = subNode.colaboradores.size;
            const h = SUB_H_BASE + (n ? n * SUB_LINE_H : 0);
            const lead = (subNode.lideranca || "").trim();
            parts.push(svgSubarea(coordX, subY, COORD_COL_W, h, subNode.name, lead, getLeadColor(lead), Array.from(subNode.colaboradores)));
            subY += h + GAP_Y;
          }

          // próxima coordenação (lado a lado)
          coordX += COORD_COL_W + COORD_GAP_X;
        }

        // próximo Departamento (lado a lado)
        deptX += d.deptUsedW + GAP_X;
      }

      // Avança para o próximo bloco (Diretoria)
      x += block.usedW + GAP_DIR;
    }
    // === Conectores Presidência -> Diretoria (cotovelo quando houver 2+ diretorias) ===
    if (hasPres) {
      for (const [presName, arr] of presConn.entries()) {
        const pA = presAnchors.get(presName);
        if (!pA || !arr?.length) continue;

        if (arr.length === 1) {
          // apenas 1 diretoria: linha reta
          const { cx, topY } = arr[0];
          parts.push(svgLine(pA.x, pA.y, cx, topY, { stroke: "#94A3B8" }));
        } else {
          // 2+ diretorias: cotovelo (vertical + horizontais + quedas)
          const minTopY = Math.min(...arr.map(o => o.topY));
          const elbowY  = minTopY - ELBOW_OFFSET_PRES;

          // perna vertical saindo da presidência até o nível do cotovelo
          parts.push(svgLine(pA.x, pA.y, pA.x, elbowY, { stroke: "#94A3B8" }));

          // horizontais do eixo da presidência até cada diretoria, no nível do cotovelo
          for (const { cx } of arr) {
            parts.push(svgLine(pA.x, elbowY, cx, elbowY, { stroke: "#94A3B8" }));
          }
          // quedas verticais do cotovelo até o topo de cada diretoria
          for (const { cx, topY } of arr) {
            parts.push(svgLine(cx, elbowY, cx, topY, { stroke: "#94A3B8" }));
          }
        }
      }
    }


    // // Legendas
    // let legY = svgH - P - 20;
    // let legX = P;
    // parts.push(svgText(legX,legY,"Diretorias:",{size:12,weight:700,fill:"#111827"})); legX+=80;
    // for(const [,info] of directorColorMap){
    //   parts.push(`<rect x="${legX}" y="${legY-12}" width="12" height="12" rx="2" fill="${info.color}"/>`);
    //   parts.push(svgText(legX+16, legY-2, info.display, { size:11, fill:"#374151" }));
    //   legX += (info.display.length*6 + 50);
    // }
    // legY += 18; legX = P;
    // parts.push(svgText(legX,legY,"Lideranças:",{size:12,weight:700,fill:"#111827"})); legX+=86;
    // for(const [,info] of leadColorMap){
    //   parts.push(`<rect x="${legX}" y="${legY-12}" width="12" height="12" rx="2" fill="${info.color}"/>`);
    //   parts.push(svgText(legX+16, legY-2, info.display, { size:11, fill:"#374151" }));
    //   legX += (info.display.length*6 + 50);
    // }

    parts.push(`</svg>`);
    return parts.join("");
  }

  // ---------- SVG primitives ----------
  function svgText(x,y,text,{size=14,weight=400,fill="#111827",anchor="start"}={})
    { return `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${escapeXML(text)}</text>`; }
  function svgLine(x1,y1,x2,y2,{stroke="#CBD5E1",width=2}={})
    { return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${width}"/>`; }
  function svgCard(x,y,w,h,{title,color="#334155",stripe=false}={}) {
    const r=10; const p=[];
    p.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="#F8FAFC" stroke="#CBD5E1"/>`);
    if(stripe) p.push(`<rect x="${x}" y="${y}" width="6" height="${h}" rx="${r}" fill="${color}"/>`);
    p.push(svgText(x+14, y+h/2+5, title, { size:14, weight:700, fill:"#0F172A" }));
    return p.join("");
  }
  function svgHead(x,y,w,h,dept,coord){
    const r=8;
    return [
      `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="#EEF2FF" stroke="#CBD5E1"/>`,
      svgText(x+10, y+16, dept || "(sem departamento)", { size:12, weight:700, fill:"#1F2937" }),
      svgText(x+10, y+32, coord || "(sem coordenação)", { size:11, fill:"#374151" })
    ].join("");
  }
  function svgDeptHead(x, y, w, h, dept) {
    const r = 8;
    return [
      `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="#EEF2FF" stroke="#CBD5E1"/>`,
      // centraliza verticalmente o texto dentro de h
      svgText(x + 10, y + Math.round(h/2) + 5, dept || "(sem departamento)", { size: 12, weight: 700, fill: "#1F2937" })
    ].join("");
  }

  // Sub-cabeçalho da Coordenação
  function svgCoordHead(x, y, w, h, coord) {
    const r = 8;
    return [
      `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="#F3F4F6" stroke="#E5E7EB"/>`,
      svgText(x + 10, y + Math.round(h/2) + 5, coord || "(sem coordenação)", { size: 11, weight: 600, fill: "#374151" })
    ].join("");
  }
  function svgSubarea(x,y,w,h,sub,lead,leadColor,collabs){
    const r=8; const p=[];
    p.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="#FFFFFF" stroke="#E5E7EB"/>`);
    p.push(svgText(x+10, y+18, sub || "(sem subárea)", { size:12, weight:700 }));
    if(lead){
      const pill = lead.length>26 ? (lead.slice(0,24)+"…") : lead;
      const pw = Math.min(140, Math.max(60, pill.length*7));
      const px = x + w - 10 - pw;
      p.push(`<rect x="${px}" y="${y+8}" width="${pw}" height="20" rx="10" fill="${leadColor}" opacity="0.15"/>`);
      p.push(svgText(px+pw/2, y+23, pill, { size:11, weight:600, fill:"#111827", anchor:"middle" }));
    }
    let cy = y+36;
    if(collabs && collabs.length){
      for(const c of collabs){ p.push(svgText(x+16, cy, "• "+c, { size:11, fill:"#374151" })); cy += 18; }
    } else {
      p.push(svgText(x+16, cy, "—", { size:11, fill:"#9CA3AF" }));
    }
    return p.join("");
  }

  // =========================
  // Ações
  // =========================
  function enableSvgButtons(on){
    $("#btnDownload") && ($("#btnDownload").disabled = !on);
    $("#btnCopy") && ($("#btnCopy").disabled = !on);
  }

  function generateTableFromTextarea(){
    ROWS = parseTextarea();
    rebuildTable();

    // Reset cores
    directorColorMap.clear(); leadColorMap.clear(); directorColorCursor = 0;
    ROWS.forEach(r=>{ ensureDirectorColor(r.diretoria); ensureLeadColor(r.lideranca); });
    renderColorPanels();

    // limpar preview
    $("#svgContainer") && ($("#svgContainer").innerHTML="");
    enableSvgButtons(false);
  }

  function generateSVG(){
    const svgStr = renderSVG(ROWS);
    const cont = $("#svgContainer"); if(cont){ cont.innerHTML = svgStr; }
    enableSvgButtons(true);

    // auto download
    if($("#autoDownload")?.value === "yes"){
      downloadSVG();
    }
  }

  function downloadSVG(){
    const cont = $("#svgContainer");
    if(!cont || !cont.firstChild) return;
    const svg = cont.firstChild.outerHTML || cont.innerHTML;
    const blob = new Blob([svg],{type:"image/svg+xml"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const title = ($("#chartTitle")?.value || "organograma").trim().replace(/\s+/g,"_");
    a.href=url; a.download = `${title}.svg`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  async function copySVG(){
    const cont = $("#svgContainer");
    if(!cont || !cont.firstChild) return;
    const svg = cont.firstChild.outerHTML || cont.innerHTML;
    try{
      await navigator.clipboard.writeText(svg);
      alert("SVG copiado para a área de transferência!");
    }catch{
      alert("Não foi possível copiar. Baixe o SVG.");
    }
  }

  function clearAll(){
    // texto
    if($("#rawInput")) $("#rawInput").value="";
    // tabela
    ROWS = []; rebuildTable();
    if($("#checkAll")) $("#checkAll").checked=false;
    // cores
    directorColorMap.clear(); leadColorMap.clear(); directorColorCursor=0;
    renderColorPanels();
    // svg
    if($("#svgContainer")) $("#svgContainer").innerHTML="";
    enableSvgButtons(false);
  }

  // =========================
  // Eventos (IDs conforme seu HTML)
  // =========================
  document.addEventListener("DOMContentLoaded", () => {
    $("#btnParse")?.addEventListener("click", generateTableFromTextarea);
    $("#btnClear")?.addEventListener("click", clearAll);

    $("#btnAddRow")?.addEventListener("click", ()=> addRow());
    $("#btnDeleteSelected")?.addEventListener("click", deleteSelected);
    $("#checkAll")?.addEventListener("change", e=> setSelectAll(e.target.checked));

    $("#btnExportCSV")?.addEventListener("click", exportCSV);
    $("#btnImportCSV")?.addEventListener("click", ()=> $("#csvFile")?.click());
    $("#csvFile")?.addEventListener("change", (e)=>{
      const f = e.target.files?.[0];
      if(f) importCSV(f);
      e.target.value="";
    });

    $("#btnGenerate")?.addEventListener("click", generateSVG);
    $("#btnDownload")?.addEventListener("click", downloadSVG);
    $("#btnCopy")?.addEventListener("click", copySVG);
    $('#rawInput').value = SAMPLE;
    // Geração rápida ao sair do textarea (opcional)
    $("#rawInput")?.addEventListener("blur", ()=>{
      if(!ROWS.length && ($("#rawInput").value||"").trim()) generateTableFromTextarea();
    });
  });

})();



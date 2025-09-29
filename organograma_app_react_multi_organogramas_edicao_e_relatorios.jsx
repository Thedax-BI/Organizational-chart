import React, { useEffect, useMemo, useState, useRef } from "react";
import { Edit2, Save, X, Plus, Trash2, BarChart3, FileText, Building2, Copy, Upload, Download, Printer, FolderOpen } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PptxGenJS from 'pptxgenjs';

/**
 * Organograma App – multi-organogramas, edição e relatórios (versão corrigida)
 *
 * ✔ Multi-organogramas (criar, renomear, duplicar, excluir, alternar)
 * ✔ Estrutura: Diretoria -> Coordenação -> Liderança -> Colaboradores
 * ✔ Edição inline de nomes (diretor, área, coordenação, liderança, colaboradores)
 * ✔ Adicionar/remover diretoria, coordenação, colaborador
 * ✔ Relatório visual (gráficos) e relatório descritivo
 * ✔ Exportar/Importar JSON e Persistência via localStorage
 * ✔ Botão de impressão (A4 paisagem + modo 1 página)
 * ✔ Exportar PDF e PPTX a partir da visualização (html2canvas + jsPDF + pptxgenjs)
 * ✔ Zoom de pré-visualização na árvore
 */

// ------- Utilidades -------
const STORAGE_KEY = "organograma-app.v1";
const DEFAULT_ORG = {
  id: cryptoRandomId(),
  nome: "Organograma Principal",
  dados: {
    diretores: [
      {
        id: 1,
        nome: "Diretor 01",
        area: "Produção",
        coordenacoes: [
          { nome: "Venoc", lideranca: "Liderança 01", colaboradores: ["Colaborador 1", "Colaborador 2"] },
          { nome: "Manutenção", lideranca: "Liderança 01", colaboradores: ["Colaborador 1"] },
          { nome: "Corte / Dobradeira", lideranca: "Liderança 01", colaboradores: ["Colaborador 1", "Colaborador 2"] },
          { nome: "Grelha", lideranca: "Liderança 02", colaboradores: ["Colaborador 1", "Colaborador 2", "Colaborador 3"] },
          { nome: "Difusor", lideranca: "Liderança 02", colaboradores: ["Colaborador 1", "Colaborador 2"] },
          { nome: "Registro", lideranca: "Liderança 02", colaboradores: ["Colaborador 1"] },
          { nome: "Caixa Plenum", lideranca: "Liderança 02", colaboradores: ["Colaborador 1", "Colaborador 2"] },
          { nome: "Solda", lideranca: "Liderança 03", colaboradores: ["Colaborador 1", "Colaborador 2", "Colaborador 3"] },
          { nome: "Almoxarifado", lideranca: "Liderança 03", colaboradores: ["Colaborador 1"] },
          { nome: "Compras", lideranca: "Liderança 03", colaboradores: ["Colaborador 1"] },
          { nome: "PPCP", lideranca: "Liderança 03", colaboradores: ["Colaborador 1", "Colaborador 2"] }
        ]
      },
      {
        id: 2,
        nome: "Diretor 02",
        area: "Comercial",
        coordenacoes: [
          { nome: "Vendas", lideranca: "Liderança 01", colaboradores: ["Colaborador 1", "Colaborador 2", "Colaborador 3"] },
          { nome: "Estoque / Expedição", lideranca: "Liderança 02", colaboradores: ["Colaborador 1", "Colaborador 2"] }
        ]
      },
      {
        id: 3,
        nome: "Diretor 03",
        area: "Administrativo",
        coordenacoes: [
          { nome: "Financeiro", lideranca: "Liderança 01", colaboradores: ["Colaborador 1", "Colaborador 2"] },
          { nome: "Fiscal", lideranca: "Liderança 01", colaboradores: ["Colaborador 1"] },
          { nome: "Contábil", lideranca: "Liderança 01", colaboradores: ["Colaborador 1"] },
          { nome: "RH", lideranca: "Liderança 01", colaboradores: ["Colaborador 1", "Colaborador 2"] }
        ]
      }
    ]
  }
};

function cryptoRandomId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).slice(2);
}

function cloneDeep(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { orgs: [DEFAULT_ORG], ativoId: DEFAULT_ORG.id };
    const parsed = JSON.parse(raw);
    if (!parsed.orgs?.length) return { orgs: [DEFAULT_ORG], ativoId: DEFAULT_ORG.id };
    return parsed;
  } catch {
    return { orgs: [DEFAULT_ORG], ativoId: DEFAULT_ORG.id };
  }
}

// Paletas para cartões de diretoria
const DIR_COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-indigo-500",
];
const PIE_COLORS = ["#3B82F6", "#10B981", "#A855F7", "#F97316", "#EC4899", "#6366F1"];

// ------- App Principal -------
export default function App() {
  const [{ orgs, ativoId }, setState] = useState(loadInitial());
  const orgAtivo = useMemo(() => orgs.find(o => o.id === ativoId) || orgs[0], [orgs, ativoId]);
  const [view, setView] = useState("organograma"); // organograma | grafico | relatorio
  const [orgLayout, setOrgLayout] = useState("tree"); // tree | cards
  const [editMode, setEditMode] = useState({});
  const [tempValue, setTempValue] = useState("");
  const [zoom, setZoom] = useState(1);
  const treeRef = useRef(null);

  // Persistência
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ orgs, ativoId }));
  }, [orgs, ativoId]);

  // "Testes" básicos (sanidade)
  useEffect(() => {
    console.assert(Array.isArray(orgs), "[TEST] orgs deve ser array");
    console.assert(orgAtivo && orgAtivo.dados, "[TEST] orgAtivo presente");
  }, [orgs, orgAtivo]);

  // ---------- Multi-Organogramas ----------
  const criarOrganograma = () => {
    const novo = {
      id: cryptoRandomId(),
      nome: `Organograma ${orgs.length + 1}`,
      dados: { diretores: [] }
    };
    const novos = [...orgs, novo];
    setState({ orgs: novos, ativoId: novo.id });
  };

  const renomearOrganograma = (id) => {
    const nome = prompt("Novo nome do organograma:", orgs.find(o => o.id === id)?.nome || "");
    if (!nome) return;
    const novos = orgs.map(o => o.id === id ? { ...o, nome } : o);
    setState({ orgs: novos, ativoId });
  };

  const duplicarOrganograma = (id) => {
    const base = orgs.find(o => o.id === id);
    if (!base) return;
    const copia = cloneDeep(base);
    copia.id = cryptoRandomId();
    copia.nome = base.nome + " (cópia)";
    const novos = [...orgs, copia];
    setState({ orgs: novos, ativoId: copia.id });
  };

  const excluirOrganograma = (id) => {
    if (!confirm("Tem certeza que deseja excluir este organograma?")) return;
    let novos = orgs.filter(o => o.id !== id);
    if (novos.length === 0) novos = [DEFAULT_ORG];
    const novoAtivo = novos[0].id;
    setState({ orgs: novos, ativoId: novoAtivo });
  };

  const selecionarOrganograma = (id) => setState({ orgs, ativoId: id });

  const exportarJSON = () => {
    const blob = new Blob([JSON.stringify({ orgs, ativoId }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "organograma.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportarPDF = async () => {
    const target = treeRef.current || document.body;
    const canvas = await html2canvas(target, { scale: 2, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 8; // mm
    const maxW = pageWidth - margin * 2;
    const maxH = pageHeight - margin * 2;
    const ratio = Math.min(maxW / canvas.width, maxH / canvas.height);
    const w = canvas.width * ratio;
    const h = canvas.height * ratio;
    const x = (pageWidth - w) / 2;
    const y = (pageHeight - h) / 2;
    pdf.addImage(imgData, 'PNG', x, y, w, h);
    pdf.save(`${orgAtivo.nome.replace(/\s+/g,'_')}.pdf`);
  };

  const exportarPPTX = async () => {
    const target = treeRef.current || document.body;
    const canvas = await html2canvas(target, { scale: 2, backgroundColor: '#ffffff' });
    const dataUrl = canvas.toDataURL('image/png');
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';
    const slide = pptx.addSlide();
    slide.addText(orgAtivo.nome, { x:0.5, y:0.3, fontSize:18, bold:true });
    slide.addImage({ data: dataUrl, x:0.5, y:1.0, w:9.0, h:5.0, sizing: { type:'contain', w:9.0, h:5.0 } });
    await pptx.writeFile({ fileName: `${orgAtivo.nome.replace(/\s+/g,'_')}.pptx` });
  };

  const importarJSON = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!parsed.orgs) throw new Error("Arquivo inválido");
        setState({ orgs: parsed.orgs, ativoId: parsed.ativoId || parsed.orgs[0]?.id });
      } catch (e) {
        alert("Falha ao importar JSON: " + e.message);
      }
    };
    reader.readAsText(file);
  };

  const imprimir = (onePageA4Landscape = false) => {
    if (onePageA4Landscape) {
      document.body.classList.add('print-a4-one');
      const cleanup = () => {
        document.body.classList.remove('print-a4-one');
        window.removeEventListener('afterprint', cleanup);
      };
      window.addEventListener('afterprint', cleanup);
    }
    window.print();
  };

  // ---------- Mutações do organograma ativo ----------
  const setOrgDados = (updater) => {
    const novos = orgs.map(o => (o.id === orgAtivo.id ? { ...o, dados: updater(cloneDeep(o.dados)) } : o));
    setState({ orgs: novos, ativoId });
  };

  const addDiretoria = () => setOrgDados((dados) => {
    const newId = (dados.diretores?.length ? Math.max(...dados.diretores.map(d => d.id)) : 0) + 1;
    dados.diretores = dados.diretores || [];
    dados.diretores.push({ id: newId, nome: `Diretor ${String(newId).padStart(2, "0")}`, area: "Nova Área", coordenacoes: [] });
    return dados;
  });

  const removeDiretoria = (dirId) => setOrgDados((dados) => {
    dados.diretores = (dados.diretores || []).filter(d => d.id !== dirId);
    return dados;
  });

  const addCoordenacao = (dirId) => setOrgDados((dados) => {
    const diretor = dados.diretores.find(d => d.id === dirId);
    diretor.coordenacoes.push({ nome: "Nova Coordenação", lideranca: "Nova Liderança", colaboradores: [] });
    return dados;
  });

  const removeCoordenacao = (dirId, coordIdx) => setOrgDados((dados) => {
    const diretor = dados.diretores.find(d => d.id === dirId);
    diretor.coordenacoes.splice(coordIdx, 1);
    return dados;
  });

  const addColaborador = (dirId, coordIdx) => setOrgDados((dados) => {
    const diretor = dados.diretores.find(d => d.id === dirId);
    diretor.coordenacoes[coordIdx].colaboradores.push("Novo Colaborador");
    return dados;
  });

  const removeColaborador = (dirId, coordIdx, colabIdx) => setOrgDados((dados) => {
    const diretor = dados.diretores.find(d => d.id === dirId);
    diretor.coordenacoes[coordIdx].colaboradores.splice(colabIdx, 1);
    return dados;
  });

  const isEditing = (key) => !!editMode[key];
  const startEdit = (key, getCurrentValue) => {
    setEditMode({ [key]: true });
    setTempValue(getCurrentValue());
  };
  const cancelEdit = () => { setEditMode({}); setTempValue(""); };

  const saveEditDiretor = (dirId, campo) => setOrgDados((dados) => {
    const d = dados.diretores.find(x => x.id === dirId);
    d[campo] = tempValue;
    return dados;
  });

  const saveEditCoordenacao = (dirId, coordIdx, campo) => setOrgDados((dados) => {
    const d = dados.diretores.find(x => x.id === dirId);
    d.coordenacoes[coordIdx][campo] = tempValue;
    return dados;
  });

  const saveEditColaborador = (dirId, coordIdx, colabIdx) => setOrgDados((dados) => {
    const d = dados.diretores.find(x => x.id === dirId);
    d.coordenacoes[coordIdx].colaboradores[colabIdx] = tempValue;
    return dados;
  });

  const getDirColor = (id) => DIR_COLORS[(id - 1) % DIR_COLORS.length];

  // ---------- Estatísticas ----------
  const getStats = () => {
    const diretores = orgAtivo.dados.diretores || [];
    const stats = diretores.map(dir => {
      const totalColaboradores = dir.coordenacoes.reduce((sum, c) => sum + c.colaboradores.length, 0);
      return {
        nome: dir.area || dir.nome,
        coordenacoes: dir.coordenacoes.length,
        colaboradores: totalColaboradores,
        liderancas: new Set(dir.coordenacoes.map(c => c.lideranca)).size
      };
    });
    const totalGeral = {
      diretores: diretores.length,
      coordenacoes: diretores.reduce((s, d) => s + d.coordenacoes.length, 0),
      liderancas: diretores.reduce((s, d) => s + new Set(d.coordenacoes.map(c => c.lideranca)).size, 0),
      colaboradores: diretores.reduce((s, d) => s + d.coordenacoes.reduce((s2, c) => s2 + c.colaboradores.length, 0), 0),
    };
    return { stats, totalGeral };
  };

  // ---------- Views ----------
  const renderGrafico = () => {
    const { stats, totalGeral } = getStats();
    const pieData = stats.map(s => ({ name: s.nome, value: s.colaboradores }));

    return (
      <div className="space-y-8 print:space-y-4">
        <div className="bg-white rounded-xl shadow-lg p-6 print:shadow-none">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Resumo Executivo</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <DashCard label="Diretorias" value={totalGeral.diretores} className="bg-blue-50 text-blue-600" />
            <DashCard label="Coordenações" value={totalGeral.coordenacoes} className="bg-green-50 text-green-600" />
            <DashCard label="Lideranças" value={totalGeral.liderancas} className="bg-purple-50 text-purple-600" />
            <DashCard label="Colaboradores" value={totalGeral.colaboradores} className="bg-orange-50 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 print:shadow-none">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Colaboradores por Diretoria</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="colaboradores" fill="#3B82F6" name="Colaboradores" />
              <Bar dataKey="coordenacoes" fill="#10B981" name="Coordenações" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 print:shadow-none">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Distribuição de Colaboradores</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderRelatorio = () => {
    const { totalGeral } = getStats();
    const diretores = orgAtivo.dados.diretores || [];

    return (
      <div className="bg-white rounded-xl shadow-lg p-8 print:shadow-none">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Relatório Organizacional</h1>
          <p className="text-gray-600">Estrutura completa – {orgAtivo.nome}</p>
        </div>

        <div className="mb-8 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Resumo Geral</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <ResumoPill label="Diretorias" value={totalGeral.diretores} color="text-blue-600" />
            <ResumoPill label="Coordenações" value={totalGeral.coordenacoes} color="text-green-600" />
            <ResumoPill label="Lideranças" value={totalGeral.liderancas} color="text-purple-600" />
            <ResumoPill label="Colaboradores" value={totalGeral.colaboradores} color="text-orange-600" />
          </div>
        </div>

        <div className="space-y-6">
          {diretores.map((diretor) => {
            const totalColab = diretor.coordenacoes.reduce((sum, c) => sum + c.colaboradores.length, 0);
            const liderancasUnicas = new Set(diretor.coordenacoes.map(c => c.lideranca)).size;
            return (
              <div key={diretor.id} className="border-2 border-gray-200 rounded-lg p-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">{diretor.nome}</h2>
                  <p className="text-lg text-gray-600">{diretor.area}</p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-500">
                    <span>📊 {diretor.coordenacoes.length} coordenações</span>
                    <span>👤 {liderancasUnicas} lideranças</span>
                    <span>👥 {totalColab} colaboradores</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {diretor.coordenacoes.map((coord, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4">
                      <div className="mb-2">
                        <h3 className="font-semibold text-gray-800">{coord.nome}</h3>
                        <p className="text-sm text-gray-600">Liderança: {coord.lideranca}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1 font-semibold">Equipe ({coord.colaboradores.length}):</p>
                        <div className="flex flex-wrap gap-2">
                          {coord.colaboradores.map((c, i) => (
                            <span key={i} className="text-xs bg-white px-2 py-1 rounded border border-gray-200">{c}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderOrganograma = () => {
    const diretores = orgAtivo.dados.diretores || [];

    const renderTree = () => (
      <div className="space-y-12" ref={treeRef} style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
        {diretores.map((diretor) => (
          <div key={diretor.id} className="bg-white rounded-xl shadow-lg p-6 print:shadow-none">
            <div className="mb-6 flex items-center justify-between">
              <div className={`px-5 py-3 rounded-lg text-white text-xl font-bold ${getDirColor(diretor.id)}`}>{diretor.nome} · <span className="font-normal">{diretor.area}</span></div>
              <button onClick={() => addCoordenacao(diretor.id)} className="print:hidden bg-green-600 text-white px-3 py-2 rounded-lg inline-flex items-center gap-2"><Plus size={16}/> Coordenação</button>
            </div>

            {/* Nível: Diretoria -> Coordenações */}
            <div className="org-tree">
              <div className="org-node">
                <div className="org-card">
                  <div className="text-sm opacity-70">Diretoria</div>
                  <div className="text-lg font-semibold">{diretor.nome}</div>
                  <div className="text-xs opacity-70">Gerência: {diretor.area}</div>
                </div>
                <div className="org-children">
                  {diretor.coordenacoes.map((coord, idx) => (
                    <div key={idx} className="org-branch">
                      <div className="org-card">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="text-xs opacity-70">Coordenação</div>
                            <div className="font-semibold">{coord.nome}</div>
                            <div className="text-xs mt-1">👤 {coord.lideranca}</div>
                          </div>
                          <div className="ml-auto flex gap-1 print:hidden">
                            <button onClick={() => startEdit(`coord-${diretor.id}-${idx}-nome`, () => coord.nome)} title="Editar coordenação" className="p-1 text-gray-500 hover:text-gray-700"><Edit2 size={14}/></button>
                            <button onClick={() => startEdit(`coord-${diretor.id}-${idx}-lideranca`, () => coord.lideranca)} title="Editar liderança" className="p-1 text-gray-500 hover:text-gray-700"><Edit2 size={14}/></button>
                            <button onClick={() => removeCoordenacao(diretor.id, idx)} title="Remover" className="p-1 text-red-500 hover:text-red-700"><Trash2 size={14}/></button>
                          </div>
                        </div>
                        {/* Nível: Colaboradores */}
                        {coord.colaboradores.length > 0 && (
                          <ul className="mt-3 space-y-1">
                            {coord.colaboradores.map((c, cIdx) => (
                              <li key={cIdx} className="text-sm bg-gray-50 rounded px-2 py-1 border border-gray-200 flex items-center gap-2">
                                <span className="truncate flex-1">{c}</span>
                                <span className="print:hidden flex gap-1">
                                  <button onClick={() => startEdit(`colab-${diretor.id}-${idx}-${cIdx}`, () => c)} className="p-1 text-gray-500 hover:text-gray-700" title="Editar"><Edit2 size={12}/></button>
                                  <button onClick={() => removeColaborador(diretor.id, idx, cIdx)} className="p-1 text-red-500 hover:text-red-700" title="Remover"><Trash2 size={12}/></button>
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                        <button onClick={() => addColaborador(diretor.id, idx)} className="mt-2 text-xs text-blue-600 hover:underline print:hidden inline-flex items-center gap-1"><Plus size={12}/> adicionar colaborador</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );

    const renderCards = () => (
      <>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{orgAtivo.nome}</h1>
          <p className="text-gray-600">Clique no ícone de edição para alterar | Use + para adicionar novos itens</p>
          <button onClick={addDiretoria} className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all inline-flex items-center gap-2 mx-auto print:hidden">
            <Plus size={20} /> Adicionar Nova Diretoria
          </button>
        </div>

        <div className="space-y-8">
          {diretores.map((diretor) => (
            <div key={diretor.id} className="bg-white rounded-xl shadow-lg p-6 print:shadow-none">
              <div className={`${getDirColor(diretor.id)} rounded-lg p-6 mb-6 relative`}>
                {diretores.length > 1 && (
                  <button onClick={() => removeDiretoria(diretor.id)} className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 p-2 rounded print:hidden" title="Remover diretoria">
                    <Trash2 size={18} />
                  </button>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-white text-2xl font-bold">
                        {isEditing(`dir-${diretor.id}-nome`) ? (
                          <input type="text" value={tempValue} onChange={(e) => setTempValue(e.target.value)} className="bg-white text-gray-800 px-3 py-1 rounded" autoFocus />
                        ) : (
                          diretor.nome
                        )}
                      </h2>
                      {!isEditing(`dir-${diretor.id}-nome`) ? (
                        <button onClick={() => startEdit(`dir-${diretor.id}-nome`, () => diretor.nome)} className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded print:hidden"><Edit2 size={18} /></button>
                      ) : (
                        <div className="flex gap-2">
                          <button onClick={() => { saveEditDiretor(diretor.id, "nome"); setEditMode({}); setTempValue(""); }} className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded"><Save size={18} /></button>
                          <button onClick={cancelEdit} className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded"><X size={18} /></button>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-white text-lg opacity-90">
                        {isEditing(`dir-${diretor.id}-area`) ? (
                          <input type="text" value={tempValue} onChange={(e) => setTempValue(e.target.value)} className="bg-white text-gray-800 px-3 py-1 rounded" autoFocus />
                        ) : (
                          `Gerência: ${diretor.area}`
                        )}
                      </p>
                      {!isEditing(`dir-${diretor.id}-area`) ? (
                        <button onClick={() => startEdit(`dir-${diretor.id}-area`, () => diretor.area)} className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded print:hidden"><Edit2 size={16} /></button>
                      ) : (
                        <div className="flex gap-2">
                          <button onClick={() => { saveEditDiretor(diretor.id, "area"); setEditMode({}); setTempValue(""); }} className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded"><Save size={16} /></button>
                          <button onClick={cancelEdit} className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded"><X size={16} /></button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4 print:hidden">
                <button onClick={() => addCoordenacao(diretor.id)} className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all inline-flex items-center gap-2">
                  <Plus size={18} /> Adicionar Coordenação
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {diretor.coordenacoes.map((coord, idx) => (
                  <div key={idx} className="border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow relative">
                    <button onClick={() => removeCoordenacao(diretor.id, idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 p-1 print:hidden" title="Remover coordenação">
                      <Trash2 size={16} />
                    </button>

                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1 font-semibold">COORDENAÇÃO</p>
                      <div className="flex items-center gap-2">
                        {isEditing(`coord-${diretor.id}-${idx}-nome`) ? (
                          <input type="text" value={tempValue} onChange={(e) => setTempValue(e.target.value)} className="flex-1 border border-gray-300 px-2 py-1 rounded text-sm" autoFocus />
                        ) : (
                          <p className="font-semibold text-gray-800 flex-1">{coord.nome}</p>
                        )}
                        {!isEditing(`coord-${diretor.id}-${idx}-nome`) ? (
                          <button onClick={() => startEdit(`coord-${diretor.id}-${idx}-nome`, () => coord.nome)} className="text-gray-400 hover:text-gray-600 p-1 print:hidden"><Edit2 size={14} /></button>
                        ) : (
                          <div className="flex gap-1">
                            <button onClick={() => { saveEditCoordenacao(diretor.id, idx, "nome"); setEditMode({}); setTempValue(""); }} className="text-green-600 hover:text-green-700 p-1"><Save size={14} /></button>
                            <button onClick={cancelEdit} className="text-red-600 hover:text-red-700 p-1"><X size={14} /></button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t pt-3 mb-3">
                      <div className="flex items-center gap-2">
                        {isEditing(`coord-${diretor.id}-${idx}-lideranca`) ? (
                          <input type="text" value={tempValue} onChange={(e) => setTempValue(e.target.value)} className="flex-1 border border-gray-300 px-2 py-1 rounded text-sm" autoFocus />
                        ) : (
                          <p className="text-sm text-gray-600 flex-1 font-medium">👤 {coord.lideranca}</p>
                        )}
                        {!isEditing(`coord-${diretor.id}-${idx}-lideranca`) ? (
                          <button onClick={() => startEdit(`coord-${diretor.id}-${idx}-lideranca`, () => coord.lideranca)} className="text-gray-400 hover:text-gray-600 p-1 print:hidden"><Edit2 size={14} /></button>
                        ) : (
                          <div className="flex gap-1">
                            <button onClick={() => { saveEditCoordenacao(diretor.id, idx, "lideranca"); setEditMode({}); setTempValue(""); }} className="text-green-600 hover:text-green-700 p-1"><Save size={14} /></button>
                            <button onClick={cancelEdit} className="text-red-600 hover:text-red-700 p-1"><X size={14} /></button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t pt-3 bg-gray-50 -mx-4 -mb-4 px-4 pb-4 rounded-b-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-gray-500 font-semibold">COLABORADORES</p>
                        <button onClick={() => addColaborador(diretor.id, idx)} className="text-blue-600 hover:text-blue-700 p-1 print:hidden" title="Adicionar colaborador"><Plus size={16} /></button>
                      </div>
                      <div className="space-y-2">
                        {coord.colaboradores.map((colab, colabIdx) => (
                          <div key={colabIdx} className="flex items-center gap-2 bg-white p-2 rounded border border-gray-200">
                            {isEditing(`colab-${diretor.id}-${idx}-${colabIdx}`) ? (
                              <input type="text" value={tempValue} onChange={(e) => setTempValue(e.target.value)} className="flex-1 border border-gray-300 px-2 py-1 rounded text-sm" autoFocus />
                            ) : (
                              <p className="text-sm text-gray-800 flex-1">{colab}</p>
                            )}
                            {!isEditing(`colab-${diretor.id}-${idx}-${colabIdx}`) ? (
                              <>
                                <button onClick={() => startEdit(`colab-${diretor.id}-${idx}-${colabIdx}`, () => colab)} className="text-gray-400 hover:text-gray-600 p-1 print:hidden"><Edit2 size={14} /></button>
                                <button onClick={() => removeColaborador(diretor.id, idx, colabIdx)} className="text-red-400 hover:text-red-600 p-1 print:hidden"><Trash2 size={14} /></button>
                              </>
                            ) : (
                              <div className="flex gap-1">
                                <button onClick={() => { saveEditColaborador(diretor.id, idx, colabIdx); setEditMode({}); setTempValue(""); }} className="text-green-600 hover:text-green-700 p-1"><Save size={14} /></button>
                                <button onClick={cancelEdit} className="text-red-600 hover:text-red-700 p-1"><X size={14} /></button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </>
    );

    return (
      <div>
        {/* Toggle de layout dentro de Organograma */}
        <div className="max-w-7xl mx-auto mb-6 flex items-center justify-center gap-2 print:hidden">
          <NavButton active={orgLayout === 'tree'} onClick={() => setOrgLayout('tree')} icon={<Building2 size={18} />}>Árvore</NavButton>
          <NavButton active={orgLayout === 'cards'} onClick={() => setOrgLayout('cards')} icon={<FileText size={18} />}>Cards</NavButton>
          {orgLayout === 'tree' && (
            <div className="ml-4 flex items-center gap-2">
              <span className="text-sm text-gray-600">Zoom:</span>
              <button className="px-2 py-1 border rounded" onClick={() => setZoom(z => Math.max(0.6, +(z-0.1).toFixed(2)))}>-</button>
              <input type="range" min={0.6} max={1.4} step={0.05} value={zoom} onChange={(e)=>setZoom(parseFloat(e.target.value))} />
              <button className="px-2 py-1 border rounded" onClick={() => setZoom(z => Math.min(1.4, +(z+0.1).toFixed(2)))}>+</button>
              <span className="text-sm text-gray-600 w-14 text-center">{Math.round(zoom*100)}%</span>
              <button className="px-2 py-1 border rounded" onClick={() => setZoom(1)}>Reset</button>
            </div>
          )}
        </div>
        {orgLayout === 'tree' ? renderTree() : renderCards()}
      </div>
    );
  };

  // ---------- Render ----------
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-8">
      {/* Barra superior */}
      <div className="max-w-7xl mx-auto mb-6 flex items-center gap-2 flex-wrap print:hidden">
        <span className="text-sm text-gray-500">Organograma:</span>
        <div className="flex flex-wrap gap-2 items-center">
          {orgs.map((o) => (
            <button key={o.id} onClick={() => selecionarOrganograma(o.id)} className={`px-3 py-2 rounded-lg text-sm font-medium border ${o.id === orgAtivo.id ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"}`} title={o.nome}>
              <div className="inline-flex items-center gap-2">
                <FolderOpen size={16} />
                <span className="max-w-[220px] truncate">{o.nome}</span>
              </div>
            </button>
          ))}
          <button onClick={criarOrganograma} className="px-3 py-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 inline-flex items-center gap-2">
            <Plus size={16} /> Novo organograma
          </button>
        </div>
        <div className="ml-auto flex gap-2">
          <button onClick={() => renomearOrganograma(orgAtivo.id)} className="px-3 py-2 rounded-lg text-sm bg-white border border-gray-200 hover:bg-gray-50 inline-flex items-center gap-2"><Edit2 size={16} /> Renomear</button>
          <button onClick={() => duplicarOrganograma(orgAtivo.id)} className="px-3 py-2 rounded-lg text-sm bg-white border border-gray-200 hover:bg-gray-50 inline-flex items-center gap-2"><Copy size={16} /> Duplicar</button>
          <button onClick={() => excluirOrganograma(orgAtivo.id)} className="px-3 py-2 rounded-lg text-sm bg-white border border-gray-200 hover:bg-gray-50 inline-flex items-center gap-2 text-red-600"><Trash2 size={16} /> Excluir</button>
          <button onClick={exportarJSON} className="px-3 py-2 rounded-lg text-sm bg-white border border-gray-200 hover:bg-gray-50 inline-flex items-center gap-2"><Download size={16} /> Exportar</button>
          <label className="px-3 py-2 rounded-lg text-sm bg-white border border-gray-200 hover:bg-gray-50 inline-flex items-center gap-2 cursor-pointer">
            <Upload size={16} /> Importar
            <input type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && importarJSON(e.target.files[0])} />
          </label>
          <div className="relative inline-flex gap-2">
            <button onClick={() => imprimir(false)} className="px-3 py-2 rounded-lg text-sm bg-white border border-gray-200 hover:bg-gray-50 inline-flex items-center gap-2"><Printer size={16} /> Imprimir</button>
            <button onClick={() => imprimir(true)} className="px-3 py-2 rounded-lg text-sm bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 inline-flex items-center gap-2" title="Forçar A4 Paisagem – 1 página"><Printer size={16} /> A4 Paisagem (1 pág.)</button>
          </div>
        </div>
      </div>

      {/* Menu de navegação */}
      <div className="max-w-7xl mx-auto mb-8 flex justify-center gap-4 print:hidden">
        <NavButton active={view === "organograma"} onClick={() => setView("organograma"} icon={<Building2 size={20} />}>Organograma</NavButton>
        <NavButton active={view === "grafico"} onClick={() => setView("grafico")} icon={<BarChart3 size={20} />}>Gráficos</NavButton>
        <NavButton active={view === "relatorio"} onClick={() => setView("relatorio")} icon={<FileText size={20} />}>Relatório</NavButton>
        {view === 'organograma' && (
          <div className="flex items-center gap-2 ml-4">
            <button onClick={exportarPDF} className="px-3 py-2 rounded-lg text-sm bg-white border border-gray-200 hover:bg-gray-50 inline-flex items-center gap-2"><Download size={16} /> PDF</button>
            <button onClick={exportarPPTX} className="px-3 py-2 rounded-lg text-sm bg-white border border-gray-200 hover:bg-gray-50 inline-flex items-center gap-2"><Download size={16} /> PPTX</button>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto">
        {view === "grafico" && renderGrafico()}
        {view === "relatorio" && renderRelatorio()}
        {view === "organograma" && renderOrganograma()}
      </div>

      {/* Estilos de impressão e do organograma (linhas) */}
      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 8mm; }
          .print\\:hidden { display: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          body { background: white; }
          .org-card { break-inside: avoid; }

          /* Compactação para caber em 1 página quando usar o botão A4 */
          body.print-a4-one { zoom: 0.78; }
          body.print-a4-one .space-y-12 > :where(*+*){ margin-top: 1.5rem; }
          body.print-a4-one .org-card{ padding: 0.5rem 0.75rem; }
          body.print-a4-one .org-children{ gap: 0.75rem; margin-top: 1.25rem; }
          body.print-a4-one .org-card .text-lg{ font-size: 0.95rem; }
          body.print-a4-one .org-card .text-sm{ font-size: 0.8rem; }
          body.print-a4-one .org-card .text-xs{ font-size: 0.7rem; }
        }

        /* Layout de árvore simples (linhas) */
        .org-tree { display: flex; justify-content: center; }
        .org-node { position: relative; }
        .org-card { background: white; border: 2px solid #e5e7eb; border-radius: 0.75rem; padding: 0.75rem 1rem; box-shadow: 0 1px 2px rgba(0,0,0,0.04); min-width: 220px; }
        .org-children { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; margin-top: 2.5rem; position: relative; }
        .org-node:after { content: ""; position: absolute; top: calc(100% + 4px); left: 50%; width: 2px; height: 24px; background: #e5e7eb; transform: translateX(-50%); }
        .org-children:before { content: ""; position: absolute; top: -24px; left: 10px; right: 10px; height: 
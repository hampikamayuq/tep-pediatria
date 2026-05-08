'use client'

interface Props {
  temas: string[]
  anos: number[]
  filtroTema: string
  filtroAno: string
  filtroDificuldade: string
  filtroStatus: string
  busca: string
  onTema: (v: string) => void
  onAno: (v: string) => void
  onDificuldade: (v: string) => void
  onStatus: (v: string) => void
  onBusca: (v: string) => void
}

export default function FilterBar({ temas, anos, filtroTema, filtroAno, filtroDificuldade, filtroStatus, busca, onTema, onAno, onDificuldade, onStatus, onBusca }: Props) {
  const selectClass = 'text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400'

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <input
        type="text"
        placeholder="Buscar no enunciado..."
        value={busca}
        onChange={e => onBusca(e.target.value)}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <select value={filtroTema} onChange={e => onTema(e.target.value)} className={selectClass}>
        <option value="">Todos os temas</option>
        {temas.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      <select value={filtroAno} onChange={e => onAno(e.target.value)} className={selectClass}>
        <option value="">Todos os anos</option>
        {anos.map(a => <option key={a} value={String(a)}>{a}</option>)}
      </select>
      <select value={filtroDificuldade} onChange={e => onDificuldade(e.target.value)} className={selectClass}>
        <option value="">Dificuldade</option>
        <option value="facil">Fácil</option>
        <option value="media">Médio</option>
        <option value="dificil">Difícil</option>
      </select>
      <select value={filtroStatus} onChange={e => onStatus(e.target.value)} className={selectClass}>
        <option value="">Todos</option>
        <option value="nao_respondidas">Não respondidas</option>
        <option value="erradas">Erradas</option>
        <option value="acertadas">Acertadas</option>
      </select>
    </div>
  )
}

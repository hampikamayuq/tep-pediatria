'use client'
import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import QuestionCard from '@/components/QuestionCard'
import FilterBar from '@/components/FilterBar'
import { getQuestoes, getTemas, getAnos } from '@/lib/data'
import { getProgresso, registrarResposta } from '@/lib/storage'
import type { Questao, Progresso } from '@/lib/types'

function ObjetivasContent() {
  const searchParams = useSearchParams()
  const [questoes, setQuestoes] = useState<Questao[]>([])
  const [filtradas, setFiltradas] = useState<Questao[]>([])
  const [temas, setTemas] = useState<string[]>([])
  const [anos, setAnos] = useState<number[]>([])
  const [prog, setProg] = useState<Progresso | null>(null)
  const [loading, setLoading] = useState(true)

  const [filtroTema, setFiltroTema] = useState('')
  const [filtroAno, setFiltroAno] = useState('')
  const [filtroDificuldade, setFiltroDificuldade] = useState('')
  const [filtroStatus, setFiltroStatus] = useState(searchParams.get('filtro') ?? '')
  const [busca, setBusca] = useState('')

  const [pagina, setPagina] = useState(0)
  const POR_PAGINA = 10

  useEffect(() => {
    getQuestoes().then(qs => {
      setQuestoes(qs)
      setTemas(getTemas(qs))
      setAnos(getAnos(qs))
      setLoading(false)
    })
    setProg(getProgresso())
  }, [])

  const aplicarFiltros = useCallback(() => {
    const p = getProgresso()
    setProg(p)
    let qs = [...questoes]
    if (filtroTema) qs = qs.filter(q => q.theme === filtroTema)
    if (filtroAno) qs = qs.filter(q => String(q.year) === filtroAno)
    if (filtroDificuldade) qs = qs.filter(q => q.difficulty === filtroDificuldade)
    if (busca) qs = qs.filter(q => q.statement.toLowerCase().includes(busca.toLowerCase()))
    if (filtroStatus === 'erradas') qs = qs.filter(q => p.questoes_respondidas[q.id]?.correta === false)
    if (filtroStatus === 'acertadas') qs = qs.filter(q => p.questoes_respondidas[q.id]?.correta === true)
    if (filtroStatus === 'nao_respondidas') qs = qs.filter(q => !p.questoes_respondidas[q.id])
    setFiltradas(qs)
    setPagina(0)
  }, [questoes, filtroTema, filtroAno, filtroDificuldade, filtroStatus, busca])

  useEffect(() => { aplicarFiltros() }, [aplicarFiltros])

  const handleAnswer = (id: string, resposta: string, correta: boolean, tema: string) => {
    const p = registrarResposta(id, resposta, correta, tema)
    setProg(p)
  }

  const questoesPagina = filtradas.slice(pagina * POR_PAGINA, (pagina + 1) * POR_PAGINA)
  const totalPaginas = Math.ceil(filtradas.length / POR_PAGINA)

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400">Carregando questões...</div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Questões Objetivas</h1>
        <span className="text-sm text-gray-500 bg-white border rounded-lg px-3 py-1">
          {filtradas.length} questões
        </span>
      </div>

      <FilterBar
        temas={temas} anos={anos}
        filtroTema={filtroTema} filtroAno={filtroAno}
        filtroDificuldade={filtroDificuldade} filtroStatus={filtroStatus}
        busca={busca}
        onTema={setFiltroTema} onAno={setFiltroAno}
        onDificuldade={setFiltroDificuldade} onStatus={setFiltroStatus}
        onBusca={setBusca}
      />

      {filtradas.length === 0 ? (
        <div className="text-center py-20 text-gray-400">Nenhuma questão encontrada com esses filtros.</div>
      ) : (
        <div className="space-y-4">
          {questoesPagina.map(q => (
            <QuestionCard
              key={q.id}
              questao={q}
              onAnswer={handleAnswer}
              respostaAnterior={prog?.questoes_respondidas[q.id]}
            />
          ))}
        </div>
      )}

      {totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            onClick={() => setPagina(p => Math.max(0, p - 1))}
            disabled={pagina === 0}
            className="px-4 py-2 rounded-lg border text-sm font-medium disabled:opacity-40 hover:bg-gray-100 transition-colors"
          >
            ← Anterior
          </button>
          <span className="text-sm text-gray-600">
            Página {pagina + 1} de {totalPaginas}
          </span>
          <button
            onClick={() => setPagina(p => Math.min(totalPaginas - 1, p + 1))}
            disabled={pagina === totalPaginas - 1}
            className="px-4 py-2 rounded-lg border text-sm font-medium disabled:opacity-40 hover:bg-gray-100 transition-colors"
          >
            Próxima →
          </button>
        </div>
      )}
    </div>
  )
}

export default function ObjetivasPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64 text-gray-400">Carregando...</div>}>
      <ObjetivasContent />
    </Suspense>
  )
}

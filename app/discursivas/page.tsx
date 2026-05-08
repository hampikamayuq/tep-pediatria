'use client'
import { useEffect, useState } from 'react'
import { getCasos, getRubricas } from '@/lib/data'
import type { CasoDiscursivo, Rubrica } from '@/lib/types'

export default function DiscursivasPage() {
  const [casos, setCasos] = useState<CasoDiscursivo[]>([])
  const [rubricas, setRubricas] = useState<Record<string, Rubrica>>({})
  const [aberto, setAberto] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [filtroTema, setFiltroTema] = useState('')
  const [busca, setBusca] = useState('')

  useEffect(() => {
    Promise.all([getCasos(), getRubricas()]).then(([cs, rs]) => {
      setCasos(cs)
      setRubricas(rs)
      setLoading(false)
    })
  }, [])

  const temas = [...new Set(casos.map(c => c.theme))].sort()

  const filtrados = casos.filter(c => {
    if (filtroTema && c.theme !== filtroTema) return false
    if (busca && !c.statement.toLowerCase().includes(busca.toLowerCase())) return false
    return true
  })

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400">Carregando casos...</div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Casos Discursivos</h1>
        <span className="text-sm text-gray-500 bg-white border rounded-lg px-3 py-1">{filtrados.length} casos</span>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Buscar no enunciado..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={filtroTema}
          onChange={e => setFiltroTema(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Todos os temas</option>
          {temas.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Lista de casos */}
      <div className="space-y-3">
        {filtrados.map(caso => {
          const isOpen = aberto === caso.id
          const rubrica = rubricas[caso.case_id]
          return (
            <div key={caso.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* Header do caso */}
              <button
                onClick={() => setAberto(isOpen ? null : caso.id)}
                className="w-full text-left p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{caso.id}</span>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{caso.theme}</span>
                      {caso.subtheme && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{caso.subtheme}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed mt-1">
                      {caso.statement}
                    </p>
                  </div>
                  <span className="text-gray-400 text-lg shrink-0">{isOpen ? '▲' : '▼'}</span>
                </div>
              </button>

              {/* Conteúdo expandido */}
              {isOpen && (
                <div className="border-t border-gray-100 p-5 space-y-5">
                  {/* Enunciado completo */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Enunciado</p>
                    <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{caso.statement}</p>
                  </div>

                  {/* Pergunta */}
                  {caso.question && (
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Pergunta</p>
                      <p className="text-sm text-blue-900 font-medium whitespace-pre-wrap">{caso.question}</p>
                    </div>
                  )}

                  {/* Resposta esperada */}
                  {caso.expected_answer && (
                    <div className="bg-green-50 rounded-xl p-4">
                      <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">Resposta esperada</p>
                      <p className="text-sm text-green-900 leading-relaxed whitespace-pre-wrap">{caso.expected_answer}</p>
                    </div>
                  )}

                  {/* Rubrica / scoring items */}
                  {rubrica?.scoring_items && rubrica.scoring_items.length > 0 && (
                    <div className="bg-yellow-50 rounded-xl p-4">
                      <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide mb-3">Critérios de pontuação</p>
                      <div className="space-y-2">
                        {rubrica.scoring_items.map((item, i) => (
                          <div key={i} className="flex items-start justify-between gap-3">
                            <p className="text-sm text-yellow-900 flex-1">{item.item}</p>
                            {item.points !== null && (
                              <span className="text-xs font-bold text-yellow-700 bg-yellow-200 px-2 py-0.5 rounded-full shrink-0">
                                {item.points} pt{item.points !== 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {caso.status_2026 === 'revisar' && (
                    <p className="text-xs text-orange-600 bg-orange-50 rounded-lg px-3 py-2">
                      ⚠ Status: <strong>revisar</strong> — resposta didática, pendente de validação por fonte oficial 2026.
                    </p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

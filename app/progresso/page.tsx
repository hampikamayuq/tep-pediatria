'use client'
import { useEffect, useState } from 'react'
import { getProgresso, resetProgresso } from '@/lib/storage'
import type { Progresso } from '@/lib/types'
import StatCard from '@/components/StatCard'

export default function ProgressoPage() {
  const [prog, setProg] = useState<Progresso | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => { setProg(getProgresso()) }, [])

  const handleReset = () => {
    resetProgresso()
    setProg(getProgresso())
    setConfirmReset(false)
  }

  if (!prog) return null

  const pct = prog.total_questoes > 0 ? Math.round((prog.acertos / prog.total_questoes) * 100) : 0

  const temasOrdenados = Object.entries(prog.desempenho_por_tema)
    .map(([tema, d]) => ({
      tema,
      acertos: d.acertos,
      total: d.total,
      pct: Math.round((d.acertos / d.total) * 100),
    }))
    .sort((a, b) => b.total - a.total)

  const temasFortes = temasOrdenados.filter(t => t.pct >= 70 && t.total >= 2)
  const temasFracos = temasOrdenados.filter(t => t.pct < 50 && t.total >= 2)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Meu Progresso</h1>
        {prog.total_questoes > 0 && (
          <button
            onClick={() => setConfirmReset(true)}
            className="text-sm text-red-500 hover:text-red-700 border border-red-200 rounded-lg px-3 py-1.5 transition-colors"
          >
            Zerar progresso
          </button>
        )}
      </div>

      {confirmReset && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
          <p className="text-sm text-red-700 font-medium">Tem certeza? Todo o progresso será apagado.</p>
          <div className="flex gap-2">
            <button onClick={handleReset} className="bg-red-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-red-700">Confirmar</button>
            <button onClick={() => setConfirmReset(false)} className="bg-white text-gray-600 text-sm px-3 py-1.5 rounded-lg border">Cancelar</button>
          </div>
        </div>
      )}

      {prog.total_questoes === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <p className="text-5xl mb-4">📊</p>
          <p className="text-gray-500">Você ainda não respondeu nenhuma questão.</p>
          <a href="/objetivas" className="mt-4 inline-block text-blue-700 font-medium hover:underline">
            Começar agora →
          </a>
        </div>
      ) : (
        <>
          {/* Stats gerais */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Respondidas" value={prog.total_questoes} sub="de 295" color="blue" />
            <StatCard label="Acertos" value={prog.acertos} color="green" />
            <StatCard label="Erros" value={prog.erros} color="red" />
            <StatCard label="Aproveitamento" value={`${pct}%`} color={pct >= 60 ? 'green' : pct >= 40 ? 'yellow' : 'red'} />
          </div>

          {/* Barra geral */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Aproveitamento geral</span>
              <span className="text-sm font-bold">{pct}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${pct >= 60 ? 'bg-green-500' : pct >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>0%</span>
              <span className="text-yellow-500 font-medium">60% (aprovação)</span>
              <span>100%</span>
            </div>
          </div>

          {/* Temas fortes / fracos */}
          <div className="grid md:grid-cols-2 gap-6">
            {temasFortes.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-base font-semibold text-green-700 mb-4">✅ Temas fortes</h2>
                <div className="space-y-3">
                  {temasFortes.slice(0, 6).map(({ tema, pct: p, acertos, total }) => (
                    <div key={tema}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 truncate max-w-xs">{tema}</span>
                        <span className="text-green-600 font-medium">{p}% · {acertos}/{total}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div className="h-full bg-green-400 rounded-full" style={{ width: `${p}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {temasFracos.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-base font-semibold text-red-700 mb-4">⚠️ Temas a reforçar</h2>
                <div className="space-y-3">
                  {temasFracos.slice(0, 6).map(({ tema, pct: p, acertos, total }) => (
                    <div key={tema}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 truncate max-w-xs">{tema}</span>
                        <span className="text-red-600 font-medium">{p}% · {acertos}/{total}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div className="h-full bg-red-400 rounded-full" style={{ width: `${p}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Todos os temas */}
          {temasOrdenados.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-base font-semibold text-gray-700 mb-4">Todos os temas respondidos</h2>
              <div className="space-y-3">
                {temasOrdenados.map(({ tema, pct: p, acertos, total }) => (
                  <div key={tema}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 truncate max-w-sm">{tema}</span>
                      <span className={`font-medium ${p >= 60 ? 'text-green-600' : p >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {p}% · {acertos}/{total}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div
                        className={`h-full rounded-full ${p >= 60 ? 'bg-green-400' : p >= 40 ? 'bg-yellow-400' : 'bg-red-400'}`}
                        style={{ width: `${p}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import StatCard from '@/components/StatCard'
import { getProgresso } from '@/lib/storage'
import type { Progresso } from '@/lib/types'

export default function Dashboard() {
  const [prog, setProg] = useState<Progresso | null>(null)

  useEffect(() => {
    setProg(getProgresso())
  }, [])

  const pct = prog && prog.total_questoes > 0
    ? Math.round((prog.acertos / prog.total_questoes) * 100)
    : 0

  const temasOrdenados = prog
    ? Object.entries(prog.desempenho_por_tema)
        .map(([tema, d]) => ({ tema, pct: Math.round((d.acertos / d.total) * 100), total: d.total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 8)
    : []

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold">TEP Pediatria 2026</h1>
        <p className="mt-2 text-blue-100">Banco de questões comentadas · 295 objetivas · 66 casos discursivos</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/objetivas"
            className="bg-white text-blue-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors"
          >
            Iniciar simulado →
          </Link>
          <Link
            href="/discursivas"
            className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl border border-blue-400 hover:bg-blue-500 transition-colors"
          >
            Casos discursivos
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Seu progresso</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Respondidas" value={prog?.total_questoes ?? 0} sub="de 295 objetivas" color="blue" />
          <StatCard label="Acertos" value={prog?.acertos ?? 0} sub={`${pct}% de aproveitamento`} color="green" />
          <StatCard label="Erros" value={prog?.erros ?? 0} color="red" />
          <StatCard label="Última sessão" value={prog?.ultima_sessao || '—'} color="purple" />
        </div>
      </div>

      {/* Barra de progresso geral */}
      {prog && prog.total_questoes > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Aproveitamento geral</span>
            <span className="text-sm font-bold text-gray-800">{pct}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${pct >= 60 ? 'bg-green-500' : pct >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {/* Desempenho por tema */}
      {temasOrdenados.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Desempenho por tema</h2>
          <div className="space-y-3">
            {temasOrdenados.map(({ tema, pct: p, total }) => (
              <div key={tema}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-700 truncate max-w-xs">{tema}</span>
                  <span className="text-xs text-gray-500">{p}% · {total}q</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
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

      {/* Cards de acesso rápido */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/objetivas?filtro=erradas" className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-blue-300 hover:shadow-sm transition-all group">
          <div className="text-2xl mb-2">📋</div>
          <h3 className="font-semibold text-gray-800 group-hover:text-blue-700">Questões erradas</h3>
          <p className="text-sm text-gray-500 mt-1">Revise o que você errou</p>
        </Link>
        <Link href="/objetivas?simulado=1" className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-blue-300 hover:shadow-sm transition-all group">
          <div className="text-2xl mb-2">⏱</div>
          <h3 className="font-semibold text-gray-800 group-hover:text-blue-700">Simulado cronometrado</h3>
          <p className="text-sm text-gray-500 mt-1">30 questões aleatórias</p>
        </Link>
        <Link href="/discursivas" className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-blue-300 hover:shadow-sm transition-all group">
          <div className="text-2xl mb-2">✍️</div>
          <h3 className="font-semibold text-gray-800 group-hover:text-blue-700">Casos discursivos</h3>
          <p className="text-sm text-gray-500 mt-1">66 casos com correção</p>
        </Link>
      </div>
    </div>
  )
}

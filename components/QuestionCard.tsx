'use client'
import { useState } from 'react'
import type { Questao } from '@/lib/types'

interface Props {
  questao: Questao
  onAnswer?: (id: string, resposta: string, correta: boolean, tema: string) => void
  respostaAnterior?: { resposta: string; correta: boolean }
  modoRevisao?: boolean
}

const DIFICULDADE_LABEL: Record<string, string> = {
  facil: 'Fácil',
  media: 'Médio',
  dificil: 'Difícil',
}

const DIFICULDADE_COLOR: Record<string, string> = {
  facil: 'bg-green-100 text-green-700',
  media: 'bg-yellow-100 text-yellow-700',
  dificil: 'bg-red-100 text-red-700',
}

export default function QuestionCard({ questao, onAnswer, respostaAnterior, modoRevisao }: Props) {
  const [selecionada, setSelecionada] = useState<string | null>(respostaAnterior?.resposta ?? null)
  const [revelada, setRevelada] = useState(!!respostaAnterior || modoRevisao)

  const handleSelect = (letra: string) => {
    if (revelada) return
    setSelecionada(letra)
    setRevelada(true)
    const correta = letra === questao.correct_answer
    onAnswer?.(questao.id, letra, correta, questao.theme)
  }

  const getChoiceClass = (letra: string) => {
    const base = 'flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all text-sm'
    if (!revelada) {
      return `${base} border-gray-200 hover:border-blue-400 hover:bg-blue-50`
    }
    if (letra === questao.correct_answer) {
      return `${base} border-green-500 bg-green-50 text-green-800`
    }
    if (letra === selecionada && letra !== questao.correct_answer) {
      return `${base} border-red-500 bg-red-50 text-red-800`
    }
    return `${base} border-gray-200 opacity-50`
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">{questao.source} · Q{questao.number}</span>
        <span className={`px-2 py-1 rounded-full font-medium ${DIFICULDADE_COLOR[questao.difficulty] ?? 'bg-gray-100 text-gray-600'}`}>
          {DIFICULDADE_LABEL[questao.difficulty] ?? questao.difficulty}
        </span>
        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">{questao.theme}</span>
        {questao.requires_2026_review && (
          <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full">⚠ Revisar 2026</span>
        )}
      </div>

      {/* Enunciado */}
      <p className="text-gray-800 leading-relaxed font-medium">{questao.statement}</p>

      {/* Alternativas */}
      <div className="space-y-2">
        {Object.entries(questao.choices).map(([letra, texto]) => (
          <button key={letra} className={getChoiceClass(letra)} onClick={() => handleSelect(letra)}>
            <span className="font-bold text-base shrink-0 w-6">{letra}</span>
            <span className="flex-1 text-left">{texto}</span>
            {revelada && letra === questao.correct_answer && (
              <span className="shrink-0 text-green-600 text-lg">✓</span>
            )}
            {revelada && letra === selecionada && letra !== questao.correct_answer && (
              <span className="shrink-0 text-red-600 text-lg">✗</span>
            )}
          </button>
        ))}
      </div>

      {/* Gabarito + Comentário */}
      {revelada && questao.commentary && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Comentário</p>
          <p className="text-sm text-blue-900 leading-relaxed">{questao.commentary}</p>
        </div>
      )}
    </div>
  )
}

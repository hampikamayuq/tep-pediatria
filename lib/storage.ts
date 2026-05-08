'use client'
import type { Progresso } from './types'

const KEY = 'tep_progresso'

export function getProgresso(): Progresso {
  if (typeof window === 'undefined') return defaultProgresso()
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : defaultProgresso()
  } catch {
    return defaultProgresso()
  }
}

export function saveProgresso(p: Progresso) {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(p))
}

export function registrarResposta(
  questaoId: string,
  resposta: string,
  correta: boolean,
  tema: string
) {
  const p = getProgresso()
  const jaRespondida = p.questoes_respondidas[questaoId]

  if (!jaRespondida) {
    p.total_questoes++
    if (correta) p.acertos++
    else p.erros++

    if (!p.desempenho_por_tema[tema]) {
      p.desempenho_por_tema[tema] = { acertos: 0, total: 0 }
    }
    p.desempenho_por_tema[tema].total++
    if (correta) p.desempenho_por_tema[tema].acertos++
  }

  p.questoes_respondidas[questaoId] = { resposta, correta, timestamp: Date.now() }
  p.ultima_sessao = new Date().toISOString().split('T')[0]
  saveProgresso(p)
  return p
}

export function resetProgresso() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(KEY)
}

function defaultProgresso(): Progresso {
  return {
    total_questoes: 0,
    acertos: 0,
    erros: 0,
    desempenho_por_tema: {},
    questoes_respondidas: {},
    discursivas_corrigidas: 0,
    ultima_sessao: '',
  }
}

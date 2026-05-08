export interface Questao {
  id: string
  number: number
  statement: string
  choices: Record<string, string>
  correct_answer: string
  theme: string
  subtheme: string
  difficulty: 'facil' | 'media' | 'dificil'
  status_2026: string
  commentary: string
  source: string
  year: number
  requires_2026_review?: boolean
}

export interface CasoDiscursivo {
  id: string
  case_id: string
  number: number
  statement: string
  question: string
  theme: string
  subtheme: string
  expected_answer: string
  ideal_answer: string
  scoring_items: { item: string; points: number | null }[]
  status_2026: string
  year: number
}

export interface Rubrica {
  case_id: string
  ideal_answer: string
  scoring_items: { item: string; points: number | null }[]
}

export interface Progresso {
  total_questoes: number
  acertos: number
  erros: number
  desempenho_por_tema: Record<string, { acertos: number; total: number }>
  questoes_respondidas: Record<string, { resposta: string; correta: boolean; timestamp: number }>
  discursivas_corrigidas: number
  ultima_sessao: string
}

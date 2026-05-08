import type { Questao, CasoDiscursivo, Rubrica } from './types'

let questoesCache: Questao[] | null = null
let casosCache: CasoDiscursivo[] | null = null
let rubricasCache: Record<string, Rubrica> | null = null

const BASE = process.env.NEXT_PUBLIC_BASE_URL || ''

export async function getQuestoes(): Promise<Questao[]> {
  if (questoesCache) return questoesCache
  const res = await fetch(`${BASE}/data/questoes_objetivas_banco_principal_v8.json`)
  const json = await res.json()
  questoesCache = json.questions as Questao[]
  return questoesCache
}

export async function getCasos(): Promise<CasoDiscursivo[]> {
  if (casosCache) return casosCache
  const res = await fetch(`${BASE}/data/casos_discursivos_banco_total_v8.json`)
  const json = await res.json()
  casosCache = json.cases as CasoDiscursivo[]
  return casosCache
}

export async function getRubricas(): Promise<Record<string, Rubrica>> {
  if (rubricasCache) return rubricasCache
  const res = await fetch(`${BASE}/data/rubricas_discursivas_total_v8.json`)
  const json = await res.json()
  const map: Record<string, Rubrica> = {}
  for (const r of json.rubrics) {
    map[r.case_id] = r
  }
  rubricasCache = map
  return rubricasCache
}

export function getTemas(questoes: Questao[]): string[] {
  return [...new Set(questoes.map(q => q.theme))].sort()
}

export function getAnos(questoes: Questao[]): number[] {
  return [...new Set(questoes.map(q => q.year))].sort((a, b) => b - a)
}

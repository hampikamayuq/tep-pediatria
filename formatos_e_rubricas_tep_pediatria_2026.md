# Formatos complementares — TEP Pediatria 2026

Este arquivo complementa as Instruções compactas do GPT. Use como referência de formatos, esquemas e modelos de saída.

## Dashboard da sessão

```json
{
  "total_questoes": 0,
  "acertos": 0,
  "erros": 0,
  "percentual": 0,
  "desempenho_por_tema": {},
  "desempenho_por_subtema": {},
  "questoes_erradas": [],
  "temas_fracos": [],
  "temas_fortes": [],
  "discursivas_corrigidas": 0,
  "media_discursiva": 0,
  "proxima_revisao": []
}
```

Formato quando o usuário pedir dashboard:

Dashboard da sessão

Questões respondidas:
Acertos:
Erros:
Percentual:

Desempenho por tema:
1.
2.
3.

Temas fortes:
Temas fracos:

Questões erradas para revisar:
Discursivas corrigidas:
Média discursiva:

Próxima ação recomendada:

## JSON de progresso

```json
{
  "data": "AAAA-MM-DD",
  "sessao": "TEP Pediatria 2026",
  "total_questoes": 0,
  "acertos": 0,
  "erros": 0,
  "percentual": 0,
  "desempenho_por_tema": {},
  "questoes_erradas": [],
  "discursivas": [],
  "temas_para_revisar": [],
  "proximo_plano": []
}
```

## JSON aceito para questões objetivas

```json
{
  "source": "TEP 2024 PED",
  "year": 2024,
  "type": "objetiva",
  "questions": [
    {
      "number": 1,
      "statement": "Texto do enunciado",
      "choices": {
        "A": "Alternativa A",
        "B": "Alternativa B",
        "C": "Alternativa C",
        "D": "Alternativa D"
      },
      "correct_answer": "C",
      "theme": "Urgência",
      "subtheme": "PALS",
      "difficulty": "media",
      "status_2026": "revisar",
      "source_validation": "Fonte usada ou pendente",
      "commentary": "Comentário didático"
    }
  ]
}
```

## JSON aceito para casos discursivos

```json
{
  "source": "TEP Discursiva 2024",
  "year": 2024,
  "type": "discursiva",
  "cases": [
    {
      "number": 1,
      "statement": "Texto do caso clínico",
      "question": "Pergunta discursiva",
      "theme": "Neonatologia",
      "subtheme": "Desconforto respiratório",
      "expected_answer": "Resposta esperada",
      "scoring_items": [
        {"item": "Diagnóstico correto", "points": 2}
      ],
      "ideal_answer": "Resposta ideal curta",
      "status_2026": "revisar"
    }
  ]
}
```

## Correção discursiva

Pontuação total:
Itens contemplados:
Itens ausentes:
Erros perigosos:
Comentário de prova:
Resposta ideal curta:
Próxima revisão recomendada:

Regra: usar apenas a rubrica quando existir. Se não existir, classificar como correção didática e manter `status_2026: revisar`.

## Classificação de erro

- erro conceitual
- erro de leitura
- erro de atualização
- erro de memorização
- erro de conduta
- erro de cálculo
- erro por pegadinha

Formato:
Erro identificado:
Tema:
Motivo provável:
Como não errar de novo:
Regra de prova:
Nova questão de reforço:

## Plano semanal

Plano de 7 dias

Dia 1:
Dia 2:
Dia 3:
Dia 4:
Dia 5:
Dia 6:
Dia 7:

Meta da semana:
Indicador de progresso:
Próximo simulado:

## Temas de revisão obrigatória antes de validar para 2026

- Vacinação
- Dengue e arboviroses
- HIV perinatal
- Sífilis congênita
- Tuberculose
- Reanimação neonatal
- BLS/PALS
- Prematuridade e suplementação
- Hipertensão pediátrica
- COVID e recomendações pós-infecção

## Frases obrigatórias úteis

Quando faltar fonte:
"Esta explicação é didática. A questão permanece como revisar porque não há fonte validada anexada."

Quando for tema atualizável:
"Este tema exige conferência em fonte atualizada antes de uso como questão validada para 2026."

Quando faltar histórico:
"Para manter histórico entre sessões, envie o arquivo de progresso anterior ou cole o resumo da última sessão."

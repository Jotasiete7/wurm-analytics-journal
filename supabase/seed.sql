-- Seed Data for Wurm Analytics
-- Run this in your Supabase SQL Editor
insert into public.articles (
        slug,
        category,
        date,
        votes,
        views,
        title_en,
        title_pt,
        excerpt_en,
        excerpt_pt,
        content_en,
        content_pt
    )
values (
        'crushing-mechanics-deep-dive',
        'ANALYSIS',
        '2026-02-01',
        12,
        345,
        'Tool Quality Does Not Affect Crushing Yield',
        'Qualidade da Ferramenta Não Afeta o Rendimento da Britagem',
        'Tests across QL 10–90 show no statistically relevant variance in ore output. Focus on skill gain, not tool improvement.',
        'Testes entre QL 10-90 mostram que não há variação estatística relevante na produção de minério. Foco no ganho de skill, não na ferramenta.',
        '# Research Question
Does the quality of the crude stone tool affect the ore yield when crushing piles, or is it purely skill-dependent?

# Methodology
- **Sample Size**: 1,000 actions.
- **Tools**: QL 10, QL 50, QL 90 Crude Stone Tools.
- **Skill Level**: Fixed at 50 Stone Cutting.

# Conclusion
Tool quality has **no measurable impact**.',
        '# Pergunta de Pesquisa
A qualidade da ferramenta (crude stone tool) afeta a quantidade de minério obtida ao britar, ou depende puramente da skill?

# Metodologia
- **Tamanho da Amostra**: 1.000 ações.
- **Ferramentas**: QL 10, QL 50, QL 90.
- **Skill**: Fixada em 50 Stone Cutting.

# Conclusão
A qualidade da ferramenta **não tem impacto mensurável**.'
    ),
    (
        'lockpicking-success-rates',
        'STATISTICS',
        '2026-01-28',
        45,
        1202,
        'Lockpicking Success: The QL 50 Threshold',
        'Sucesso no Lockpicking: O Limiar do QL 50',
        'Preliminary results show a linear progression in difficulty up to QL 50, after which the curve becomes exponential.',
        'Resultados preliminares mostram progressão linear na dificuldade até QL 50, após o qual a curva se torna exponencial.',
        '# Research Question
Determine the success rate curve for lockpicking relative to Lock Quality vs. Lockpicking Skill.

# Analysis
Preliminary results show a linear progression.',
        '# Pergunta de Pesquisa
Determinar a curva de sucesso de lockpicking relativa à Qualidade da Fechadura vs Skill.

# Análise
Resultados mostram progressão linear.'
    ) on conflict (slug) do nothing;

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv() {
    try {
        // Scripts folder is at root/scripts, .env.local is at root/
        const envPath = path.resolve(__dirname, '../.env.local');
        console.log('📂 Looking for .env.local at:', envPath);

        if (!fs.existsSync(envPath)) {
            console.error('❌ File not found at path');
            return null;
        }
        const content = fs.readFileSync(envPath, 'utf-8');
        const env: Record<string, string> = {};
        content.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) env[key.trim()] = value.trim();
        });
        return env;
    } catch (e) {
        return null;
    }
}

async function seed() {
    console.log('🌱 Seeding Analytics Database...');
    const env = loadEnv();
    if (!env || !env['VITE_SUPABASE_URL'] || !env['VITE_SUPABASE_ANON_KEY']) {
        console.error('❌ Missing .env.local credentials');
        return;
    }

    const supabase = createClient(env['VITE_SUPABASE_URL'], env['VITE_SUPABASE_ANON_KEY']);

    const articles = [
        {
            slug: 'crushing-mechanics-deep-dive',
            category: 'ANALYSIS',
            date: '2026-02-01',
            votes: 12,
            views: 345,
            title_en: 'Tool Quality Does Not Affect Crushing Yield',
            title_pt: 'Qualidade da Ferramenta Não Afeta o Rendimento da Britagem',
            excerpt_en: 'Tests across QL 10–90 show no statistically relevant variance in ore output. Focus on skill gain, not tool improvement.',
            excerpt_pt: 'Testes entre QL 10-90 mostram que não há variação estatística relevante na produção de minério. Foco no ganho de skill, não na ferramenta.',
            content_en: '# Research Question\nDoes the quality of the crude stone tool affect the ore yield when crushing piles, or is it purely skill-dependent?\n\n# Methodology\n- **Sample Size**: 1,000 actions.\n- **Tools**: QL 10, QL 50, QL 90 Crude Stone Tools.\n- **Skill Level**: Fixed at 50 Stone Cutting.\n\n# Conclusion\nTool quality has **no measurable impact**.',
            content_pt: '# Pergunta de Pesquisa\nA qualidade da ferramenta (crude stone tool) afeta a quantidade de minério obtida ao britar, ou depende puramente da skill?\n\n# Metodologia\n- **Tamanho da Amostra**: 1.000 ações.\n- **Ferramentas**: QL 10, QL 50, QL 90.\n- **Skill**: Fixada em 50 Stone Cutting.\n\n# Conclusão\nA qualidade da ferramenta **não tem impacto mensurável**.'
        },
        {
            slug: 'lockpicking-success-rates',
            category: 'STATISTICS',
            date: '2026-01-28',
            votes: 45,
            views: 1202,
            title_en: 'Lockpicking Success: The QL 50 Threshold',
            title_pt: 'Sucesso no Lockpicking: O Limiar do QL 50',
            excerpt_en: 'Preliminary results show a linear progression in difficulty up to QL 50, after which the curve becomes exponential.',
            excerpt_pt: 'Resultados preliminares mostram progressão linear na dificuldade até QL 50, após o qual a curva se torna exponencial.',
            content_en: '# Research Question\nDetermine the success rate curve for lockpicking relative to Lock Quality vs. Lockpicking Skill.\n\n# Analysis\nPreliminary results show a linear progression.',
            content_pt: '# Pergunta de Pesquisa\nDeterminar a curva de sucesso de lockpicking relativa à Qualidade da Fechadura vs Skill.\n\n# Análise\nResultados mostram progressão linear.'
        }
    ];

    const { error } = await supabase.from('articles').upsert(articles, { onConflict: 'slug' });

    if (error) {
        console.error('❌ Error seeding data:', error.message);
    } else {
        console.log('✅ Seed data inserted successfully!');
    }
}

seed();

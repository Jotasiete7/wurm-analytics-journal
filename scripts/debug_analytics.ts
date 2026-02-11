
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Manual env parsing since we might not have dotenv
function loadEnv() {
    try {
        const envPath = path.resolve(__dirname, '../.env.local');
        if (!fs.existsSync(envPath)) {
            console.error('❌ .env.local not found at:', envPath);
            return null;
        }
        const content = fs.readFileSync(envPath, 'utf-8');
        const env: Record<string, string> = {};
        content.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                env[key.trim()] = value.trim();
            }
        });
        return env;
    } catch (e) {
        console.error('❌ Error reading .env.local:', e);
        return null;
    }
}

async function debug() {
    console.log('🔍 Starting Analytics Debug...');

    const env = loadEnv();
    if (!env) return;

    const url = env['VITE_SUPABASE_URL'];
    const key = env['VITE_SUPABASE_ANON_KEY'];

    if (!url || !key) {
        console.error('❌ Missing credentials in .env.local');
        console.log('URL:', url ? '✅ Found' : '❌ Missing');
        console.log('Key:', key ? '✅ Found' : '❌ Missing');
        return;
    }

    console.log('✅ Credentials found. Testing connection to:', url);

    const supabase = createClient(url, key);

    try {
        console.log('📡 Fetching articles...');
        const { data, error } = await supabase
            .from('articles')
            .select('*');

        if (error) {
            console.error('❌ Supabase Error:', error.message);
            console.error('Details:', error);
        } else {
            console.log('✅ Success! Rows returned:', data?.length);
            if (data?.length === 0) {
                console.warn('⚠️ No articles found. Did you run seed.sql?');
            } else {
                console.log('📝 First article:', data![0].slug);
            }
        }
    } catch (e) {
        console.error('❌ Unexpected error:', e);
    }
}

debug();

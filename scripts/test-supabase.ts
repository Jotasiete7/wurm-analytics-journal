
import { createClient } from '@supabase/supabase-js';

const url = 'https://gzhvqprdrtudyokhgxlj.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6aHZxcHJkcnR1ZHlva2hneGxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3NTQ2MTUsImV4cCI6MjA4MzMzMDYxNX0.aSJIhfViQsb0dBjb5bOup49GCrQBt93uSkZySZAXcNo';

const supabase = createClient(url, key);

async function test() {
    console.log('Testing connection to:', url);
    try {
        const start = Date.now();
        const { data, error } = await supabase.from('articles').select('count', { count: 'exact', head: true });
        const end = Date.now();

        if (error) {
            console.error('Error connecting:', error);
        } else {
            console.log('Connection successful! Duration:', end - start, 'ms');
            console.log('Data:', data);
        }
    } catch (e) {
        console.error('Exception:', e);
    }
}

test();

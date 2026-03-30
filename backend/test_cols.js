require('dotenv').config();
const supabase = require('./supabase');

async function testCols() {
  const { data, error } = await supabase.from('applications').select('*').limit(1);
  console.log('Error:', error);
  console.log('Data:', data);
}

testCols();

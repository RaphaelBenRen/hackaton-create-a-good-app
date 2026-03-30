require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testRelations() {
  console.log('Testing /student route relationships...');
  const res1 = await supabase
    .from('applications')
    .select('*, offers(*, companies(*))')
    .limit(1);
  console.log('Result 1:', res1.error ? res1.error.message : 'Success');

  console.log('Testing /company route relationships...');
  const res2 = await supabase
    .from('applications')
    .select('*, offers(*), students(*)')
    .limit(1);
  console.log('Result 2:', res2.error ? res2.error.message : 'Success');
}

testRelations();

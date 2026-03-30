require('dotenv').config();
const fs = require('fs');
const supabase = require('./supabase');

async function testRelations() {
  const q1 = await supabase.from('applications').select('*, students(*)').limit(1);
  const q2 = await supabase.from('applications').select('*, users(*)').limit(1);
  const q3 = await supabase.from('applications').select('*, profiles(*)').limit(1);
  const q4 = await supabase.from('applications').select('*, public_students:students(*)').limit(1);
  
  const results = {
    students: q1.error ? q1.error.message : 'Success',
    users: q2.error ? q2.error.message : 'Success',
    profiles: q3.error ? q3.error.message : 'Success',
    public_students: q4.error ? q4.error.message : 'Success',
  };
  fs.writeFileSync('out.json', JSON.stringify(results, null, 2));
}

testRelations();

const fs = require('fs');
const path = require('path');
const file = 'c:/Users/33628/OneDrive - Groupe INSEEC (POCE)/Documents/Hackaton create a good app/frontend/src/screens/main/StudentDetailScreen.js';
try {
  const content = fs.readFileSync(file, 'utf8');
  // Simple brace/paren balancer
  let braces = 0;
  let parens = 0;
  let lines = content.split('\n');
  lines.forEach((line, i) => {
    for (let char of line) {
      if (char === '{') braces++;
      if (char === '}') braces--;
      if (char === '(') parens++;
      if (char === ')') parens--;
    }
    if (braces < 0) console.log(`Brace error at line ${i+1}`);
    if (parens < 0) console.log(`Paren error at line ${i+1}`);
  });
  console.log('Final counts:', { braces, parens });
} catch (e) {
  console.log(e);
}

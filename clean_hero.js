import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

const regex = /<div class="stat-label">Independent Safety Architecture<\/div>[\s\S]*?<div class="stat-label">Accessible Giant Push-To-Talk Mic<\/div>\s*<\/div>\s*<\/div>/;

if (regex.test(html)) {
  html = html.replace(regex, '');
  fs.writeFileSync('index.html', html);
  console.log('Successfully stripped leftover BlindSight hero stats');
} else {
  console.log('Regex did not match');
}

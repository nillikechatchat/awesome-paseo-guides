#!/bin/bash
set -e
cd "$(dirname "$0")/.."

TMP_JSON=$(mktemp)
trap "rm -f $TMP_JSON" EXIT

# Build gist JSON using node
node -e "
const fs = require('fs');
const path = require('path');
const FILES = [
  'site/index.html', 'README.md',
  'plugins/hello-world/paseo.json', 'plugins/hello-world/package.json', 'plugins/hello-world/index.js',
  'plugins/logger/paseo.json', 'plugins/logger/package.json', 'plugins/logger/index.js',
  'tutorials/01-quick-start.md', 'tutorials/02-workspaces.md', 'tutorials/03-agents.md',
  'tutorials/04-schedules.md', 'tutorials/05-plugins.md', 'tutorials/06-providers.md',
  'experiences/01-async-workflow.md', 'experiences/02-workspace-isolation.md',
  'experiences/03-schedule-traps.md', 'experiences/04-prompt-engineering.md'
];
const ROOT = process.cwd();
const files = {};
for (const f of FILES) {
  try { files[f] = { content: fs.readFileSync(path.join(ROOT, f), 'utf-8') }; }
  catch(e) { console.error('Skip:', f); }
}
console.log(JSON.stringify({ description: 'Paseo Guides - 智能代理编排平台使用指南', public: true, files }));
" > "$TMP_JSON"

echo "📦 准备发布 $(cat $TMP_JSON | node -e "let s='';process.stdin.on('data',d=>s+=d);process.stdin.on('end',()=>{const j=JSON.parse(s);console.log(Object.keys(j.files).length+' 个文件')}")" 个文件..."

# Use gh api to create gist
RESULT=$(gh api gists --method POST --input "$TMP_JSON")

GIST_ID=$(echo "$RESULT" | node -e "let s='';process.stdin.on('data',d=>s+=d);process.stdin.on('end',()=>{console.log(JSON.parse(s).id)})")
GIST_URL=$(echo "$RESULT" | node -e "let s='';process.stdin.on('data',d=>s+=d);process.stdin.on('end',()=>{console.log(JSON.parse(s).html_url)})")

echo "✅ Gist 创建成功！"
echo ""
echo "📎 Gist URL: $GIST_URL"
echo "📄 站点预览: ${GIST_URL}/site/index.html"
echo ""
echo "📋 文件列表:"
echo "$RESULT" | node -e "
let s='';
process.stdin.on('data',d=>s+=d);
process.stdin.on('end',()=>{
  const j=JSON.parse(s);
  Object.entries(j.files).forEach(([name,meta])=>{
    console.log('   - '+name+' ('+meta.size+' bytes)');
  });
});
"
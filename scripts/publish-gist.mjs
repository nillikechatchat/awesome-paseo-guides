import { readFileSync } from 'fs';

const TOKEN = process.env.GITHUB_TOKEN;
if (!TOKEN) {
  console.error('❌ GITHUB_TOKEN 环境变量未设置');
  process.exit(1);
}

// Map source paths to flat gist filenames (no slashes allowed)
const FILE_MAP = [
  ['site/index.html', 'index.html'],
  ['README.md', 'README.md'],
  ['tutorials/01-installation.md', 'tutorials-01-installation.md'],
  ['tutorials/02-agents-rules.md', 'tutorials-02-agents-rules.md'],
  ['tutorials/03-agents-config.md', 'tutorials-03-agents-config.md'],
  ['tutorials/04-permissions.md', 'tutorials-04-permissions.md'],
  ['tutorials/05-mcp-servers.md', 'tutorials-05-mcp-servers.md'],
  ['tutorials/06-plugins-dev.md', 'tutorials-06-plugins-dev.md'],
  ['tutorials/07-custom-tools.md', 'tutorials-07-custom-tools.md'],
  ['tutorials/08-cli-reference.md', 'tutorials-08-cli-reference.md'],
  ['tutorials/09-providers-models.md', 'tutorials-09-providers-models.md'],
  ['tutorials/10-ecosystem.md', 'tutorials-10-ecosystem.md'],
  ['experiences/01-async-workflow.md', 'experiences-01-async-workflow.md'],
  ['experiences/02-workspace-isolation.md', 'experiences-02-workspace-isolation.md'],
  ['experiences/03-schedule-traps.md', 'experiences-03-schedule-traps.md'],
  ['experiences/04-prompt-engineering.md', 'experiences-04-prompt-engineering.md'],
];

const files = {};
console.log('📦 收集文件...');

for (const [srcPath, gistFilename] of FILE_MAP) {
  try {
    const content = readFileSync(srcPath, 'utf-8');
    files[gistFilename] = { content };
    console.log(`  ✓ ${srcPath} → ${gistFilename} (${content.length} bytes)`);
  } catch (e) {
    console.error(`  ✗ ${srcPath} - 跳过`);
  }
}

const body = JSON.stringify({
  description: 'Paseo Guides - 智能代理编排平台使用指南',
  public: true,
  files
});

console.log(`\n🌐 发布 Gist (total: ${body.length} bytes)...`);

const response = await fetch('https://api.github.com/gists', {
  method: 'POST',
  headers: {
    'Authorization': `token ${TOKEN}`,
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.github.v3+json'
  },
  body
});

if (!response.ok) {
  const errorData = await response.json();
  console.error('❌ GitHub API 错误:', JSON.stringify(errorData, null, 2));
  process.exit(1);
}

const gist = await response.json();
console.log('✅ Gist 创建成功！');
console.log('');
console.log('📎 Gist URL:', gist.html_url);
console.log('📄 站点预览:', gist.files['index.html']?.raw_url);
console.log('📋 文件数:', Object.keys(files).length);
console.log('');
console.log('📋 文件列表:');
for (const [name, meta] of Object.entries(gist.files)) {
  console.log('   - ' + name + ' (' + meta.size + ' bytes)');
}
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const TOKEN = process.env.GITHUB_TOKEN;

if (!TOKEN) {
  console.error('❌ GITHUB_TOKEN 环境变量未设置');
  console.error('   请先配置: export GITHUB_TOKEN=your_github_token');
  console.error('   Token 需要 gist 权限，可以在 https://github.com/settings/tokens 创建');
  process.exit(1);
}

// Files to include in gist (relative paths from repo root)
const FILES_TO_INCLUDE = [
  'site/index.html',
  'README.md',
  'plugins/hello-world/paseo.json',
  'plugins/hello-world/package.json',
  'plugins/hello-world/index.js',
  'plugins/logger/paseo.json',
  'plugins/logger/package.json',
  'plugins/logger/index.js',
  'tutorials/01-quick-start.md',
  'tutorials/02-workspaces.md',
  'tutorials/03-agents.md',
  'tutorials/04-schedules.md',
  'tutorials/05-plugins.md',
  'tutorials/06-providers.md',
  'experiences/01-async-workflow.md',
  'experiences/02-workspace-isolation.md',
  'experiences/03-schedule-traps.md',
  'experiences/04-prompt-engineering.md',
];

async function main() {
  console.log('📦 收集文件...');
  const files = {};
  let errors = 0;

  for (const relPath of FILES_TO_INCLUDE) {
    const fullPath = path.join(REPO_ROOT, relPath);
    try {
      const content = fs.readFileSync(fullPath, 'utf-8');
      files[relPath] = { content };
      console.log(`  ✓ ${relPath} (${content.length} bytes)`);
    } catch (e) {
      console.error(`  ✗ ${relPath} - 跳过`);
      errors++;
    }
  }

  if (errors === FILES_TO_INCLUDE.length) {
    console.error('❌ 没有成功读取任何文件');
    process.exit(1);
  }

  const gistData = {
    description: 'Paseo Guides - 智能代理编排平台使用指南',
    public: true,
    files
  };

  console.log(`\n🌐 发布 Gist...`);

  const response = await fetch('https://api.github.com/gists', {
    method: 'POST',
    headers: {
      'Authorization': `token ${TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'paseo-guides-gist-publisher'
    },
    body: JSON.stringify(gistData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('❌ GitHub API 错误:', errorData.message || errorData);
    console.error(`   HTTP ${response.status}`);
    if (errorData.message && errorData.message.includes('rate')) {
      console.error('   可能是 API 限流，请稍后重试');
    }
    process.exit(1);
  }

  const gist = await response.json();
  console.log('✅ Gist 创建成功！');
  console.log('');
  console.log(`📎 Gist URL: ${gist.html_url}`);
  console.log(`📄 站点预览: ${gist.html_url}/site/index.html`);
  console.log(`📋 Files: ${Object.keys(files).length} 个文件`);
  console.log('');
  console.log('📋 Gist 文件列表:');
  for (const [name, meta] of Object.entries(gist.files)) {
    console.log(`   - ${name} (${meta.size} bytes)`);
  }
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
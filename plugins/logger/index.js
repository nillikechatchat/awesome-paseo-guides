const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '.logs');
const LOG_FILE = path.join(LOG_DIR, 'activity.jsonl');

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const log = async (params) => {
  const entry = {
    timestamp: new Date().toISOString(),
    level: params.level || 'info',
    message: params.message,
    agentId: params.agentId || 'unknown'
  };
  fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + '\n');
  return { status: 'recorded' };
};

const getLogs = async (params) => {
  const lines = fs.readFileSync(LOG_FILE, 'utf-8').split('\n').filter(Boolean);
  const limit = params?.limit || 20;
  return lines.slice(-limit).map(l => JSON.parse(l));
};

if (require.main === module) {
  const action = process.argv[2] || '--record';
  if (action === '--record') {
    console.log(JSON.stringify(await log({ message: 'Manual log entry' })));
  } else if (action === '--serve') {
    console.log('Logger service running...');
  }
}

module.exports = { log, getLogs };
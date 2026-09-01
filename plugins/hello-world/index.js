const hello = async (params) => {
  const name = params?.name || 'World';
  return { message: `Hello, ${name}! 欢迎使用 Paseo 插件。` };
};

if (require.main === module) {
  const args = process.argv.slice(2);
  const name = args.find(a => a.startsWith('--name='))?.split('=')[1];
  console.log(JSON.stringify(await hello({ name })));
}

module.exports = { hello };
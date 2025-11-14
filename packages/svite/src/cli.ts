import cac from 'cac';
import { readFileSync } from 'node:fs'

const { version: VERSION } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)).toString());

const cli = cac('svite');

// 全局配置
cli
  .option('-m, --mode <mode>', '[string] set env mode')

// dev 配置
cli
  .command('[root]', 'Start svite dev')
  .alias('dev')
  .option('--port [port]', '[number] Port to run dev server on')
  .action(async (root: string, option) => {
    console.log('dev', root, option);

    const { createDevServer } = await import('./server')
    createDevServer({
      root,
      server: {
        port: option.port,
      },
      mode: option.mode
    })
  })

cli.help()
cli.version(VERSION)
cli.parse();
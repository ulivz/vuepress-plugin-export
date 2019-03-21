const puppeteer = require('puppeteer')
const PDFMerge = require('easy-pdf-merge')
const { join } = require('path')
const { dev } = require('vuepress')
const { fs, logger, chalk } = require('@vuepress/shared-utils')
const { red, yellow, gray } = chalk

// Keep silent before running custom command.
logger.setOptions({ logLevel: 1 })

module.exports = (opts = {}, ctx) => ({
  name: 'vuepress-plugin-export',

  chainWebpack(config) {
    config.plugins.delete('bar')
    // TODO vuepress should give plugin the ability to remove this plugin
    config.plugins.delete('vuepress-log')
  },

  extendCli(cli) {
    cli
      .command('export [targetDir]', 'export current vuepress site to a PDF file')
      .allowUnknownOptions()
      .action(async (dir = '.') => {
        dir = join(process.cwd(), dir)
        try {
          const nCtx = await dev({
            sourceDir: dir,
            clearScreen: false,
            theme: opts.theme || '@vuepress/default'
          })
          logger.setOptions({ logLevel: 3 })
          logger.info(`Start to generate current site to PDF ...`)
          try {
            await generatePDF(nCtx, {
              port: nCtx.devProcess.port,
              host: nCtx.devProcess.host,
              sorter: opts.sorter
            })
          } catch (error) {
            console.error(red(error))
          }
          nCtx.devProcess.server.close()
          process.exit(0)
        } catch (e) {
          throw e
        }
      })
  }
})

async function generatePDF(ctx, {
  port,
  host,
  sorter,
}) {
  const { pages, tempPath, siteConfig } = ctx
  const tempDir = join(tempPath, 'pdf')
  fs.ensureDirSync(tempDir)

  let exportPages = pages.slice(0)

  if (typeof sorter === 'function') {
    exportPages = exportPages.sort(sorter)
  }

  exportPages = exportPages.map(page => {
    return {
      url: page.path,
      title: page.title,
      location: `http://${host}:${port}${page.path}`,
      path: `${tempDir}/${page.key}.pdf`
    }
  })

  const browser = await puppeteer.launch()
  const browserPage = await browser.newPage()

  for (let i = 0; i < exportPages.length; i++) {
    const {
      location,
      path: pagePath,
      url,
      title
    } = exportPages[i]

    await browserPage.goto(
      location,
      { waitUntil: 'networkidle2' }
    )

    await browserPage.pdf({
      path: pagePath,
      format: 'A4'
    })

    logger.success(`Generated ${yellow(title)} ${gray(`${url}`)}`)
  }

  const files = exportPages.map(({ path }) => path)
  const outputFilename = siteConfig.title || 'site'
  const outputFile = `${outputFilename}.pdf`

  await new Promise(resolve => {
    PDFMerge(files, outputFile, err => {
      if (err) {
        throw err
      }
      logger.success(`Export ${yellow(outputFile)} file!`)
      resolve()
    })
  })

  await browser.close()
  fs.removeSync(tempDir)
}



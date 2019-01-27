const puppeteer = require('puppeteer')
const PDFMerge = require('easy-pdf-merge')
const { path, fs, logger, chalk } = require('@vuepress/shared-utils')

module.exports = (opts, ctx) => ({
  name: 'vuepress-plugin-export',

  extendCli(cli) {
    cli
      .command('export [targetDir]', 'export current vuepress site to a PDF file')
      .allowUnknownOptions()
      .action(async (dir = '.') => {
        const { dev } = require('vuepress')
        const { port, host, server } = await dev.prepare(path.resolve(dir), {}, ctx)
        server.listen(port, host, async err => {
          if (err) {
            console.error(chalk.red(err))
          }
          console.log(`[vuepress-plugin-export] Start to generate current site to PDF ...`)
          try {
            await exportPDF(ctx, port, host)
            console.log(`[vuepress-plugin-export] Success`)
          } catch (error) {
            console.error(chalk.red(error))
          }
          server.close()
          process.exit(0)
        })
      })
  }
})

function flatternPath(p) {
  return p.replace(/\//g, '-').replace('-', '').replace(/\.html/, '').replace(/-$/, '')
}

async function exportPDF(ctx, port, host) {
  const { pages, outDir, tempPath, siteConfig } = ctx
  const tempDir = path.resolve(tempPath, 'pdf')
  fs.ensureDirSync(tempDir)

  const exportPages = pages.map(page => {
    return {
      url: page.path,
      title: page.title,
      location: `http://${host}:${port}${page.path}`,
      path: `${tempDir}/${flatternPath(page.path)}.pdf`
    }
  })

  const browser = await puppeteer.launch()
  const browserPage = await browser.newPage()

  for (let i = 0; i < exportPages.length; i++) {
    const { location, path: pagePath, url, title } = exportPages[i]
    await browserPage.goto(location, { waitUntil: 'networkidle2' })
    await browserPage.pdf({ path: pagePath, format: 'A4' })
    logger.success(`Generated ${chalk.yellow(title)} ${chalk.gray(`${url}`)}`)
  }

  const files = exportPages.map(({ path }) => path)
  const outputFilename = siteConfig.title || 'my-vuepress-site'
  await new Promise((resolve, reject) => {
    PDFMerge(files, `${outputFilename}.pdf`, (err) => {
      if (err) {
        reject(err)
      }
      logger.success(`export ${outputFilename}.pdf file success!`)
      resolve()
    })
  })

  await browser.close()
  fs.removeSync(tempDir)
}



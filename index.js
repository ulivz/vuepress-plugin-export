const puppeteer = require('puppeteer')
const PDFMerge = require('easy-pdf-merge')
const { join } = require('path')
const { dev } = require('vuepress')
const { fs, logger, chalk } = require('@vuepress/shared-utils')
const { red, yellow, gray } = chalk

// Keep silent before running custom command.
logger.setOptions({ logLevel: 1 })

module.exports = (options = {}, context) => ({
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
          const devContext = await dev({
            sourceDir: dir,
            clearScreen: false,
            theme: options.theme || '@vuepress/default'
          })

          logger.setOptions({ logLevel: 3 })
          logger.info(`Start to generate current site to PDF ...`)

          try {
            await generatePDF(devContext, {
              port: devContext.devProcess.port,
              host: devContext.devProcess.host,
              base: devContext.base,
              options
            })
          } catch (error) {
            logger.error(red(error))
          }

          devContext.devProcess.server.close()
          process.exit(0)
        } catch (error) {
          throw error
        }
      })
  }
})

const applyFilter = (filter) => {
  if (typeof filter === 'function') {
    return (page) => filter(page.location, page)
  }

  return (page) => {
    return !filter || filter.test(page.location)
  }
}

const createOutputFilename = (dest, pluginConfig, fallback) => {
  if (typeof dest === 'function') {
    return dest(pluginConfig)
  }

  if (typeof dest === 'string') {
    return dest
  }

  return `${pluginConfig.title || String(fallback)}.pdf`
}

async function generatePDF(context, {
  port,
  host,
  base,
  // options can be either a single or multiple option objects
  options: multiOptions,
}) {
  const { pages, tempPath, siteConfig } = context
  const tempDir = join(tempPath, 'pdf')

  multiOptions = Array.isArray(multiOptions) ? multiOptions : [multiOptions]

  fs.ensureDirSync(tempDir)

  const browser = await puppeteer.launch()
  const browserPage = await browser.newPage()

  // Generate all pages on bulk
  const exportPages = pages.slice(0).map(page => {
    return {
      url: page.path,
      title: page.title,
      location: `http://${host}:${port}${base || ''}${page.path}`.replace(/\/\//g, '/'),
      path: `${tempDir}/${page.key}.pdf`
    }
  })

  for (const exportPage of exportPages) {
    const {
      location,
      path: pagePath,
      url,
      title
    } = exportPage

    await browserPage.goto(
      location,
      { waitUntil: 'networkidle2' }
    )

    await new Promise(resolve => setTimeout(resolve, 5000))

    await browserPage.pdf({
      path: pagePath,
      format: 'A4'
    })

    logger.success(`Generated ${yellow(title)} ${gray(`${url}`)}`)
  }

  await browser.close()

  for (const options of multiOptions) {
    const files = exportPages
      .filter(applyFilter(options.filter))
      .sort(options.sorter)
      .map(({ path }) => path)

    const outputFile = createOutputFilename(options.dest, siteConfig, 'site')
    if (files.length === 0) {
      logger.warn('WARN. Found no files to export!')
    }
    else if (files.length === 1) {
      const [filename] = files
      fs.copyFileSync(filename, outputFile)
      logger.success(`Export ${yellow(outputFile)} file!`)
    } else {
      await new Promise(resolve => {
        PDFMerge(files, outputFile, error => {
          if (error) {
            throw error
          }
          logger.success(`Export ${yellow(outputFile)} file!`)
          resolve()
        })
      })
    }
  }

  fs.removeSync(tempDir)
}

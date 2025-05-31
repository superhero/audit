import util from 'node:util'

util.inspect.defaultOptions = 
{
  colors          : true,
  depth           : 16,
  maxArrayLength  : 32,
  compact         : 3,
}

const errors = []

export default async function * (source)
{
  yield format.headline('⋅⋆ Suite ⋆⋅', format.columns.size)

  for await (const event of source)
  {
    switch (event.type)
    {
      // case 'test:dequeue':
      // case 'test:watch:drained':
      // case 'test:pass':
      // case 'test:fail':
      // case 'test:plan':
      // case 'test:diagnostic':
      // case 'test:stderr':
      // case 'test:stdout':
      // case 'test:dequeue':
      // case 'test:watch:drained':
      // case 'test:pass':
      // case 'test:fail':
      // case 'test:plan':
      // case 'test:diagnostic':
      // -------------------
      // Standard output....
      // -------------------
      case 'test:stderr'  : yield format.color.reset + format.color.dim + format.color.failed + event.data.message + format.color.reset; break
      case 'test:stdout'  : yield format.color.reset + format.color.dim + format.color.stdout + event.data.message + format.color.reset; break
      // ----------------
      // Test started....
      // ----------------
      case 'test:dequeue' :
      {
        if(event.data.line > 1)
        {
          const
            tree   = event.data.nesting ? format.tree.tee(event.data.nesting - 1) : '',
            output = tree + format.color.title + event.data.name + format.color.reset

          yield output + '\n'

          format.columns.expand(output)
        }

        break
      }
      // ------------------
      // Test completed....
      // ------------------
      case 'test:complete':
      {
        if(event.data.line > 1)
        {
          // dequeued case not triggered on cancelled tests, missing test name if we don't call it here...
          if('cancelledByParent' === event.data.details.error?.failureType)
          {
            const
              tree   = event.data.nesting ? format.tree.tee(event.data.nesting - 1) : '',
              output = tree + format.color.title + event.data.name + format.color.reset

            yield output + '\n'

            format.columns.expand(output)
          }

          const
            tree        = format.tree.hook(event.data.nesting),
            duration    = format.duration(event.data.details.duration_ms),
            icon        = event.data.details.passed ? '✔' : '✘',
            color       = event.data.details.passed ? format.color.passed : format.color.failed,
            type        = event.data.details.type ? event.data.details.type + ' ' : '',
            description = type + (event.data.details.passed ? 'passed' : 'failed'),
            output      = `${tree}${color}${icon} ${description} ${duration}${format.color.reset}`

          yield output + '\n'

          format.columns.expand(output)
          event.data.details.error && errors.push(event.data)
        }

        break
      }
      // ------------------
      // Summary report....
      // ------------------
      case 'test:summary':
      {
        if(false === !!event.data.file)
        {
          const
            metrics = ['suites', 'tests', 'passed', 'failed', 'cancelled', 'skipped', 'todo'],
            size    = { labels:Math.max(...metrics.map(metric => metric.length)),
                        metric:Math.max(...metrics.map(metric => String(event.data.counts[metric]).length)) },
            center  = Math.floor(format.columns.size / 2)

          yield format.headline(event.data.success ? '⋅⋆ Summary ⋆⋅' : 'Summary', format.columns.size)

          let n = metrics.length

          for(const metric of metrics)
          {
            yield format.color.summary
                + format.capitalize(metric).padEnd(size.labels).padEnd(center)
                + (format.columns.size % 2 ? ' ' : '')
                + String(event.data.counts[metric]).padStart(size.metric).padStart(center)
                + format.color.reset
                + (--n ? '\n' + format.color.tree + (`╌`.repeat(format.columns.size)) + '\n' : '')
          }

          yield format.color.reset

          for(const event of errors)
          {
            yield format.headline(event.name, format.columns.size)
                + format.color.failed + event.file + ':' + event.line + ':' + event.column + '\n'
                + format.tree.tee(0)  + format.color.failed + '✘' + ' ' + format.capitalize(format.splitCamelCase(event.details.error.failureType).toLowerCase())

            switch(event.details.error.failureType)
            {
              case 'subtestsFailed':
              case 'cancelledByParent':
              {
                yield '\n' + format.tree.hook(0) + format.color.failed + format.capitalize(event.details.error.cause)
                break
              }
              case 'testCodeFailure':
              case 'hookFailed':
              default:
              {
                const
                  tree  = format.tree.left(1) + format.color.reset,
                  error = event.details.error.cause || event.details.error

                yield '\n' + format.tree.left(1) + format.color.reset  
                    + '\n' + util.inspect(error, util.inspect.defaultOptions)
                                 .split('\n')
                                 .map(txt => tree + txt)
                                 .join('\n')

                break
              }
            }

            yield '\n'
            yield format.color.reset
          }
          yield '\n'

          const now = new Intl.DateTimeFormat(undefined,
          {
            year  : 'numeric', month : '2-digit', day   : '2-digit',
            hour  : '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false
          }).formatToParts(new Date()).reduce((o, p) => (o[p.type] = p.value, o), {})

          yield format.headline(`${format.color.tree}${format.color.dim}${now.year}-${now.month}-${now.day} ${now.hour}:${now.minute}:${now.second}${format.color.reset}`, format.columns.size)
              + format.color.reset
        }

        break
      }
      // -------------------
      // Coverage report....
      // -------------------
      case 'test:coverage':
      {
        const 
          coverage = [ [ event.data.summary.files.length === 1 ? 'File' : 'Files'], ['Coverage'], ['Branches'], ['Functions'] ],
          total    = event.data.summary.totals,
          cwd      = event.data.summary.workingDirectory

        yield format.headline(total.coveredLinePercent > 80 ? '⋅⋆ Coverage ⋆⋅' : 'Coverage', format.columns.size)

        for(const file of event.data.summary.files)
        {
          coverage[0].push(String(file.path).substring(cwd.length + 1))
          coverage[1].push(Math.floor(file.coveredLinePercent))
          coverage[2].push(Math.floor(file.coveredBranchPercent))
          coverage[3].push(Math.floor(file.coveredFunctionPercent))
        }

        const
          maxPathLength       = Math.max(...coverage[0].map(txt => txt.length)),
          maxCoverageLength   = Math.max(...coverage[1].map(txt => String(txt).length)) + 3,
          maxBranchesLength   = Math.max(...coverage[2].map(txt => String(txt).length)) + 3,
          maxFunctionsLength  = Math.max(...coverage[3].map(txt => String(txt).length)) + 3,
          totalLength         = maxPathLength + maxCoverageLength + maxBranchesLength + maxFunctionsLength,
          maxTotalLength      = Math.max(totalLength, format.columns.size),
          diffTotalLength     = Math.max(0, maxTotalLength - totalLength)

        yield (format.color.tree + format.color.dim)
        yield (coverage[0][0]).padEnd(maxPathLength + diffTotalLength)
            + (coverage[1][0]).padStart(maxCoverageLength)
            + (coverage[2][0]).padStart(maxBranchesLength)
            + (coverage[3][0]).padStart(maxFunctionsLength)
            + '\n'
            + format.color.reset
            + format.color.tree + (`╌`.repeat(maxTotalLength))
            + '\n'

        for(let i = 1; i < coverage[0].length; i++)
        {
          yield format.color.reset
              + (coverage[1][i] >= 90 ? format.color.passed
              : (coverage[1][i] >= 75 ? format.color.warning
              : (format.color.failed)))
              + (coverage[0][i]).padEnd(maxPathLength + diffTotalLength)
              + (coverage[1][i] + '%').padStart(maxCoverageLength)
              + (coverage[2][i] + '%').padStart(maxBranchesLength)
              + (coverage[3][i] + '%').padStart(maxFunctionsLength)
              + '\n'
              + format.color.reset
              + format.color.tree + (`╌`.repeat(maxTotalLength))
              + '\n'
        }

        yield format.color.dim
            + 'Total'.padEnd(maxPathLength + diffTotalLength)
            + (String(Math.floor(total.coveredLinePercent))     + '%').padStart(maxCoverageLength)
            + (String(Math.floor(total.coveredBranchPercent))   + '%').padStart(maxBranchesLength)
            + (String(Math.floor(total.coveredFunctionPercent)) + '%').padStart(maxFunctionsLength)
            + '\n'
            + format.color.reset

        break
      }
    }
  }
}

// ...

const ansi = new class
{
  reset  = util.inspect.defaultOptions.colors ? '\x1b[0m' : ''
  bold   = util.inspect.defaultOptions.colors ? '\x1b[1m' : ''
  dim    = util.inspect.defaultOptions.colors ? '\x1b[2m' : ''
  italic = util.inspect.defaultOptions.colors ? '\x1b[3m' : ''

  color(hex)
  {
    if(typeof hex !== 'string')
    {
      throw new Error(`Color must be a string, got ${typeof hex}`)
    }

    if(false === !!util.inspect.defaultOptions.colors)
    {
      return ''
    }

    let match

    if((match = /^#?([a-f\d]{6})$/i.exec(hex)))
    {
      const [r, g, b] =
      [
        parseInt(match[1].slice(0, 2), 16),
        parseInt(match[1].slice(2, 4), 16),
        parseInt(match[1].slice(4, 6), 16)
      ]

      return `\x1b[38;2;${r};${g};${b}m`
    }

    if((match = /^#?([a-f\d]{3})$/i.exec(hex)))
    {
      const [r, g, b] = match[1].split('').map(ch => parseInt(ch + ch, 16))
      return `\x1b[38;2;${r};${g};${b}m`
    }

    throw new Error(`Invalid hex color: "${hex}" — must be 3 or 6 hex digits`)
  }

  /**
   * @param {string} text - The text to format
   * @param {object} opts - Optional styles
   */
  format(text, { bold, color, dim, italic } = {})
  {
    let out = ''

    if(bold)    out += this.bold
    if(dim)     out += this.dim
    if(italic)  out += this.italic
    if(color)   out += this.color(opts.color)

    return out + text + this.reset
  }
}

const format =
{
  color:
  {
    reset     : ansi.reset,
    dim       : ansi.dim,
    stdout    : ansi.color('#83a1a5'),
    started   : ansi.color('#458588'),
    title     : ansi.color('#d79921'),
    tree      : ansi.color('#3c3836'),
    duration  : ansi.color('#458588'),
    summary   : ansi.color('#458588'),
    passed    : ansi.color('#8ec07c'),
    warning   : ansi.color('#d79921'),
    failed    : ansi.color('#cc241d'),
  },
  capitalize(txt)
  {
    txt = String(txt)
    return txt[0].toUpperCase() + txt.slice(1)
  },
  splitCamelCase(txt)
  {
    return txt.replace(/([a-z])([A-Z])/g, '$1 $2')
  },
  headline(title, columns)
  {
    const
      padded    = ` ${title} `,
      length    = format.columns.count(padded),
      half      = Math.floor(length / 2),
      center    = Math.floor(columns / 2),
      colored   = format.color.title + padded + format.color.tree,
      linePre   = ''.padEnd(center - half, '─'),
      linePost  = ''.padEnd(center - half - (length % 2), '─')

    return '\n' + format.color.reset + format.color.tree + linePre + colored + linePost + '\n\n'
  },
  duration(duration)
  {
    if(0 === duration)
    {
      duration = '-'
    }
    else if(duration < 1e3)
    {
      duration = `${duration}ms`
    }
    else if(duration < 60e3)
    {
      duration = `${Math.floor(duration) / 1e3}s`
    }
    else if(duration < 60 * 60e3)
    {
      const
        s   = Math.floor(duration / 1e3),
        min = Math.floor(s / 60),
        sec = s % 60

      duration = sec
               ? `${min}m ${sec}s`
               : `${min}m`
    }
    else
    {
      const
        s   = Math.floor(duration / 1e3),
        min = Math.floor((s % 3600) / 60),
        h   = Math.floor(s / 3600),
        sec = s % 60

      duration = sec
               ? `${h}h ${min}m ${sec}s`
               : min
               ? `${h}h ${min}m`
               : `${h}h`
    }

    return format.color.duration + duration
  },
  tree:
  {
    top   : (depth) => format.color.tree       + (`─`  .repeat(depth)),
    left  : (depth) => format.color.tree       + ('│  '.repeat(depth)),
    tee   : (depth) => format.tree.left(depth) +  '├─ ',
    hook  : (depth) => format.tree.left(depth) +  '└─ ',
  },
  columns :
  {
    size : 80,
    count:(txt) => String(txt).replace(/\x1b\[[0-9;]+m/g, '').length,
    expand(txt)
    {
      format.columns.size = Math.max(format.columns.size, format.columns.count(txt))
    }
  }
}

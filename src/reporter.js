import util from 'node:util'

util.inspect.defaultOptions = 
{
  colors          : true,
  depth           : 16,
  maxArrayLength  : 32,
  compact         : 3,
}

const errors = []

let i = 0, nesting = 0

export default async function * (source)
{
  for await (const event of source)
  {
    switch (event.type)
    {
      // case 'test:watch:drained':
      // case 'test:enqueue':
      // case 'test:start':
      // case 'test:pass':
      // case 'test:fail':
      // case 'test:plan':
      // case 'test:diagnostic':
      //   yield event.type + '\n'; break
      // -------------------
      // Standard output....
      // -------------------
      case 'test:stdout'  : 
      {
        yield format.headline('⋅• ☀ •⋅', format.columns.size)
        yield format.color.reset + format.color.stdout + event.data.message + format.color.reset
        break
      }
      case 'test:stderr'  :
      {
        yield format.headline(format.color.failed + '⋅• ✖ •⋅' + format.color.reset, format.columns.size)
        yield format.color.reset + format.color.failed + event.data.message + format.color.reset
        break
      }
      // ----------------
      // Test started....
      // ----------------
      case 'test:dequeue' :
      {
        if(event.data.line    > 1
        || event.data.column  > 1)
        {
          yield format.headline('⋅⋆ Suite ⋆⋅', format.columns.size)
          
          const
            tree   = event.data.nesting ? format.tree.tee(event.data.nesting - 1) : '',
            output = tree + format.color.title + event.data.name + format.color.reset

          if(i++)
          {
            yield '\n'
          }

          // yield tree
          yield `${output} `

          format.columns.expand(output)

          nesting = event.data.nesting
        }

        break
      }
      // ------------------
      // Test completed....
      // ------------------
      case 'test:complete':
      {
        if(event.data.line    > 1
        || event.data.column  > 1)
        {
          if(errors.some(error => error.name === event.data.name))
          {
            break 
          }

          const
            tree        = format.tree.hook(event.data.nesting),
            duration    = format.duration(event.data.details.duration_ms),
            icon        = event.data.details.passed ? '✔' : '✘',
            color       = event.data.details.passed ? format.color.passed : format.color.failed,
            type        = event.data.details.type ? event.data.details.type + ' ' : '',
            description = type + (event.data.details.passed ? 'passed' : 'failed'),
            output      = `${tree}${color}${icon} ${description} ${duration}${format.color.reset}`

          if(nesting !== event.data.nesting)
          {
            yield `\n${tree}`
          }

          yield `${color}${icon} ${duration}${format.color.reset}`
          // yield output + '\n'

          format.columns.expand(output)
          if(event.data.details.error)
          {
            errors.push(event.data)
            yield format.color.tree + ' ─ ' + format.color.dim + format.capitalize(event.data.details.error.cause) + format.color.reset
          }

          nesting = event.data.nesting
        }
        else
        {
          yield '\n'
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
            yield format.headline(format.color.failed + event.name + format.color.reset, format.columns.size)
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
          coverage  = [ [ event.data.summary.files.length === 1 ? 'File' : 'Files'], ['Coverage'], ['Functions'], ['Branches'] ],
          total     = event.data.summary.totals,
          cwd       = event.data.summary.workingDirectory,
          uncovered = new Map()

        yield format.headline(total.coveredLinePercent > 80 ? '⋅⋆ Coverage ⋆⋅' : 'Coverage', format.columns.size)

        for(const file of event.data.summary.files)
        {
          const set = new Set()

          for(let i = 0; i < file.lines.length; i++)
          {
            if(file.lines[i].count === 0)
            {
              set.add(file.lines[i].line)
            }
          }

          let filename = String(file.path).substring(cwd.length + 1)

          if(set.size)
          {
            uncovered.set(filename, [ ...set ].map((n, i, a) => n + 1 !== a[i + 1] && a[i + 1] ? `${a[i]}], [${a[i + 1]}` : i === 0 ? `[${a[i]}` : i === a.length - 1 ? `${a[i]}]` : false).filter(Boolean).join('-'))
          }

          coverage[0].push(filename)
          coverage[1].push(Math.floor(file.coveredLinePercent))
          coverage[2].push(Math.floor(file.coveredFunctionPercent))
          coverage[3].push(Math.floor(file.coveredBranchPercent))
        }

        const
          maxPathLength       = Math.max(...coverage[0].map(txt => txt.length)),
          maxCoverageLength   = Math.max(...coverage[1].map(txt => String(txt).length)) + 3,
          maxFunctionsLength  = Math.max(...coverage[2].map(txt => String(txt).length)) + 3,
          maxBranchesLength   = Math.max(...coverage[3].map(txt => String(txt).length)) + 3,
          totalLength         = maxPathLength + maxCoverageLength + maxFunctionsLength + maxBranchesLength,
          maxTotalLength      = Math.max(totalLength, format.columns.size),
          diffTotalLength     = Math.max(0, maxTotalLength - totalLength)

        yield (format.color.tree + format.color.dim)
        yield (coverage[0][0]).padEnd(maxPathLength + diffTotalLength)
            + (coverage[1][0]).padStart(maxCoverageLength)
            + (coverage[2][0]).padStart(maxFunctionsLength)
            + (coverage[3][0]).padStart(maxBranchesLength)
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
              + (coverage[2][i] + '%').padStart(maxFunctionsLength)
              + (coverage[3][i] + '%').padStart(maxBranchesLength)
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

        yield format.headline('⋅⋆ Uncovered ⋆⋅', format.columns.size)

        for(const [file, lines] of uncovered.entries())
        {
          yield format.color.tree + '─ ' + ansi.bold + file + format.color.reset + '\n'
          
          const 
            divided = lines.split(', '),
            row     = []

          for(let n = 2, i = 0; i < divided.length; i++)
          {
            n += divided[i].length + 2

            if(n > format.columns.size)
            {
              yield format.color.tree + '  ' + ansi.dim + row.join(', ') + format.color.reset + '\n'
              row.length = 0
              n = 2
            }

            row.push(divided[i])
          }

          yield format.color.tree + '  ' + ansi.dim + row.join(', ') + format.color.reset + '\n'
        }

        break
      }
    }
  }
}

// ...

const ansi = new class
{
  reset   = util.inspect.defaultOptions.colors ? '\x1b[0m'  : ''
  normal  = util.inspect.defaultOptions.colors ? '\x1b[22m' : ''
  bold    = util.inspect.defaultOptions.colors ? '\x1b[1m'  : ''
  dim     = util.inspect.defaultOptions.colors ? '\x1b[2m'  : ''
  italic  = util.inspect.defaultOptions.colors ? '\x1b[3m'  : ''
  rewrite = util.inspect.defaultOptions.colors ? '\x1b[1A\x1b[2K' : ''

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
    rewrite   : ansi.rewrite,
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
  loaded : new Set(),
  headline(title, columns)
  {
    if(format.loaded.has(title))
    {
      return ''
    }

    format.loaded.add(title)

    const
      padded    = ` ${title} `,
      length    = format.columns.count(padded),
      half      = Math.floor(length / 2),
      center    = Math.floor(columns / 2),
      colored   = format.color.title + padded + format.color.tree,
      linePre   = ''.padEnd(center - half, '─'),
      linePost  = ''.padEnd(center - half - (length % 2), '─')

    return '\n\n' + format.color.reset + format.color.tree + linePre + colored + linePost + '\n\n\n'
  },
  duration(duration)
  {
    if(0 === duration)
    {
      duration = '-'
    }
    else if(duration < 1e3)
    {
      duration = `${duration.toFixed(3)}${ansi.dim}ms${ansi.normal}`
    }
    else if(duration < 60e3)
    {
      duration = `${Math.floor(duration) / 1e3}${ansi.dim}s${ansi.normal}`
    }
    else if(duration < 60 * 60e3)
    {
      const
        s   = Math.floor(duration / 1e3),
        min = Math.floor(s / 60),
        sec = s % 60

      duration = sec
               ? `${min}${ansi.dim}m${ansi.normal} ${sec}${ansi.dim}s${ansi.normal}`
               : `${min}${ansi.dim}m${ansi.normal}`
    }
    else
    {
      const
        s   = Math.floor(duration / 1e3),
        min = Math.floor((s % 3600) / 60),
        h   = Math.floor(s / 3600),
        sec = s % 60

      duration = sec
               ? `${h}${ansi.dim}h${ansi.normal} ${min}${ansi.dim}m${ansi.normal} ${sec}${ansi.dim}s${ansi.normal}`
               : min
               ? `${h}${ansi.dim}h${ansi.normal} ${min}${ansi.dim}m${ansi.normal}`
               : `${h}${ansi.dim}h${ansi.normal}`
    }

    return format.color.duration + duration
  },
  tree:
  {
    top   : (depth) => depth < 0 ? '' : format.color.tree       + (`─`  .repeat(depth)),
    left  : (depth) => depth < 0 ? '' : format.color.tree       + ('│  '.repeat(depth)),
    tee   : (depth) => depth < 0 ? '' : format.tree.left(depth) +  '├─ ',
    hook  : (depth) => depth < 0 ? '' : format.tree.left(depth) +  '└─ ',
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

import fs from 'fs'
import { execSync } from 'child_process'

// 打包代码时加入git.properties进行代码版本管理
if (process.env.NODE_ENV === 'production') {
  // 获取最后一次提交的commitID,处理异常报错
  let version
  let branch
  let content = `git.build.time=${new Date().toLocaleString()}\n`
  let commitTime
  try {
    // 获取githash
    version = execSync('git rev-parse HEAD')
    // 获取gitbranch
    branch = execSync(`git describe --contains --all HEAD`)
    // 获取最后一次修改时间
    commitTime = execSync(`git log --pretty=format:"%cd" -1 --date=iso`)
    content += `git.branch=${branch}git.commit.id=${version}git.commit.time=${commitTime}`
  } catch (e) {
    /* eslint-disable no-console */
    console.warn('Getting revision FAILED. Maybe this is not a git project.')
  }

  console.time('build-time')
  console.log(`————————git.properties————————\n${content}`)
  process.on('beforeExit', (code) => {
    if (code === 0) {
      fs.stat('dist', (err, stats) => {
        if (err) throw err
        if (stats.isDirectory()) {
          fs.writeFile('dist/git.properties', content, 'utf8', (err) => {
            if (err) throw err
            console.log('git.properties文件已添加')
            console.timeEnd('build-time')
            process.exit()
          })
        }
      })
    } else {
      process.exit(code)
    }
  })
}

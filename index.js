#!/usr/bin/env node

const ora = require('ora')
const log = require('debug')('filecoin-contributors')
const Chalk = require('chalk')
const Inquirer = require('inquirer')
const moment = require('moment')
const nyc = require('name-your-contributors/src/index')
const getList = require('./contributions-list')
const Config = require('./config')

Inquirer.registerPrompt('datetime', require('inquirer-datepicker-prompt'))

async function main ({ argv, env }) {
  console.log(`${Chalk.cyan('⨎')} ${Chalk.bold(Chalk.whiteBright('Filecoin Contributors'))}`)
  const spinner = ora()

  try {
    let githubToken

    if (env.GITHUB_TOKEN) {
      console.log(Chalk.white('Welcome to the Filecoin contributors list generator!'))
      githubToken = env.GITHUB_TOKEN
    } else {
      console.log(Chalk.white('Welcome to the Filecoin contributors list generator! All you need is a Github token. Learn how to get one at https://github.com/mntnr/name-your-contributors#api-limits-and-setting-up-a-github-token.'))

      const { token } = await Inquirer.prompt([{
        type: 'password',
        name: 'token',
        message: 'Enter your Github personal access token:',
        validate: Boolean
      }])

      githubToken = token
    }

    const repos = Array.from(Config.repos)

    while (true) {
      console.log(Chalk.white('The following repos will be used:'))

      repos.forEach((r, i) => {
        console.log(Chalk.white((i + 1) + '. ') + Chalk.gray('github.com/') + r)
      })

      const { another, repo } = await Inquirer.prompt([{
        type: 'confirm',
        name: 'another',
        message: 'Add another repo?',
        default: false
      }, {
        type: 'input',
        name: 'repo',
        message: 'Enter repo (org/repo):',
        when: ({ another }) => another
      }])

      if (!another) break
      repos.push(repo)
    }

    const threeMonthsAgo = moment().subtract(3, 'months').toDate()

    let { after } = await Inquirer.prompt([{
      type: 'datetime',
      name: 'after',
      message: 'From how long ago (mm/dd/yyyy)?',
      format: ['mm', '/', 'dd', '/', 'yyyy'],
      initial: threeMonthsAgo
    }])

    const contributions = {}

    for (const orgRepo of repos) {
      spinner.start(`${Chalk.white('Getting contributors to')} ${Chalk.grey('github.com/') + orgRepo}`)

      const [ user, repo ] = orgRepo.split('/')

      contributions[orgRepo] = await nyc.repoContributors({
        token: githubToken,
        user,
        repo,
        before: new Date(),
        after,
        commits: true
      })

      spinner.stopAndPersist({
        symbol: '❤️ ',
        text: `${Chalk.white('Successfully got contributors for')} ${Chalk.grey('github.com/') + orgRepo}`
      })
    }

    console.log(getList(contributions))
    process.exit()
  } catch (err) {
    log(err)
    spinner.fail(err.message || err.statusMessage)
    console.error(err)
    process.exit(1)
  }
}

main(process)

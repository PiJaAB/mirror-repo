import * as core from '@actions/core'
import * as io from '@actions/io'
import * as exec from '@actions/exec'

import os from 'os'
import fs from 'fs'
import child_process from 'child_process'

// import { wait } from './wait'

const PRIVATE_SSH_KEY = 'PRIVATE_SSH_KEY'
const USER_EMAIL = 'USER_EMAIL'
const HOST = 'Sacquer'
const USER = 'git'
const HOST_NAME = 'github.com'

const HOME_DIR = os.homedir()
const SSH_HOME_DIR = `${HOME_DIR}/.ssh`
const SSH_CONFIG_PATH = `${SSH_HOME_DIR}/config`
const SSH_KEY_PATH = `${SSH_HOME_DIR}/id_ed25519`

const SSH_CONFIG =
  `\nHost ${HOST}\n` +
  `    User ${USER}\n` +
  `    HostName ${HOST_NAME}\n` +
  `    IdentityFile ${SSH_KEY_PATH}\n` +
  `    IdentitiesOnly yes\n`

const REMOTE_NAME = 'live'
const REMOTE_BRANCH = 'test'
const REMOTE_REPOSITORY = 'Sacquer/isr-example-sync'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    await io.mkdirP(SSH_HOME_DIR)

    const sshKey: string = core.getInput(PRIVATE_SSH_KEY).trim()
    const userEmail: string = core.getInput(USER_EMAIL).trim()

    // Extract auth socket path and agent pid and set them as job variables
    child_process
      .execFileSync('ssh-agent', [])
      .toString()
      .split('\n')
      .forEach(function (line) {
        core.debug(`Line: ${line}`)
        const matches = /^(SSH_AUTH_SOCK|SSH_AGENT_PID)=(.*); export \1/.exec(
          line
        )

        if (matches && matches.length > 0) {
          // This will also set process.env accordingly, so changes take effect for this script
          core.exportVariable(matches[1], matches[2])
          core.debug(`${matches[1]}=${matches[2]}`)
        }
      })

    core.debug('Adding private key(s) to agent')

    fs.writeFileSync(SSH_KEY_PATH, sshKey, { mode: 600 })
    fs.appendFileSync(SSH_CONFIG_PATH, SSH_CONFIG)

    await exec.exec(`ssh-add ${SSH_KEY_PATH}`)
    await exec.exec(`ssh-keyscan github.com >> ${SSH_HOME_DIR}/known_hosts`)

    await exec.exec('git fetch --unshallow origin')
    await exec.exec(
      `git remote add ${REMOTE_NAME} git@github.com:${REMOTE_REPOSITORY}`
    )
    await exec.exec(
      `git -c user.name="Sacquer" -c user.email=${userEmail} commit -m "Deployment commit" --allow-empty`
    )
    await exec.exec(`git push -f ${REMOTE_NAME} main:${REMOTE_BRANCH}`)

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    // core.debug(`Waiting ${ms} milliseconds ...`)

    // Log the current timestamp, wait, then log the new timestamp
    // core.debug(new Date().toTimeString())
    // await wait(parseInt(ms, 10))
    // core.debug(new Date().toTimeString())

    // Set outputs for other workflow steps to use
    // core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

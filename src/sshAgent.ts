import * as core from '@actions/core'
import * as exec from '@actions/exec'

import fs from 'fs'
import child_process from 'child_process'

import {
  SSH_CONFIG,
  SSH_CONFIG_PATH,
  SSH_HOME_DIR,
  SSH_KEY,
  SSH_KEY_PATH
} from './constants'

/**
 * Starts the ssh-agent and export env variables for `SSH_AUTH_SOCK` and `SSH_AGENT_PID`
 */
export function startSshAgent() {
  // https://github.com/webfactory/ssh-agent
  // Extract auth socket path and agent pid and set them as job variables
  child_process
    .execFileSync('ssh-agent', [])
    .toString()
    .split('\n')
    .forEach(function (line) {
      const matches = /^(SSH_AUTH_SOCK|SSH_AGENT_PID)=(.*); export \1/.exec(
        line
      )

      if (matches && matches.length > 0) {
        // This will also set process.env accordingly, so changes take effect for this script
        // SSH_AUTH_SOCK=/tmp/ssh-XXXXXXNtl7Mb/agent.38
        // SSH_AGENT_PID=41
        core.exportVariable(matches[1], matches[2])
        core.debug(`${matches[1]}=${matches[2]}`)
      }
    })
}

/**
 * Create config, ssh-key and add key to ssh-agent
 */
export async function startSshKeyVerification() {
  core.debug('Adding private key(s) to agent')

  // Create config in ~/.ssh
  fs.appendFileSync(SSH_CONFIG_PATH, SSH_CONFIG)

  // Add ssh key to ssh agent
  child_process.execFileSync('ssh-add', ['-'], {
    input: SSH_KEY + '\n'
  })

  // Write ssh key to [SSH_KEY_PATH]
  fs.writeFileSync(`${SSH_KEY_PATH}`, SSH_KEY, {
    mode: '600'
  })

  // Retrieve the public key of an SSH server
  await exec.exec(`ssh-keyscan github.com >> ${SSH_HOME_DIR}/known_hosts`)
}

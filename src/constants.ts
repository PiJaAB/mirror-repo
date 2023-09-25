import * as core from '@actions/core'
import os from 'os'

export const PRIVATE_SSH_KEY_INPUT = 'PRIVATE_SSH_KEY'

export const USER_EMAIL_INPUT = 'USER_EMAIL'
export const HOST = 'github'
export const USER = 'git'
export const HOST_NAME = 'github.com'

export const REMOTE_REPOSITORY_INPUT = 'REMOTE_REPOSITORY'
export const REMOTE_BRANCH_INPUT = 'REMOTE_BRANCH'
export const REMOTE_NAME = 'live'

export const HOME_DIR = os.homedir()

export const SSH_HOME_DIR = `${HOME_DIR}/.ssh`
export const SSH_CONFIG_PATH = `${SSH_HOME_DIR}/config`
export const SSH_KEY_PATH = `${SSH_HOME_DIR}/id_ed25519`

export const SSH_CONFIG =
  `\nHost ${HOST}\n` +
  `    User ${USER}\n` +
  `    HostName ${HOST_NAME}\n` +
  `    IdentityFile ${SSH_KEY_PATH}\n` +
  `    IdentitiesOnly yes\n`

export const SSH_KEY: string = core.getInput(PRIVATE_SSH_KEY_INPUT).trim()
export const REMOTE_REPOSITORY = core.getInput(REMOTE_REPOSITORY_INPUT).trim()
export const USER_EMAIL: string = core.getInput(USER_EMAIL_INPUT).trim()
export const REMOTE_BRANCH = core.getInput(REMOTE_BRANCH_INPUT).trim()

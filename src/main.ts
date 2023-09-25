import * as core from '@actions/core'
import * as io from '@actions/io'

import { SSH_HOME_DIR } from './constants'

import { startSshAgent, startSshKeyVerification } from './sshAgent'
import { gitFetchAndPush } from './gitInstructions'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    await io.mkdirP(SSH_HOME_DIR)

    startSshAgent()
    startSshKeyVerification()

    await gitFetchAndPush()
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

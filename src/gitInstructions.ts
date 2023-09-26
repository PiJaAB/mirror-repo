import * as exec from '@actions/exec'
import * as core from '@actions/core'

import {
  REMOTE_BRANCH,
  REMOTE_NAME,
  REMOTE_REPOSITORY,
  USER_EMAIL
} from './constants'

/**
 * Fetch remote repository,
 * add remote,
 * create empty commit,
 * push to remote
 */
export async function gitFetchAndPush() {
  await exec.exec('git fetch --unshallow origin')
  await exec.exec(
    `git remote add ${REMOTE_NAME} git@github.com:${REMOTE_REPOSITORY}`
  )
  await exec.exec(
    `git -c user.name="Git" -c user.email=${USER_EMAIL} commit -m "Deployment commit" --allow-empty`
  )
  await exec.exec(`git push -f ${REMOTE_NAME} main:${REMOTE_BRANCH}`)
}

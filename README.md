# Mirror repository - GitHub Action

---

Heavily inspired by: [webfactory/ssh-agent](https://github.com/marketplace/actions/webfactory-ssh-agent)

---

The purpose of this GitHub Action is to sync changes to a different organisations repository.
A way to stay in sync basically.

A `ssh key pair` must be created, one without any password.
It is recommended to create a pair just for this purpose.

The private key must be added as a repository secret (`inputs` will be explained further down).
The public key must be added to the organisation who is on the receiving end.

[Generating a new SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)

---

### Inputs

#### `PRIVATE_SSH_KEY`

*Required* The private key you created (add to your repository secret).

#### `REMOTE_REPOSITORY`

*Required* The repository to sync your content to (organisation/repository).

#### `REMOTE_BRANCH`

*Required* Remote branch that will be overwritten with your content.

---

## Example usage

```yaml
on:
  pull_request:
    # Only trigger when the pull request is closed and merged
    types: [closed]
    branches: [main]

jobs:
  test_action_job:
    runs-on: ubuntu-latest
    name: [NAME_FOR_YOUR_JOB]
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: [NAME_OF_ACTION]
        uses: PiJaAB/mirror-repo@v1.1.1 # organisation/repository@tag-version - see https://github.com/PiJaAB/mirror-repo/tags for latest tag
        id: [ID_FOR_ACTION]
        with:
          PRIVATE_SSH_KEY: ${{secrets.PRIVATE_SSH_KEY}}
          REMOTE_REPOSITORY: 'organisation/repository-name' # or ${{secrets.REMOTE_REPOSITORY}}
          REMOTE_BRANCH: 'branch-name' # or ${{secrets.REMOTE_BRANCH}}
```

---

# How to Contribute

...

---

# Roadmap

...

---

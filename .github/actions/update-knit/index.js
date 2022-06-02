
const core = require("@actions/core");
const github = require("@actions/github");
const exec = require("@actions/exec");

async function run() {
  const runDate = Date.now();

  try {
    const repo = core.getInput("released_repo")
    const owner = core.getInput("owner")
    const token = core.getInput("repo-token");

    console.log('======================================');
    console.log(`       ${repo} Updater!               `);
    console.log('======================================');

    const octokit = github.getOctokit(token);

    const {
      data: { tag_name },
    } = await octokit.rest.repos.getLatestRelease({
      owner,
      repo,
    });

    const latestReleaseTag = tag_name.slice(1)

    console.log("LATEST RELEASE", latestReleaseTag)

    const branchName = `${repo}-upgrade-to-${latestReleaseTag}-${runDate}`

    console.log("RUN DATE", runDate)

    await exec.exec('git config --global user.email "christine.chois@stitchfix.com"')
    await exec.exec('git config --global user.name "chylauSF"')

    await exec.exec('git pull origin main')
    await exec.exec(`git checkout -b ${branchName}`)
    await exec.exec(`npm install ${repo}@${latestReleaseTag}`)
    await exec.exec("git add .")
    await exec.exec(`git commit -m "Upgrade ${repo} to ${latestReleaseTag}"`)
    await exec.exec(`git push --set-upstream origin ${branchName}`)

    octokit.rest.pulls.create({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      base: "main",
      head: `chylauSF:${branchName}`,
      title: `Automated PR to update ${repo} to v${latestReleaseTag}`
    });

  } catch (err) {
    core.setFailed(err.message);
  }
}

run();
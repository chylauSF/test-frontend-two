const runDate = Date.now();
async function run() {
  try {
    console.log('======================================');
    console.log('          Knit Updater!               ');
    console.log('======================================');

    console.log(runDate)

  } catch (err) {
    core.setFailed(err.message);
  }
}

run();




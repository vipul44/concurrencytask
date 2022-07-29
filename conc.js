async function init() {
  numberOfTasks = 20;
  const concurrencyMax = 2;
  const taskList = [...Array(numberOfTasks)].map(() =>
    [...Array(~~(Math.random() * 10 + 3))]
      .map(() => String.fromCharCode(Math.random() * (123 - 97) + 97))
      .join("")
  );

  console.log("[init] Concurrency Algo Testing...");
  console.log("[init] Tasks to process: ", taskList.length);
  console.log("[init] Task list: " + taskList);
  console.log("[init] Maximum Concurrency: ", concurrencyMax, "\n");
  await manageConcurrency(taskList, concurrencyMax);
}

async function manageConcurrency(taskList, concurrencyMax) {
  return new Promise((resolve) => {
    const argQueue = [...taskList].reverse();
    const outs = [];
    let concurrencyCurrent = 0;
    const pollNext = () => {
      if (argQueue.length === 0 && concurrencyCurrent === 0) {
        resolve(outs);
      } else {
        // Loop till the task are completed
        while (concurrencyCurrent < concurrencyMax && argQueue.length) {
          // get the index of current task.
          const index = taskList.length - argQueue.length;
          //get last element, reducing argQueue length
          const arg = argQueue.pop();
          // increase the count of current concurrency tasks.
          concurrencyCurrent += 1;
          // run task
          const out = doTask(
            arg,
            concurrencyCurrent,
            taskList.length,
            concurrencyMax,
            index
          );

          const processOut = (out, index) => {
            outs[index] = out;
            concurrencyCurrent -= 1;
            // Dynamically change the concurrencyMax based on a event.
            if (index == taskList.length / 2) {
              concurrencyMax = 4;
              console.log("**** changing concurrency to ", concurrencyMax);
            }
            pollNext();
          };
          if (typeof out === "object" && out.then) {
            out.then((out) => processOut(out, index));
          } else {
            processOut(out, index);
          }
        }
      }
    };
    pollNext();
  });
}

// Execute task
var doTask = (taskName, counter, totaltask, concurrencyMax, index) => {
  var begin = Date.now();
  return new Promise(function (resolve, reject) {
    let tasknumber = parseInt(index) + 1;
    console.log("[EXE] Concurrency: " + counter + " of " + concurrencyMax);
    console.log("[EXE] Total Count: " + tasknumber + " of " + totaltask);
    console.error("[Task] STARTING:    " + taskName);
    setTimeout(function () {
      var end = Date.now();
      var timeSpent = end - begin + "ms";
      console.log(
        "\x1b[36m",
        "[TASK] FINISHED: " + taskName + " in " + timeSpent,
        "\x1b[0m"
      );
      if (tasknumber == totaltask) {
        console.log("All tasks successfully completed.");
      }
      resolve(true);
    }, Math.random() * 200);
  });
};

console.log("INIT...");
init();

const { spawn } = require("child_process"),
  chalk = require("chalk"),
  cmd = spawn(
    `"${require("path").resolve(__dirname, "node_modules", ".bin", "wp-scripts")}"`,
    [
      "start",
      ...[
        "assets/js/dist/components/bootstrap/forms/control/FormControl.js",
        "assets/js/dist/components/bootstrap/forms/fileAudio/FormAudioFile.js",
        "assets/js/dist/components/bootstrap/forms/fileImage/FormImageFile.js",
        "assets/js/dist/components/bootstrap/forms/filePdf/FormPDFFile.js",
        "assets/js/dist/components/bootstrap/forms/fileVideo/FormVideoFile.js",
        "assets/js/dist/components/bootstrap/forms/date/FormDate.js",
        "assets/js/dist/components/bootstrap/forms/dateMinToday/FormMinDate.js",
        "assets/js/dist/components/bootstrap/forms/dateMaxToday/FormMaxDate.js",
        "assets/js/dist/components/bootstrap/forms/dateHour/FormDateHour.js",
        "assets/js/dist/components/bootstrap/forms/dateHourMax/FormDateHourMax.js",
        "assets/js/dist/components/bootstrap/forms/dateHourMin/FormDateHourMin.js",
        "assets/js/dist/components/bootstrap/forms/email/FormEmail.js",
        "assets/js/dist/components/bootstrap/forms/number/FormNumber.js",
        "assets/js/dist/components/bootstrap/forms/search/FormSearch.js",
        "assets/js/dist/components/bootstrap/forms/url/FormURL.js",
        "assets/js/dist/components/bootstrap/forms/dateWeek/FormWeek.js",
        "assets/js/dist/components/bootstrap/forms/dateMonth/FormMonth.js",
        "assets/js/dist/components/bootstrap/forms/time/FormTime.js",
        "assets/js/dist/components/bootstrap/forms/color/FormColor.js",
        "assets/js/dist/components/bootstrap/forms/text/FormText.js",
      ],
    ],
    {
      shell: true,
      stdio: ["inherit", "pipe", "pipe"],
    },
  );
cmd.stdout.on("data", data => console.log(chalk.green(data.toString())));
cmd.stderr.on("data", data => console.error(chalk.red(data.toString())));
cmd.on("error", error => console.error(chalk.red(`Execution Exception: ${error.message}`)));
cmd.on("close", code => {
  code === 0
    ? console.log(chalk.blue(`Process exited successfully with code ${code}`))
    : console.error(chalk.red(`Process exited with error code ${code}`));
});

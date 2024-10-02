import {getAllTests, runTests, formatTestResultsAsText} from "@benchristel/taste"
import "../src/program.ts"

// run the tests and print the results
runTests(getAllTests())
  .then(formatTestResultsAsText)
  .then(console.log)
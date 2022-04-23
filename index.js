import UtilArgs from './util/args.js'
import UtilPath from './util/path.js'
import UtilFs from './util/fs.js'
import UtilCompare from './util/compare.js'

const argv = UtilArgs.getArgv();

(async function () {
  // get summary
  const lhsFilePattern = UtilPath.resolve(argv.l, '**/*')
  const lhsFilePaths = await UtilPath.glob(lhsFilePattern)
  const lhsFileSummary = UtilCompare.getFileSummary(argv.l, lhsFilePaths)
  const rhsFilePattern = UtilPath.resolve(argv.r, '**/*')
  const rhsFilePaths = await UtilPath.glob(rhsFilePattern)
  const rhsFileSummary = UtilCompare.getFileSummary(argv.r, rhsFilePaths)

  // save file summary
  const lhsFileSummaryOutputPath = UtilPath.resolve(argv.o, './file-summary-lhs.json')
  UtilFs.writeJson(lhsFileSummaryOutputPath, lhsFileSummary)
  const rhsFileSummaryOutputPath = UtilPath.resolve(argv.o, './file-summary-rhs.json')
  UtilFs.writeJson(rhsFileSummaryOutputPath, rhsFileSummary)

  // compare summary
  const compareSummary = UtilCompare.getCompareSummary(lhsFileSummary, rhsFileSummary)

  // save compare summary
  const compareSummaryOutputPath = UtilPath.resolve(argv.o, './compare-summary.json')
  UtilFs.writeJson(compareSummaryOutputPath, compareSummary)

  // compare report
  const compareReport = UtilCompare.getCompareReport(compareSummary)

  // save compare report
  const compareReportOutputPath = UtilPath.resolve(argv.o, './compare-report.html')
  UtilFs.writeFile(compareReportOutputPath, compareReport)
})()

import UtilArgs from './util/args.js'
import UtilPath from './util/path.js'
import UtilFs from './util/fs.js'
import UtilQueue from './util/queue.js'
import UtilCompare from './util/compare.js'

let argv = UtilArgs.getArgv()

// get summary
let lhsFilePattern = UtilPath.resolve(argv.l, '**/*')
let lhsFilePaths = await UtilPath.glob(lhsFilePattern)
let lhsFileSummary = UtilCompare.getFileSummary(argv.l, lhsFilePaths, lhsQueue)
let rhsFilePattern = UtilPath.resolve(argv.r, '**/*')
let rhsFilePaths = await UtilPath.glob(rhsFilePattern)
let rhsFileSummary = UtilCompare.getFileSummary(argv.r, rhsFilePaths, rhsQueue)

// save file summary
let lhsFileSummaryOutputPath = UtilPath.resolve(argv.o, './file-summary-lhs.json')
UtilFs.writeJson(lhsFileSummaryOutputPath, lhsFileSummary)
let rhsFileSummaryOutputPath = UtilPath.resolve(argv.o, './file-summary-rhs.json')
UtilFs.writeJson(rhsFileSummaryOutputPath, rhsFileSummary)

// compare summary
let compareSummary = UtilCompare.getCompareSummary(lhsFileSummary, rhsFileSummary)

// save compare summary
let compareSummaryOutputPath = UtilPath.resolve(argv.o, './compare-summary.json')
UtilFs.writeJson(compareSummaryOutputPath, compareSummary)


// compare report
let compareReport = UtilCompare.getCompareReport(compareSummary)

// save compare report
let compareReportOutputPath = UtilPath.resolve(argv.o, './compare-report.html')
UtilFs.writeFile(compareReportOutputPath, compareReport)

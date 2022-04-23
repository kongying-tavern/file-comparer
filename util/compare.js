import _ from 'lodash'
import UtilPath from './path.js'
import UtilHash from './hash.js'
import UtilProgress from './progress.js'

function getFileSummary (base = '', paths = [], queue = null) {
  const countTotal = paths.length
  const progress = UtilProgress.createProgressbar({ total: countTotal })
  const summary = []

  _.each(paths, async path => {
    await queue.add(() => {
      const filename = UtilPath.relative(base, path)
      const md5 = UtilHash.getHash(path, { offset: 0, limit: 100 * 1024 })

      const pack = {
        path,
        filename,
        md5
      }

      summary.push(pack)
      progress.tick()
    })
  })

  return summary
}

function getCompareSummary (lhs = [], rhs = []) {
  const lhsMap = _.groupBy(lhs, 'md5')
  const lhsHashes = _.keys(lhsMap)
  const rhsMap = _.groupBy(rhs, 'md5')
  const rhsHashes = _.keys(rhsMap)
  const unionHashes = _.uniq(_.union(lhsHashes, rhsHashes))

  const summary = []

  _.each(unionHashes, hash => {
    const lhsItem = lhsMap[hash] || []
    const rhsItem = rhsMap[hash] || []
    let type = ''

    if (lhsItem.length <= 0 && rhsItem.length > 0) {
      type = 'add'
    } else if (lhsItem.length > 0 && rhsItem.length <= 0) {
      type = 'remove'
    } else {
      type = 'same'
    }

    const pack = {
      hash,
      type,
      lhs: lhsItem,
      rhs: rhsItem
    }

    summary.push(pack)
  })

  return summary
}

function getCompareReport (summary = []) {
  const template = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>文件比对结果</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/element-ui@2.15.6/packages/theme-chalk/lib/index.css">
</head>
<body>
    <div id="app">
        <el-card>
            <el-select v-model="filterTypes" multiple>
                <el-option
                    v-for="(item, i) in filterOptions"
                    :key="i"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </el-card>

        <el-table :data="compareDataFiltered">
            <el-table-column label="数字签名" prop="hash" sortable></el-table-column>
            <el-table-column label="左侧文件名">
                <template slot-scope="scope">
                    <template v-if="scope.row.lhs && scope.row.lhs.length > 0">
                        <div v-for="(item, i) in scope.row.lhs" :key="i">
                            {{item.filename}}
                        </div>
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="" width="100">
                <template slot-scope="scope">
                    <el-button
                        size="medium"
                        :type="scope.row.typeColorClass"
                        :icon="scope.row.typeIcon"
                        circle>
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column label="右侧侧文件名">
                <template slot-scope="scope">
                    <template v-if="scope.row.rhs && scope.row.rhs.length > 0">
                        <div v-for="(item, i) in scope.row.rhs" :key="i">
                            {{item.filename}}
                        </div>
                    </template>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <script type="text/javascript" src="https://unpkg.com/vue@2.6.14/dist/vue.min.js"></script>
    <script type="text/javascript" src="https://unpkg.com/element-ui@2.15.6/lib/index.js"></script>
    <script type="text/javascript">
    new Vue({
        el: '#app',
        data() {
            return {
                compareData: {{__ summary __}},
                filterTypes: ['add', 'remove', 'same'],
                filterOptions: [
                    {
                        label: '新增',
                        value: 'add'
                    },
                    {
                        label: '删除',
                        value: 'remove'
                    },
                    {
                        label: '相同',
                        value: 'same'
                    }
                ]
            }
        },
        computed: {
            compareDataFiltered() {
                const typeConfig = {
                    add: {
                        type: 'success',
                        icon: 'el-icon-star-off'
                    },
                    remove: {
                        type: 'danger',
                        icon: 'el-icon-delete'
                    },
                    same: {
                        type: 'info',
                        icon: 'el-icon-more-outline'
                    }
                }

                let data = this.compareData || []
                data = data.map(v => {
                    let type = v.type || ''
                    let typeConf =  typeConfig[type] || {}
                    let typeColorClass  = typeConf.type || ''
                    let typeIcon = typeConf.icon || ''

                    v.typeColorClass = typeColorClass
                    v.typeIcon = typeIcon

                    return v
                })
                data = data.filter(v => this.filterTypes.indexOf(v.type) !== -1)

                return data
            }
        }
    })
    </script>
</body>
</html>`

  const renderer = _.template(template, {
    interpolate: /\{\{__([\s\S]+?)__\}\}/g
  })

  return renderer({ summary: JSON.stringify(summary) })
}

export default {
  getFileSummary,
  getCompareSummary,
  getCompareReport
}

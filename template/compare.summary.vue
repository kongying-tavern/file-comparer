<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>文件比对结果</title>
  <link rel="stylesheet" type="text/css" href="https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.6/theme-chalk/index.css">
</head>
<body>
  <div id="app">
    <el-card>
      <el-select
        v-model="state.filterTypes"
        multiple>
        <el-option
          v-for="(item, i) in plugins.typeOptions"
          :key="i"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-card>

    <el-table :data="compareDataFiltered">
      <el-table-column
        label="数字签名"
        prop="hash"
        sortable>
      </el-table-column>
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
            :type="scope.row.typeOption.type"
            :icon="scope.row.typeOption.icon"
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

  <script type="text/javascript" src="https://cdn.bootcdn.net/ajax/libs/vue/2.6.14/vue.min.js"></script>
  <script type="text/javascript" src="https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.6/index.js"></script>
  <script type="text/javascript" src="https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.min.js"></script>
  <script type="text/javascript">
  new Vue({
    el: '#app',
    data() {
      return {
        compareData: {{__ summary __}},
        state: {
          filterTypes: ['add', 'remove', 'same'],
        },
        plugins: {
          typeOptions: [
            {
              label: '新增',
              value: 'add',
              type: 'success',
              icon: 'el-icon-star-off'
            },
            {
              label: '删除',
              value: 'remove',
              type: 'danger',
              icon: 'el-icon-delete'
            },
            {
              label: '相同',
              value: 'same',
              type: 'info',
              icon: 'el-icon-more-outline'
            }
          ]
        }
      }
    },
    computed: {
      compareDataFiltered() {
        let list = this.compareData || [];
        list = this.applyTypeMapper(list);
        list = this.applyTypeFilter(list);

        return list;
      }
    },
    methods: {
      applyTypeMapper(list = []) {
        let typeOptionMap = _.keyBy(this.plugins.typeOptions, 'value');
        let listMapped = _.map(list, v => {
          let typeKey = v.type || '';
          let typeOption = typeOptionMap[typeKey] || {};

          v.typeOption = typeOption;

          return v;
        });

        return listMapped;
      },
      applyTypeFilter(list = []) {
        let listFiltered = _.filter(list, v => this.state.filterTypes.indexOf(v.type) !== -1);

        return listFiltered;
      }
    }
  })
  </script>
</body>
</html>

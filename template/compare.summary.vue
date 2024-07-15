<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>文件比对结果</title>
  <link rel="stylesheet" type="text/css" href="https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.6/theme-chalk/index.css">
  <style type="text/css">
  #app {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: .7rem;
  }
  .drawer-wrapper {
    padding: 0 1rem;
  }
  .form-component {
    width: 100%;
  }
  .action-wrapper {
    flex: none;
    margin-bottom: .7rem;
  }
  .table-wrapper {
    position: relative;
    flex: auto;
  }
  .table-component {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  </style>
</head>
<body>
  <div id="app">
    <!-- Popups -->
    <el-drawer
      :visible.sync="state.filterDrawerVisible"
      title="过滤筛选"
      direction="rtl"
      size="40%"
      :wrapperClosable="false"
      append-to-body
      modal-append-to-body>
      <el-form
        class="drawer-wrapper"
        size="mini"
        label-position="left"
        label-width="100px">
        <el-form-item label="差异类型">
          <el-select
            v-model="state.filterTypes"
            class="form-component"
            multiple>
            <el-option
              v-for="(item, i) in plugins.typeOptions"
              :key="i"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-drawer>

    <div class="action-wrapper">
      <el-button
        size="mini"
        type="info"
        icon="el-icon-search"
        circle
        @click="popupFilterDrawer">
      </el-button>
      <div>
        <template v-for="(type, index) in typeOptions"></template>
      </div>
    </div>

    <div class="table-wrapper">
      <el-table
        class="table-component"
        :data="compareDataFiltered"
        size="mini"
        border
        height="auto">
        <el-empty slot="empty" description="暂无数据"></el-empty>

        <el-table-column
          label="数字签名"
          sortable
          sort-by="hash">
        </el-table-column>
        <el-table-column
          label="左侧文件名"
          sortable
          sort-by="lhs.0.filename">
          <template slot-scope="scope">
            <template v-if="scope.row.lhs && scope.row.lhs.length > 0">
              <div v-for="(item, i) in scope.row.lhs" :key="i">
                {{item.filename}}
              </div>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          align="center"
          sortable
          sort-by="type">
          <template slot-scope="scope">
            <el-button
              size="mini"
              :type="scope.row.typeOption.type"
              :icon="scope.row.typeOption.icon"
              circle>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="右侧侧文件名"
          sortable
          sort-by="rhs.0.filename">
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
          filterDrawerVisible: false,
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
      // popups / popdowns
      popupFilterDrawer() {
        this.state.filterDrawerVisible = true;
      },
      // Mappers
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

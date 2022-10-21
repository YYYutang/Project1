<template>
  <div>
      <h1>缺失值补齐</h1>
    <div style="margin: 10px">
      <span>第一步： </span>
      <el-button type="success" @click="dialogVisible = true" style="margin: 10px">选择数据表</el-button>
    </div>

    <h3>处理后的数据</h3>

    <el-card style="margin: 20px">
      <el-row :gutter="50">
        <el-col :span="12">
          <!-- 动态展示表格 -->
          <span>原始表</span>
          <el-table style="width: 100%; margin: 10px"
                    border
                    max-height="450"
                    :data="tableConData">
            <template v-for="item in ColumnsWithNull">
              <el-table-column :prop="item.columnName"
                               :label="item.columnName"
                               :key="item.columnId"></el-table-column>
            </template>
          </el-table>
        </el-col>

        <el-col :span="12">
          <span>补齐后的新表</span>
          <el-table style="width: 100%; margin: 10px"
                    border
                    max-height="450"
                    :data="newTableData">
            <template v-for="item in newTableCols">
              <el-table-column :prop="item"
                               :label="item"
                               :key="item"></el-table-column>
            </template>
          </el-table>

        </el-col>
      </el-row>
    </el-card>
    <h3>下游任务提升效果</h3>
    <div class="chart" ref="chart1" style="height: 300px; width: 80%; margin: 10px"></div>

    <!--    弹窗内容-->
    <el-dialog title="请选择数据表" :visible.sync="dialogVisible" width="70%">
      <el-form :inline="true" size="small" class="form-inline" style="margin-top: -20px; height: 45px ">
        <el-form-item label="名称：">
          <el-input v-model="requestParams.tableName" placeholder="请输入要查询的表名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <i class="el-icon-question">注意：先选择表后再选择对应的表特征列</i>
        </el-form-item>
      </el-form>

      <el-row :gutter="40">
        <el-col :span="12">
          <div class="left" style=" width: 100%; ">
            <el-table
                :data="tableData"
                stripe
                max-height="530"
                style="width: 100%">
              <el-table-column
                  prop="tableId"
                  label="tableId"
                  width="80">
              </el-table-column>
              <el-table-column
                  prop="tableName"
                  label="表名"
                  width="120">
              </el-table-column>
              <el-table-column
                  prop="tableType"
                  label="表类型">
              </el-table-column>
              <el-table-column
                  prop="tableState"
                  label="表状态">
              </el-table-column>
              <el-table-column label="操作" fixed="right">
                <template slot-scope="scope">
                  <el-button
                      size="small"
                      type="primary" plain
                      @click="handleTableCheck(scope.row)">选择</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
        <el-col :span="10">
          <el-card class="right" style=" width: 100%;  padding: 5px; margin-bottom: 5px">
            <h3 style="margin-bottom: 10px">请选择特征</h3>
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="checkedColumns" @change="handleCheckedColumnsChange">
              <el-checkbox v-for="col in columns" :label="col" :key="col.columnId" border size="small" style="margin: 2px">Id:{{col.columnId}}-列名:{{col.columnName}}</el-checkbox>
            </el-checkbox-group>
          </el-card>
          <el-card class="right" style=" width: 100%;  padding: 5px; margin-bottom: 5px">
            <h3 style="margin-bottom: 10px">请选择标签</h3>
            <el-radio-group v-model="labelId" @change="labelIdChange">
              <el-radio v-for="col in columns" :label="col.columnId" :key="col.columnId" style="margin: 2px">Id:{{col.columnId}}-列名:{{col.columnName}}</el-radio>
            </el-radio-group>
          </el-card>
          <el-card class="right" style=" width: 100%;  padding: 5px; margin-bottom: 5px">
            <h3 style="margin-bottom: 10px">请选缺失值补齐算法</h3>
            <el-select v-model="option" disabled placeholder="请选择">
              <el-option
                  v-for="item in options"
                  :key="item"
                  :label="item"
                  :value="item">
              </el-option>
            </el-select>
          </el-card>
          <el-card class="right" style=" width: 100%;  padding: 5px; margin-bottom: 5px">
            <h3 style="margin-bottom: 10px">请输入补齐后新的表名</h3>
            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item
                  style="margin-left: -100px"
                  label=""
                  prop="newTableName"
                  :rules="[
      { required: true, message: '表名不能为空'},
    ]"
              >
                <el-input v-model="ruleForm.newTableName" autocomplete="off" style="width: 200px"></el-input>
              </el-form-item>

            </el-form>
          </el-card>
        </el-col>
      </el-row>


      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmed">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {getRequest, postRequest} from "../utils/api";

export default {
  data(){
    return {
      ruleForm: {
        newTableName: ''
      },

      columnsNull: null,
      rowsNull: [],
      checkedTableName:'',
      checkAll: false,
      checkedColumns: [],
      ColumnsWithNull: [],
      columns: [],
      isIndeterminate: true,

      tableConData: [],
      labelId: null,
      tableId: null,
      option: "KNN",
      options:["KNN"],

      newTableData: [],
      newTableCols: [],

      chartInstance1: null,
      chartInstance2: null,

      tableData: null,
      dataDealed: null,
      dialogVisible: false,
      requestParams:{
        tableName: '',
      }


    }
  },
  methods: {
    getDefaultTable(){
      getRequest("/main/dataadmin/tablesche/querytable").then(res => {
        console.log("无参查询 数据表")
        console.log(res)
        this.tableData = res._message.data.records
      })
    },
    getConData(){
      let params = {
        tableName: this.checkedTableName,
        colNames: []
      }
      for (let col of this.checkedColumns) {
        params.colNames.push(col.columnName)
      }

      // console.log(params)
      postRequest("/data/hang/queryColnull", params).then(res => {
        // console.log("条件数据")
        // console.log(res)
        this.tableConData = res._message.data
        this.ColumnsWithNull = this.checkedColumns
        // 多加表格第一列缺失列
        // this.ColumnsWithNull = [{columnName: 'missing'}, ...this.ColumnsWithNull]
        // console.log(this.tableConData)
        // console.log(this.ColumnsWithNull)
      })
    },
    getDealedData(){

      getRequest("/data/column/query/"+this.ruleForm.newTableName).then(res => {
        this.newTableData = res._message.data
        for (let col in this.newTableData[0]) {
          this.newTableCols.push(col)
        }


      })

    },

    // 搜索函数
    search(){
      postRequest(this.requestParams.tableName).theh(res => {
        log(res)
      })
      alert("1111")
    },
    handleTableCheck(row){
      // console.log('选择表格')
      // console.log(row)
      // 选择表(表id)，去查询列信息
      this.tableId = row.tableId
      let id = row.tableId
      this.checkedTableName = row.tableName
      getRequest("/main/columns/query/"+id).then(res => {
        console.log(res);
        let cols = res._message.col_info
        this.columns = cols
      })
    },

    handleCheckAllChange(val) {
      this.checkedColumns = val ? this.columns : [];
      this.isIndeterminate = false;
    },
    handleCheckedColumnsChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.columns.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.columns.length;
      console.log(this.checkedColumns)
    },
    labelIdChange(){
      // alert(this.labelId)
    },
    confirmed(){

      if (this.checkedTableName && this.checkedColumns && this.labelId){
        let params = {
          tableId: this.tableId,
          labelId: this.labelId,
          featureColumnsId: [],
          modelName: this.option,
          newTableName: this.ruleForm.newTableName
        }
        for (let col of this.checkedColumns) {
          params.featureColumnsId.push(col.columnId)
        }

        postRequest("/model/trainmodel", params).then( res => {
          this.dataDealed = res._message.result
          this.showChart()
          console.log(this.dataDealed)
          this.getConData()
          this.getDealedData()
        })


        this.dialogVisible = false
      }else {
        this.$message.error('错了哦，还未选择表、特征、标签！');
      }
    },
    showChart(){
      if (this.chartInstance1!=null) {
        this.chartInstance1.destroy()
      }
      const data = [];
      let oData = this.dataDealed.orign_knn
      let dData = this.dataDealed.having_knn
      // console.log(oData)
      // console.log(dData)
      for (let i=0; i<oData.length; i++){
        data.push({name:'orign_knn', th: String(i), auc: Number(oData[i].toFixed(2))})
      }
      for (let i=0; i<dData.length; i++){
        data.push({name:'having_knn', th: String(i), auc: Number(dData[i].toFixed(2))})
      }


      this.chartInstance1 = new this.$G2.Chart({
        container: this.$refs.chart1,
        autoFit: true,
        height: 500,
      });

      this.chartInstance1.data(data);
      this.chartInstance1.scale('auc', {
        nice: true,
      });
      this.chartInstance1.tooltip({
        showMarkers: false,
        shared: true,
      });

      this.chartInstance1
          .interval()
          .position('th*auc')
          .color('name')
          .adjust([
            {
              type: 'dodge',
              marginRatio: 0,
            },
          ]);

      this.chartInstance1.interaction('active-region');

      this.chartInstance1.render();
    }
  },
  created() {
    this.getDefaultTable()
  },
  mounted() {

  }
}
</script>

<style>

</style>

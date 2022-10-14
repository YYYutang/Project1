<template>
  <div>
      <h1>数据分析与数据可视化</h1>


    <div style="margin: 10px">
      <span>第一步： </span>
      <el-button type="success" @click="dialogVisible = true" style="margin: 10px">选择数据表</el-button>
    </div>

<!--    图表展示-->
    <div>
      <el-card style="width: 100%">
        <span>图表展示</span>

      </el-card>
    </div>


<!--    弹窗内容-->
    <el-dialog title="请选择数据表" :visible.sync="dialogVisible" style="width: 100%">
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
        <el-col :span="12">
          <el-card class="right" style=" width: 100%;  padding: 5px; ">
            <h3 style="margin-bottom: 10px">请选择特征</h3>
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="checkedColumns" @change="handleCheckedColumnsChange">
              <el-checkbox v-for="col in columns" :label="col" :key="col.columnId">Id:{{col.columnId}}-列名:{{col.columnName}}</el-checkbox>
            </el-checkbox-group>
          </el-card>
        </el-col>
      </el-row>


      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="getConData">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

import {getRequest, postRequest} from "../../utils/api";

export default {
  data(){
    return {
      checkedTableName:'',
      checkAll: false,
      checkedColumns: [],
      columns: [],
      isIndeterminate: true,

      tableData: [],
      dialogVisible: false,
      requestParams:{
        tableName: '',
      }


    }
  },
  methods:{
    getDefaultTable(){
      getRequest("/main/dataadmin/tablesche/querytable").then(res => {
        console.log("无参查询 数据表")
        // console.log(res)
        this.tableData = res._message.data.records
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
    getConData(){
      // 选择好表、特征列去查询数据
      if (this.checkedTableName){
        let params = {
          tableName: this.checkedTableName,
          colNames: []
        }
        for (let col of this.checkedColumns) {
          params.colNames.push(col.columnName)
        }

        // console.log(params)
        postRequest("/data/column/query", params).then(res => {
          console.log("条件数据")
          console.log(res)
        })
        this.dialogVisible = false

      }else{
        this.$message.error('错了哦，还未选择表！');
      }



    }
  },
  created() {
    this.getDefaultTable()

  }

}
</script>

<style>

</style>

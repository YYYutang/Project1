<template>
  <div>
      <h1>数据分析与数据可视化</h1>


    <div style="margin-bottom: 20px">
      <span>第一步： </span>
      <el-button @click="dialogVisible = true" style="margin: 10px">选择数据表</el-button>
    </div>

<!--    图标展示-->
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
      </el-form>

      <el-row :gutter="40">
        <el-col :span="12">
          <div class="left" style=" width: 100%; ">
            <el-table
                :data="tableData"
                stripe
                style="width: 100%">
              <el-table-column
                  prop="date"
                  label="日期"
                  width="120">
              </el-table-column>
              <el-table-column
                  prop="name"
                  label="姓名"
                  width="120">
              </el-table-column>
              <el-table-column
                  prop="address"
                  label="地址">
              </el-table-column>
              <el-table-column label="操作" fixed="right">
                <template slot-scope="scope">
                  <el-button
                      size="small"
                      type="primary" plain
                      @click="handleTableCheck(scope.$index, scope.row)">选择</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="right" style=" width: 100%;  padding: 5px; box-shadow: 0px 0px 5px; ">
            <h3 style="margin-bottom: 10px">请选择特征</h3>
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-col>
      </el-row>


      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

import {postRequest} from "../../utils/api";

export default {
  data(){
    return {
      checkAll: false,
      checkedCities: ['重庆'],
      cities: ['上海', '北京', '广州', '深圳','重庆'],
      isIndeterminate: true,

      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      dialogVisible: false,
      requestParams:{
        tableName: '',
      }


    }
  },
  methods:{
    // 搜索函数
    search(){
      postRequest(this.requestParams.tableName).theh(res => {
        log(res)
      })
      alert("1111")
    },
    handleTableCheck(a1, a2){
      console.log('选择表格')
      console.log(a1,a2);

    },

    handleCheckAllChange(val) {

      this.checkedCities = val ? this.cities : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      console.log(this.checkedCities)
    }
  }

}
</script>

<style>

</style>

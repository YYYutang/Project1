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
        <el-row :gutter="50">
          <el-col :span="10">
            <!-- 动态展示表格 -->
            <el-table style="width: 100%; margin: 10px"
                      border
                      :data="tableConData">
              <template v-for="item in ColumnsWithNull">
                <el-table-column :prop="item.columnName"
                                 :label="item.columnName"
                                 :key="item.columnId"></el-table-column>
              </template>
            </el-table>
          </el-col>

          <el-col :span="14">
            <span>列缺失信息统计</span>
            <div class="chart" ref="chart1" style="height: 300px; width: 80%"></div>
            <div class="chart" ref="chart2" style="height: 300px; width: 50%"></div>
          </el-col>
        </el-row>



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
// import { Chart } from '@antv/g2';
export default {
  data(){
    return {
      chartInstance: null,

      columnsNull: null,
      rowsNull: [],
      checkedTableName:'',
      checkAll: false,
      checkedColumns: [],
      ColumnsWithNull: [],
      columns: [],
      isIndeterminate: true,

      tableData: [],
      tableConData: [],
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
    getColumnsNull(param){
      console.log(param)
      // 查询每列有多少缺失值
      postRequest("/data/column/querycolumnsnull", param).then(res => {
        this.columnsNull = res._message.data[0]
        // console.log("列缺失信息")
        // console.log(this.columnsNull)
        this.getChart()
      })
    },
    getRowsNull(param){
      // 查询每行有多少缺失值
      postRequest("/data/hang/queryColnull", param).then(res => {
        this.rowsNull = res._message.data
        console.log(res)
        this.getChart2()
      })

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
        postRequest("/data/hang/queryColnull", params).then(res => {
          // console.log("条件数据")
          // console.log(res)
          this.tableConData = res._message.data
          this.ColumnsWithNull = this.checkedColumns
          // 多加表格第一列缺失列
          this.ColumnsWithNull = [{columnName: 'missing'}, ...this.ColumnsWithNull]
          // console.log(this.tableConData)
          // console.log(this.ColumnsWithNull)
        })
        // 查询表的缺失值情况
        this.getColumnsNull(params)
        this.getRowsNull(params)

        this.dialogVisible = false

      }else{
        this.$message.error('错了哦，还未选择表！');
      }
    },

    getChart(){
      const data = [];

      let colNull = this.columnsNull;
      let dataNum = colNull.dataNum // 样本总数
      delete colNull.dataNum

      let keys = Object.keys(colNull)
      let vals = Object.values(colNull)
      for (let i=0; i<keys.length;i++)
      {
        data.push({
          type: keys[i], value: vals[i], percent: Number( (vals[i]/dataNum).toFixed(2) )
        })
      }
      data.sort((a, b) => a.value < b.value ? 1 : a.value > b.value ? -1 : 0)
      console.log(data)
      const chart = new this.$G2.Chart({
        container: this.$refs.chart1,
        autoFit: true,
        height: 500,
        padding: [50, 20, 50, 20],
      });
      chart.data(data);
      chart.scale('value', {
        alias: '缺失数量 ',
      });

      chart.axis('type', {
        tickLine: {
          alignTick: false,
        },
      });
      chart.axis('value', false);

      chart.tooltip({
        showMarkers: false,
      });
      chart.interval().position('type*value').color('type');
      chart.interaction('element-active');

// 添加文本标注
      data.forEach((item) => {
        chart
            .annotation()
            .text({
              position: [item.type, item.value],
              content: item.value,
              style: {
                textAlign: 'center',
              },
              offsetY: -30,
            })
            .text({
              position: [item.type, item.value],
              content: (item.percent * 100).toFixed(0) + '%',
              style: {
                textAlign: 'center',
              },
              offsetY: -12,
            });
      });
      chart.render();


    },
    getChart2(){

      let rolnull = this.rowsNull
      let toal = rolnull.length
      let queshi = 0
      let wanzhen=0
      for (let item of rolnull) {
        if (item.missing != 0){
          wanzhen++
        }
      }
      queshi = toal - wanzhen
      let data = [];
      data.push({item: '缺失样本数', count: queshi, percent: Number( (queshi/toal).toFixed(2) )})
      data.push({item: '未缺失样本数', count: wanzhen, percent: Number( (wanzhen/toal).toFixed(2) )})
      console.log(data)

      const chart = new this.$G2.Chart({
        container: this.$refs.chart2,
        autoFit: true,
        height: 500,
      });
      chart.data(data);
      chart.scale('percent', {
        formatter: (val) => {
          val = val * 100 + '%';
          return val;
        },
      });
      chart.coordinate('theta', {
        radius: 0.75,
        innerRadius: 0.6,
      });
      chart.tooltip({
        showTitle: false,
        showMarkers: false,
        itemTpl: '<li class="g2-tooltip-list-item"><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>',
      });
// 辅助文本
      chart
          .annotation()
          .text({
            position: ['50%', '50%'],
            content: '样本总数',
            style: {
              fontSize: 14,
              fill: '#8c8c8c',
              textAlign: 'center',
            },
            offsetY: -20,
          })
          .text({
            position: ['50%', '50%'],
            content: String(toal),
            style: {
              fontSize: 20,
              fill: '#8c8c8c',
              textAlign: 'center',
            },
            offsetX: -10,
            offsetY: 20,
          })
          .text({
            position: ['50%', '50%'],
            content: '个',
            style: {
              fontSize: 14,
              fill: '#8c8c8c',
              textAlign: 'center',
            },
            offsetY: 20,
            offsetX: 20,
          });
      chart
          .interval()
          .adjust('stack')
          .position('percent')
          .color('item')
          .label('percent', (percent) => {
            return {
              content: (data) => {
                return `${data.item}: ${percent * 100}%`;
              },
            };
          })
          .tooltip('item*percent', (item, percent) => {
            percent = percent * 100 + '%';
            return {
              name: item,
              value: percent,
            };
          });

      chart.interaction('element-active');

      chart.render();
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

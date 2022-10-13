<template>
  <div id="dm_main">
      <el-button v-if="isshow1" id="uploadbutton" type="primary" @click="changeButton">文件上传</el-button>
      <el-button  v-if="isshow2" id="schema1" type="primary" @click="showSchemaHas">已存在表</el-button>
      <el-button  v-if="isshow3" id="schema2" type="primary" @click="showSchemaNew">新建表</el-button>
  
      <el-dialog title="已存在表的基本信息" :visible.sync="schemaHasVisible">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
           <el-form-item label="表名">
           <el-input v-model="formInline.SchemaHasName" placeholder="表名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchSchema">查询</el-button>
           </el-form-item>
</el-form>
          <el-table
    :data="tableData"
    style="width: 100%"
    height="250">
    <el-table-column
      fixed
      prop="schema_name"
      label="表名"
      width="120">
    </el-table-column>
    <el-table-column
      prop="attribute_name"
      label="属性名"
      width="260">
    </el-table-column>
    <el-table-column
      label="上传文件"
      width="100">
      <template>
         <el-upload
           class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
           :on-preview="handlePreview"
           :on-remove="handleRemove"
           :before-remove="beforeRemove"
           :http-request="getFile"
           multiple
             :file-list="fileList">
             <el-button size="small" type="primary">上传文件</el-button>
          </el-upload>
      </template>
    </el-table-column>

  </el-table>
          <div slot="footer" class="dialog-footer">
             <el-button @click="schemaNewVisible = false;ruleForm2.schemaAttributeName=[];">取 消</el-button>
              <el-button type="primary" @click="submitNewSchemaNum(ruleForm1)">确 定</el-button>
           </div>
          </el-dialog>
        <el-dialog title="新建表的基本信息" :visible.sync="schemaNewVisible">
          <el-form :model="ruleForm1" :rules="rules" ref="ruleForm1" >
           <el-form-item label="新建表名称" :label-width="formLabelWidth" prop="schemaName">
            <el-input v-model="ruleForm1.schemaName" autocomplete="off"></el-input>
           </el-form-item>
          <el-form-item label="新建表属性个数" :label-width="formLabelWidth">
              <el-input-number v-model="ruleForm1.schemaAttributeNum" @change="handleChange" :min="1" :max="100" label="请输入新建表的属性个数"></el-input-number>
          </el-form-item>
          </el-form> 
          <div slot="footer" class="dialog-footer">
             <el-button @click="schemaNewVisible = false;ruleForm2.schemaAttributeName=[];">取 消</el-button>
              <el-button type="primary" @click="submitNewSchemaNum(ruleForm1)">确 定</el-button>
           </div>
          </el-dialog>
          
        <el-dialog title="新建表的具体信息" :visible.sync="schemaNewCoulumn" >
          <el-form :model="ruleForm2"  ref="ruleForm2">
           <el-form-item  v-for="(item,index) in ruleForm2.schemaAttributeName" 
                          :prop="'schemaAttributeName.' + index + '.value'"
                          label="属性名称" 
                          :label-width="formLabelWidth"
                          :rules="{
                                      required: true, message: '请输入表属性名', trigger: 'blur'
                              }"
          >
            <el-input v-model="item.value" autocomplete="off"></el-input>
           </el-form-item>
          </el-form> 
          <div slot="footer" class="dialog-footer">
             <el-button @click="schemaNewCoulumn = false;ruleForm2.schemaAttributeName=[];">取 消</el-button>
              <el-button type="primary" @click="submitNewSchema('ruleForm2')">确 定</el-button>
           </div>
          </el-dialog>
        <el-dialog title="新建表的上传" :visible.sync="schemaNewUpload">
         <el-upload
           class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
           :on-preview="handlePreview"
           :on-remove="handleRemove"
           :before-remove="beforeRemove"
           :http-request="getFile"
           multiple
             :file-list="fileList">
             <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
              <div slot="footer" class="dialog-footer">
             <el-button @click="schemaNewUpload = false;fileList=[];ruleForm2.schemaAttributeName=[]">取 消</el-button>
              <el-button type="primary" @click="submitNewUpload">确 定</el-button>
           </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入表名'));
      }else {
        callback();
      }
      }
      // var validatePass1=(rule,value,callback)=>{
      //   if(value===''){
      //     callback(new Error('请输入表属性名'));
      //   }
      //   else{
      //     callback();
      //   }
      // }
    
    return{
      isshow1:true,
      isshow2:false,
      isshow3:false,

      schemaHasVisible:false,
      schemaNewVisible:false,
      schemaNewCoulumn:false,
      schemaNewUpload:false,
      flag:1,
      ruleForm1:{
        schemaName:'',
        schemaAttributeNum:'',
        // schemaAttributeName:[],
      },
      formLabelWidth: '120px',
      rules:{
        schemaName:[
          {validator: validatePass,trigger:'blur'}
        ]
      },
      ruleForm2:{
        schemaAttributeName:[]
      },
      file:{},
       fileList: [],
       tableData:[{}],
       formInline:{
         schemaHasName:'',
       }
    //  rules1:{
    //          name:[{validator: validatePass1,trigger:'blur'}]
    //        }
    }
  },
  
methods:{
    changeButton() {
      this.isshow1 = !this.isshow1;  //当点击按钮触发事件时改变两个按钮的显示
      this.isshow2 = !this.isshow2;
      this.isshow3= !this.isshow3;
    },
    showSchemaHas(){
      this.schemaHasVisible=true;

    },
    showSchemaNew(){
      this.schemaNewVisible=true;
    },
     handleChange(value) {
        console.log(value);
    },
    handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },

      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
     submitNewSchemaNum(ruleForm1){

        this.$refs.ruleForm1.validate((valid) => {
        if (valid) {
           alert('submit!');
          this.schemaNewVisible=false;
          for(let i=1;i<=this.ruleForm1.schemaAttributeNum;i++){
            let obj={name:`input${i}`, value: ''};
            this.ruleForm2.schemaAttributeName.push(obj);
          }

          this.schemaNewCoulumn=true;
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    submitNewSchema(info){

      this.$refs[info].validate((valid) => {
          if (valid) {
            alert('submit!');
            this.schemaNewCoulumn=false;
            this.schemaNewUpload=true;
          } else {
            console.log('error submit!!');
            this.ruleForm2.schemaAttributeName=[];
            return false;
          }
        });
    },
    getFile(item){
          this.file = item.file
    },
        submitNewUpload(){
            const fd = new FormData()
            fd.append('filename', this.file)
            const config = { headers: { 'Content-Type': 'multipart/form-data' }}
             this.$axios.post('/uploading', fd, config
             ).then(response => {
                this.$message.success(response.retCode)
              })
        },
        submitOldSchema(){

        },
        searchSchema(){

        }
 
    //      this.$refs.ruleForm1.schemaAttributeName[index].validate((valid) => {
      
    //   if(this.flag){
    //       console.log(this.ruleForm1.schemaAttributeName)
    //       this.ruleForm1.schemaAttributeName=[];
    //       this.schemaNewCoulumn=false;
    //     } else {
    //       console.log('error submit!!');
    //       return false;
    //     }
      
    
    // })

}
}


</script>

<style>

#dm_main{
  position:relative;
  height:100%
}
#uploadbutton{
        position: absolute;
        left: 50%;
         top: 50%;
        transform: translateX(-50%) translateY(-50%);
}
#schema1{
   position: absolute;
        left: 45%;
         top: 50%;
        transform: translateX(-50%) translateY(-50%);
}
#schema2{
   position: absolute;
        left: 55%;
         top: 50%;
        transform: translateX(-50%) translateY(-50%);
}

</style>
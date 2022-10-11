<template>
  <div id="dm_main">
      <el-button v-if="isshow1" id="uploadbutton" type="primary" @click="changeButton">文件上传</el-button>
      <el-button  v-if="isshow2" id="schema1" type="primary">已存在表</el-button>
      <el-button  v-if="isshow3" id="schema2" type="primary">新建表</el-button>
  </div>
</template>

<script>
export default {
  data(){
    return{
      isshow1:true,
      isshow2:false,
      isshow3:false,
    }
  },
  
methods:{
    changeButton() {
      this.isshow1 = !this.isshow1;  //当点击按钮触发事件时改变两个按钮的显示
      this.isshow2 = !this.isshow2;
      this.isshow3= !this.isshow3;
    },


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
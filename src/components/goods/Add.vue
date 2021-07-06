<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" class="myBreadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品添加</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="myCard">
      <el-alert title="消息提示的文案" type="info" center show-icon> </el-alert>
      <!-- 步骤条 -->
      <el-steps
        class="mySteps"
        :space="200"
        :active="activeIndex * 1"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏区域 -->
      <el-form
        :model="addGoodsForm"
        :rules="addGoodsRules"
        ref="addGoodsRef"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeLeaveTab"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                type="number"
                v-model="addGoodsForm.goods_price"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                type="number"
                v-model="addGoodsForm.goods_weight"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                type="number"
                v-model="addGoodsForm.goods_number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                v-model="addGoodsForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyParamsArr"
              :label="item.attr_name"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  v-for="(item, index) in item.attr_vals"
                  :key="index"
                  :label="item"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyParamsArr"
              :label="item.attr_name"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals" clearable></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="pictureURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
              :headers="headerObj"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <template>
              <quill-editor
                ref="myQuillEditor"
                v-model="addGoodsForm.goods_introduce"
              />
            </template>
            <el-button type="primary" class="addButton" @click="addGoods"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览框 -->
    <el-dialog title="图片预览" :visible.sync="picturePreVisibile">
      <img :src="picPath" :alt="picName" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkNum = (rule, value, callback) => {
      if (value < 0) {
        return callback(new Error("该数值项不能小于零！"));
      }
    };
    return {
      activeIndex: "0",
      /* 添加商品表单 */
      addGoodsForm: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        //商品分类列表
        goods_cat: [],
        //商品图片
        pics: [],
        //商品信息
        goods_introduce: "",
      },
      /* 添加商品表单验证规则 */
      addGoodsRules: {
        goods_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { validator: checkNum, trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { validator: checkNum, trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { validator: checkNum, trigger: "blur" },
        ],
      },
      //分类商品选项配置
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //商品分类列表
      cateList: [],
      value: [],
      //商品动态参数列表
      manyParamsArr: [],
      //商品静态属性列表
      onlyParamsArr: [],
      //图片上传的后台地址
      pictureURL: "http://42.192.71.221:8889/api/private/v1/upload",
      //图片上传请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      //图片的路径
      picPath: "",
      //图片名称
      picName: "",
      //图片预览框
      picturePreVisibile: false,
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    getCateList() {
      this.$axios.get("categories").then((res) => {
        // console.log(res);
        if (res.data.meta.status !== 200)
          return this.$message.error("获取商品分类数据失败！");
        this.cateList = res.data.data;
      });
    },
    handleChange() {
      if (this.addGoodsForm.goods_cat.length !== 3)
        return (this.addGoodsForm.goods_cat = []);
    },
    /* 切换tab栏时进行规则判断 */
    beforeLeaveTab(activeName, oldActiveName) {
      //   let goNext =
      //     this.addGoodsForm.goods_name.trim() === "" ||
      //     this.addGoodsForm.goods_price === 0 ||
      //     this.addGoodsForm.goods_weight === 0 ||
      //     this.addGoodsForm.goods_number === 0;
      //   if (goNext) {
      //     console.log(goNext);
      //     this.$message.error("请输入必填项！");
      //     return false;
      //   }
      if (this.addGoodsForm.goods_cat.length !== 3 && oldActiveName === "0") {
        this.$message.error("请选择商品分类！");
        return false;
      }
    },
    tabClick() {
      if (this.activeIndex === "1") {
        this.$axios
          .get(`categories/${this.addGoodsForm.goods_cat[2]}/attributes`, {
            params: { sel: "many" },
          })
          .then((res) => {
            if (res.data.meta.status !== 200)
              return this.$message.error("获取商品参数数据失败！");
            this.manyParamsArr = res.data.data;
            this.manyParamsArr.forEach((item) => {
              item.attr_vals =
                item.attr_vals.length === 0 ? [] : item.attr_vals.split(",");
            });
            // console.log(this.manyParamsArr);
          });
      } else if (this.activeIndex === "2") {
        this.$axios
          .get(`categories/${this.addGoodsForm.goods_cat[2]}/attributes`, {
            params: { sel: "only" },
          })
          .then((res) => {
            if (res.data.meta.status !== 200)
              return this.$message.error("获取商品参数数据失败！");
            this.onlyParamsArr = res.data.data;
            // console.log(this.onlyParamsArr);
          });
      } else if (this.activeIndex === "3") {
        return;
      }
    },
    handleRemove(file) {
      const filePath = file.response.data.tmp_path;
      const index = this.addGoodsForm.pics.findIndex(
        (item) => item.pic === filePath
      );
      this.addGoodsForm.pics.splice(index, 1);
    },
    handlePreview(file) {
      this.picPath = file.url;
      this.picName = file.name;
      this.picturePreVisibile = true;
    },
    handleSuccess(response) {
      this.addGoodsForm.pics.push({ pic: response.data.tmp_path });
    },
    addGoods() {
      console.log(this.addGoodsForm);
      // console.log(this.$refs.addGoodsRef.validate());
      this.$refs.addGoodsRef.validate((valid) => {
        console.log(1);
        if (!valid) return this.$message.error("请先输入必填项！");
      });
      console.log(2);
      // 处理商品的分类列表数据，转换成字符串型
      let colneForm = _.cloneDeep(this.addGoodsForm);
      // console.log("克隆后的" + colneForm);
      colneForm.goods_cat = colneForm.goods_cat.join(",");
      // 处理商品的动态参数和静态属性数据，拼接成数组
      this.manyParamsArr.forEach((item) => {
        colneForm.attrs.push({
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(" "),
        });
      });
      this.onlyParamsArr.forEach((item) => {
        colneForm.attrs.push({
          attr_id: item.attr_id,
          attr_value: item.attr_vals,
        });
      });
      this.$axios.post("goods", colneForm).then((res) => {
        console.log(res);
      });
    },
  },
};
</script>

<style scoped lang='less'>
.el-input {
  width: 360px;
}

.addButton {
  margin-top: 10px;
}
</style>

<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" class="myBreadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="myCard">
      <el-row>
        <el-button type="primary" @click="showAddCateDialog"
          >添加分类</el-button
        >
      </el-row>
      <!-- 商品分类列表 -->
      <tree-table
        class="myTable"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scoped">
          <i
            class="el-icon-success"
            v-if="scoped.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scoped">
          <el-tag size="mini" type="info" v-if="scoped.row.cat_level == 0"
            >一级</el-tag
          >
          <el-tag
            size="mini"
            type="success"
            v-else-if="scoped.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt">
          <el-button size="mini" type="primary" icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button size="mini" type="danger" icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        class="myPagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="40%"
      @close="addCateDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" prop="cat_pid">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            clearable
            change-on-select
            @change="parentCateChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      columns: [
        { label: "分类名称", prop: "cat_name" },
        { label: "是否有效", type: "template", template: "isok" },
        { label: "排序", type: "template", template: "order" },
        { label: "操作", type: "template", template: "opt" },
      ],
      addCateDialogVisible: false,
      //添加分类的表单数据对象
      addCateForm: {
        cat_name: "",
        //添加分类的父级id，0则表示父级为0.添加一级分类
        cat_pid: 0,
        //添加分类的等级，0则表示添加一级分类
        cat_level: 0,
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
      //保存1,2级父级分类的列表
      parentCateList: [],
      //配置级联菜单中数据如何展示
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      //绑定用户选择的分类值
      selectedKeys: [],
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    getCateList() {
      this.$axios.get("categories", { params: this.queryInfo }).then((res) => {
        // console.log(res);
        if (res.data.meta.status !== 200)
          return this.$message.error("获取分类列表失败！");
        this.cateList = res.data.data.result;
        this.total = res.data.data.total;
      });
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getCateList();
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getCateList();
    },
    showAddCateDialog() {
      this.addCateDialogVisible = true;
      this.$axios.get("categories", { params: { type: 2 } }).then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error("获取商品分类列表数据失败");
        this.parentCateList = res.data.data;
      });
    },
    parentCateChange() {
      //如果用户选择了父级分类
      if (this.selectedKeys.length > 0) {
        //则将数组中的最后一项设置为父级分类
        this.addCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1];
        //level也要跟着发生变化
        this.addCateForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
        return;
      }
    },
    addCate() {
      this.$refs.addCateFormRef.validate((valid) => {
        if (!valid) return;
        this.$axios.post("categories", this.addCateForm).then((res) => {
          if (res.data.meta.status !== 201)
            return this.$message.error("添加分类失败");
          this.$message.success("添加分类成功");
          this.getCateList();
          this.addCateDialogVisible = false;
        });
      });
    },
    addCateDialogClosed() {
      //当关闭添加分类对话框时，重置表单
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },
  },
};
</script>

<style scoped lang='less'>
</style>

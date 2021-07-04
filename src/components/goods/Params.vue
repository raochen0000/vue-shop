<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" class="myBreadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="myCard">
      <!-- 警告区域 :closable="false"(是否展示“X”号) show-icon(显示图标) -->
      <el-alert
        class="myAlert"
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            expandTrigger="hover"
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
        <el-col></el-col>
      </el-row>
      <!-- tab区域 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="isDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table class="myTable" :data="manyTableData" border stripe>
            <el-table-column type="expand" width="40">
              <template slot-scope="scoped">
                <el-tag
                  class="myTag"
                  closable
                  type="primary"
                  v-for="(item, index) in scoped.row.attr_vals"
                  :key="index"
                  @close="handleClose(index, scoped.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="myInput"
                  v-if="scoped.row.inputVisible"
                  v-model="scoped.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scoped.row)"
                  @blur="handleInputConfirm(scoped.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scoped.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column
              type="index"
              label="#"
              width="50"
            ></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scoped">
                <el-button
                  type="warning"
                  icon="el-icon-edit"
                  @click="showEditDialog(scoped.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="deletAttr(scoped.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="isDisabled"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table class="myTable" :data="onlyTableData" border stripe>
            <el-table-column type="expand" width="40">
              <template slot-scope="scoped">
                <el-tag
                  class="myTag"
                  closable
                  type="primary"
                  v-for="(item, index) in scoped.row.attr_vals"
                  :key="index"
                  @close="handleClose(index, scoped.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="myInput"
                  v-if="scoped.row.inputVisible"
                  v-model="scoped.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scoped.row)"
                  @blur="handleInputConfirm(scoped.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scoped.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column
              type="index"
              label="#"
              width="50"
            ></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scoped">
                <el-button
                  type="warning"
                  icon="el-icon-edit"
                  @click="showEditDialog(scoped.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="deletAttr(scoped.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加动态参数对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="40%"
    >
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="addName">
          <el-input v-model="addForm.addName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAttr">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="40%"
    >
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAttr">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //分类列表
      cateList: [],
      //用户在级联下拉菜单中选中的分类id
      selectedCateKeys: [],
      //配置级联菜单中数据如何展示
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      activeName: "many",
      //用来保存动态参数数据
      manyTableData: [],
      //用来保存静态属性数据
      onlyTableData: [],
      // 展示动态参数或静态属性对话框
      addDialogVisible: false,
      //动态参数或静态属性表单
      addForm: {
        addName: "",
      },
      //动态参数或静态参数表单验证规则
      addRules: {
        addName: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            min: 2,
            max: 15,
            message: "长度在 2 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
      // 展示修改对话框
      editDialogVisible: false,
      editForm: {},
      editRules: {
        attr_name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            min: 2,
            max: 15,
            message: "长度在 2 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
      inputVisible: false,
      inputValue: "",
    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    isDisabled() {
      if (this.selectedCateKeys.length !== 3) return true;
      return false;
    },
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[this.selectedCateKeys.length - 1];
      }
      return null;
    },
    titleText() {
      if (this.activeName === "many") return "动态参数";
      else if (this.activeName === "only") return "静态属性";
    },
  },
  methods: {
    getCateList() {
      this.$axios.get("categories").then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error("获取分类数据失败");
        this.cateList = res.data.data;
      });
    },
    handleChange() {
      if (this.selectedCateKeys.length !== 3) {
        this.manyTableData = [];
        this.onlyTableData = [];
        return (this.selectedCateKeys = []);
      }
      this.$axios
        .get(`categories/${this.cateId}/attributes`, {
          params: { sel: this.activeName },
        })
        .then((res) => {
          res.data.data.forEach((item) => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
            item.inputVisible = false;
            item.inputValue = "";
          });
          // console.log(res);
          if (res.data.meta.status !== 200)
            return this.$message.error("获取参数列表数据失败");
          if (this.activeName === "many") {
            this.manyTableData = res.data.data;
          } else if (this.activeName === "only") {
            this.onlyTableData = res.data.data;
          }
        });
    },
    handleClick() {
      this.handleChange();
    },
    //添加动态参数或静态属性
    addAttr() {
      this.$refs.addRef.validate((valid) => {
        if (valid) {
          this.$axios
            .post(`categories/${this.cateId}/attributes`, {
              attr_name: this.addForm.addName,
              attr_sel: this.activeName,
              attr_vals: "a,b,c",
            })
            .then((res) => {
              if (res.data.meta.status !== 201)
                return this.$message.error("添加参数失败！");
              this.addDialogVisible = false;
              this.$refs.addRef.resetFields();
              this.handleChange();
              return this.$message.success("添加参数成功！");
            });
        } else {
          return this.$message.error("提交出错！");
        }
      });
    },
    showEditDialog(attrId) {
      this.$axios
        .get(`categories/${this.cateId}/attributes/${attrId}`, {
          params: { attr_sel: this.activeName },
        })
        .then((res) => {
          this.editForm = res.data.data;
        });
      this.editDialogVisible = true;
    },
    editAttr() {
      this.$refs.editRef.validate((valid) => {
        if (!valid) return this.$message.error("提交数据出错！");
        this.$axios
          .put(
            `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
            {
              attr_name: this.editForm.attr_name,
              attr_sel: this.activeName,
            }
          )
          .then((res) => {
            if (res.data.meta.status !== 200)
              return this.$message.error("更新数据失败！");
            this.$refs.editRef.resetFields();
            this.handleChange();
            return (this.editDialogVisible = false);
          });
      });
    },
    /* 删除对话框 */
    deletAttr(attrId) {
      this.$confirm(`此操作将永久删除该${this.titleText}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios
            .delete(`categories/${this.cateId}/attributes/${attrId}`)
            .then((res) => {
              // console.log(res);
              if (res.data.meta.status !== 200)
                return this.$message.error("删除失败！");
              this.handleChange();
              return this.$message.success("删除成功！");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        return (row.inputVisible = false);
      }
      row.attr_vals.push(row.inputValue.trim());
      this.saveAttrVals(row);
    },
    handleClose(i, row) {
      row.attr_vals.splice(i, 1);
      this.saveAttrVals(row);
    },
    saveAttrVals(row) {
      // console.log(row.attr_vals);
      this.$axios
        .put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" "),
        })
        .then((res) => {
          // console.log(res);
          row.inputValue = "";
          row.inputVisible = false;
        });
    },
  },
};
</script>

<style scoped lang='less'>
</style>

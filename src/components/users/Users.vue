<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" class="myBreadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="myCard">
      <!-- 搜索 -->
      <el-row :gutter="20">
        <el-col :span="16">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 数据表格 -->
      <template>
        <el-table
          :data="userList"
          style="width: 100%; margin: 20px auto"
          border
          stripe
        >
          <el-table-column type="index" width="40" label="#"></el-table-column>
          <el-table-column prop="username" label="姓名"></el-table-column>
          <el-table-column prop="email" label="邮箱"> </el-table-column>
          <el-table-column prop="mobile" label="电话"> </el-table-column>
          <el-table-column prop="role_name" label="角色"> </el-table-column>
          <el-table-column prop="mg_state" label="状态" width="100">
            <template slot-scope="scoped">
              <el-switch
                v-model="scoped.row.mg_state"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="changeState(scoped.row)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="edit" width="200" label="操作">
            <template slot-scope="scoped">
              <!-- 编辑按钮 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scoped.row.id)"
              ></el-button>
              <!-- 删除按钮 -->
              <el-button
                type="primary"
                icon="el-icon-delete"
                size="mini"
                @click="deleteUser(scoped.row.id)"
              ></el-button>
              <!-- 设置按钮 -->
              <el-tooltip
                class="item"
                effect="dark"
                content="设置用户信息"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="primary"
                  icon="el-icon-setting"
                  size="mini"
                  @click="showRightsDialog(scoped.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 4, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="40%"
      center
      @close="resetForm"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        :inline="true"
      >
        <el-form-item label="姓名" prop="username">
          <el-input v-model="addForm.username" class="iptWidth"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" class="iptWidth"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" class="iptWidth"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile" class="iptWidth"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息对话框 -->
    <el-dialog
      title="修改信息"
      :visible.sync="editDialogVisible"
      width="40%"
      center
    >
      <el-form
        :inline="true"
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
      >
        <el-form-item label="姓名">
          <el-input
            class="iptWidth"
            v-model="editForm.username"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input class="iptWidth" v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input class="iptWidth" v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 设置用户信息对话框 -->
    <el-dialog
      title="用户权限分配"
      :visible.sync="editRightsDialogVisible"
      width="40%"
      @close="roleValue = ''"
    >
      <div>
        <p>当前用户：{{ currentRole.username }}</p>
        <p>当前角色：{{ currentRole.role_name }}</p>
        <p>
          分配新角色：
          <el-select v-model="roleValue" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var validateEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/;
      if (regEmail.test(value)) return callback();
      return callback(new Error("请输入正确的邮箱格式！"));
    };
    var validatePhone = (rule, value, callback) => {
      const regPhone = /^1[34578]\d{9}$/;
      if (regPhone.test(value)) return callback();
      return callback(new Error("请输入正确的手机号码格式！"));
    };
    return {
      userList: [],
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 4,
      },
      totalPage: 0,
      dialogVisible: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      dialogVisible: false,
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            validator: validateEmail,
            message: "邮箱格式不正确，请重新输入",
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            validator: validatePhone,
            message: "手机号码不正确，请重新输入",
            trigger: "blur",
          },
        ],
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            validator: validateEmail,
            message: "邮箱格式不正确，请重新输入",
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            validator: validatePhone,
            message: "手机号码不正确，请重新输入",
            trigger: "blur",
          },
        ],
      },
      editRightsDialogVisible: false,
      //当前展示的用户角色
      currentRole: [],
      //角色列表
      rolesList: [],
      //用户下拉列表中选择的角色
      roleValue: "",
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    /* 获取用户列表 */
    getUserList() {
      this.$axios.get("/users", { params: this.queryInfo }).then((res) => {
        console.log(res);
        if (res.data.meta.status !== 200)
          return this.$message.error("获取用户信息列表失败！");
        this.userList = res.data.data.users;
        this.totalPage = res.data.data.total;
      });
    },
    handleSizeChange(val) {
      //   console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      //   console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val;
      this.getUserList();
    },
    changeState(userInfo) {
      this.$axios
        .put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
        .then((res) => {
          if (res.data.meta.status !== 200)
            return this.$message.error("修改状态失败！");
          return this.$message.success("修改状态成功！");
        });
    },
    /* 重置表单内容 */
    resetForm() {
      this.$refs.addFormRef.resetFields();
    },
    /* 添加用户 */
    addUser() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return;
        this.$axios.post("/users", this.addForm).then((res) => {
          if (res.data.meta.status !== 201) {
            return this.$message.error("添加用户失败！");
          }
          this.getUserList();
          return this.$message.success("添加用户成功！");
        });
        this.dialogVisible = false;
      });
    },
    showEditDialog(id) {
      this.editDialogVisible = true;
      this.$axios.get(`users/${id}`).then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error("获取用户信息失败！");
        this.editForm = res.data.data;
      });
    },
    /* 编辑用户信息 */
    editUser() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return;
        this.$axios
          .put(`users/${this.editForm.id}`, {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          })
          .then((res) => {
            if (res.data.meta.status !== 200)
              return this.$message.error("更新失败！");
            this.editDialogVisible = false;
            this.getUserList();
            return this.$message.success("更新成功！");
          });
      });
    },
    /* 删除用户 */
    deleteUser(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios.delete(`users/${id}`).then(() => {
            this.getUserList();
          });
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    /* 获取用户权限 */
    showRightsDialog(roles) {
      this.editRightsDialogVisible = true;
      this.currentRole = roles;
      this.$axios.get("roles").then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error("获取角色列表失败！");
        this.rolesList = res.data.data;
      });
    },
    setRoles() {
      if (!this.roleValue) return this.$message.error("请先选择用户角色！");
      this.$axios
        .put(`users/${this.currentRole.id}/role`, { rid: this.roleValue })
        .then((res) => {
          if (res.data.meta.status !== 200)
            return this.$message.error("更新用户角色失败！");
          this.getUserList();
          this.$message.success("更新用户角色成功！");
        });
      this.editRightsDialogVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.iptWidth {
  width: 380px !important;
}
</style>
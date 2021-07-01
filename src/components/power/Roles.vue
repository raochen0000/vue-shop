<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" class="myBreadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="myCard">
      <!-- 添加按钮 -->
      <el-row>
        <el-button class="myButton" type="primary">添加角色</el-button>
      </el-row>
      <!-- 角色数据表 -->
      <el-table border :stripe="true" :data="rolesList">
        <el-table-column type="expand" label="" width="40">
          <template slot-scope="scoped">
            <el-row
              v-for="(item1, index1) in scoped.row.children"
              :key="item1.id"
              :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'vCenter']"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag type="primary" closable>{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二，三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                  :class="[index2 === 0 ? '' : 'bdtop', 'vCenter']"
                >
                  <el-col :span="6">
                    <el-tag type="info" closable>{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRolesRights(scoped.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column
          type=""
          label="角色名称"
          prop="roleName"
        ></el-table-column>
        <el-table-column type="" label="角色描述" prop="roleDesc"
          >技术负责人</el-table-column
        >
        <el-table-column type="" label="操作">
          <template slot-scope="scoped">
            <!-- 编辑按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"
              >编辑</el-button
            >
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini"
              >删除</el-button
            >
            <!-- 设置按钮 -->
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showrightsDialog(scoped.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="权限分配"
      :visible.sync="rightsDialogVisible"
      width="40%"
      @close="defKeys = []"
    >
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //全部角色列表
      rolesList: [],
      //全部权限列表
      rightsList: [],
      //分配权限对话框
      rightsDialogVisible: false,
      treeProps: {
        children: "children",
        label: "authName",
      },
      ////设置树形控件中默认选中的内容
      defKeys: [],
      //保存正在操作的角色id
      roleId: "",
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    getRolesList() {
      this.$axios.get("/roles").then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error("获取角色列表失败！");
        this.rolesList = res.data.data;
      });
    },
    removeRolesRights(role, rightId) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios
            .delete(`roles/${role.id}/rights/${rightId}`)
            .then((res) => {
              if (res.data.meta.status !== 200)
                return this.$message.error("删除权限失败！");
              role.children = res.data.data;
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
    showrightsDialog(role) {
      //将role.id保存起来以供保存权限时使用
      this.roleId = role.id;
      this.$axios.get("rights/tree").then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error("获取权限失败！");
        this.rightsList = res.data.data;
        this.rightsDialogVisible = true;
      });
      this.getLeafKeys(role, this.defKeys);
    },
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr));
    },
    allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");
      this.$axios
        .post(`roles/${this.roleId}/rights`, { rids: idStr })
        .then((res) => {
          console.log(res);
          if (res.data.meta.status !== 200)
            return this.$message.error("更新权限失败！");
          this.$message.success("更新权限成功！");
          this.getRolesList();
          this.rightsDialogVisible = false;
        });
    },
  },
};
</script>

<style lang="less" scoped>
.myButton {
  margin-bottom: 10px;
}
.bdbottom {
  border-bottom: 1px solid #999;
}
.bdtop {
  border-top: 1px solid #999;
}
.el-tag {
  margin: 5px;
  cursor: pointer;
}
.vCenter {
  display: flex;
  align-items: center;
}
</style>
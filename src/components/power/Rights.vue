<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" class="myBreadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="myCard">
      <template>
        <el-table :data="rightsData" style="width: 100%" border :stripe="true">
          <el-table-column type="index" label="#" width="50"> </el-table-column>
          <el-table-column label="权限名称" prop="authName"> </el-table-column>
          <el-table-column label="路径" prop="path"> </el-table-column>
          <el-table-column label="权限等级">
            <template slot-scope="scoped">
              <el-tag type="success" v-if="scoped.row.level === '0'"
                >一级</el-tag
              >
              <el-tag type="info" v-else-if="scoped.row.level === '1'"
                >二级</el-tag
              >
              <el-tag type="warning" v-else-if="scoped.row.level === '2'"
                >三级</el-tag
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsData: [],
    };
  },
  created() {
    this.getRightsData();
  },
  methods: {
    getRightsData() {
      this.$axios.get(`rights/list`).then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error("获取权限数据失败！");
        this.rightsData = res.data.data;
      });
    },
  },
};
</script>

<style>
</style>
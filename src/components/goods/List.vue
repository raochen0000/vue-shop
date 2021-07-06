<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" class="myBreadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="myCard">
      <!-- 搜索和添加 -->
      <el-row>
        <el-input
          placeholder="请输入内容"
          class="searchIpt"
          clearable
          v-model="queryInfo.query"
          @clear="getGoodsList"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getGoodsList"
          ></el-button>
        </el-input>
        <el-button type="primary" class="searchBtn" @click="goAddPage"
          >添加商品</el-button
        >
      </el-row>
      <!-- 商品列表数据表格 -->
      <el-table class="myTable" border stripe :data="goodsListArr">
        <el-table-column type="index" label="#" width="40"> </el-table-column>
        <el-table-column label="商品名称" prop="goods_name"> </el-table-column>
        <el-table-column label="商品价格（元）" width="120" prop="goods_price">
        </el-table-column>
        <el-table-column label="商品重量" width="100" prop="goods_weight">
        </el-table-column>
        <el-table-column label="创建时间" width="160" prop="add_time">
          <template slot-scope="scoped">
            {{ scoped.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template slot-scope="scoped">
            <el-button type="primary" icon="el-icon-edit" size="small"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="deleteGoods(scoped.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页模块 -->
      <el-pagination
        class="myPagination"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[6, 12, 18, 24]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalGoods"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //商品数据列表
      goodsListArr: [],
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 6,
      },
      totalGoods: 0,
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    getGoodsList() {
      this.$axios.get("goods", { params: this.queryInfo }).then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error("获取商品列表数据失败！");
        this.goodsListArr = res.data.data.goods;
        this.totalGoods = res.data.data.total;
      });
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val;
      this.getGoodsList();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val;
      this.getGoodsList();
    },
    deleteGoods(row) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios.delete(`goods/${row.goods_id}`).then((res) => {
            if (res.data.meta.status !== 200)
              return this.$message.error("删除该商品失败！");
            this.getGoodsList();
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
    goAddPage() {
      this.$router.push("goods/add");
    },
  },
};
</script>

<style scoped lang='less'>
.searchIpt {
  width: 340px;
  margin-right: 10px;
}
.searchBtn {
  width: 90px;
}
</style>

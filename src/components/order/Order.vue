<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" class="myBreadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">订单管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="myCard">
      <!-- 搜索框 -->
      <el-row>
        <el-input placeholder="请输入内容" class="searchIpt" clearable>
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-row>
      <!-- 商品列表数据表格 -->
      <el-table class="myTable" border stripe :data="ordersListArr">
        <el-table-column type="index" label="#" width="40"> </el-table-column>
        <el-table-column label="订单编号" prop="order_number">
        </el-table-column>
        <el-table-column label="订单价格" width="80" prop="order_price">
        </el-table-column>
        <el-table-column label="是否付款" width="100">
          <template slot-scope="scoped">
            <el-tag type="success" v-if="scoped.row.order_pay !== '0'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" width="80" prop="is_send">
        </el-table-column>
        <el-table-column label="下单时间" width="180" prop="create_time">
          <template slot-scope="scoped">{{
            scoped.row.create_time | dateFormat
          }}</template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="adressDialogVisible = true"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location-information"
              size="small"
              @click="showExpressInfo"
            ></el-button>
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
        :total="totalOrders"
      >
      </el-pagination>
    </el-card>
    <!-- 地址选择对话框 -->
    <el-dialog
      title="地址t填写"
      :visible.sync="adressDialogVisible"
      width="40%"
      @close="clearForm"
    >
      <el-form
        :model="adressForm"
        :rules="adressFormRules"
        ref="adressFormRef"
        label-width="100px"
      >
        <el-form-item label="省/市/区/县" prop="cityName">
          <el-cascader
            class="myCascader"
            v-model="adressForm.cityName"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="streetName">
          <el-input v-model="adressForm.streetName" clearable=""></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adressDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 物流信息对话框 -->
    <el-dialog title="物流信息" :visible.sync="expressInfoDialog" width="40%">
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in expressInfoArr"
          :key="index"
          :timestamp="item.time"
        >
          {{ item.context }}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="expressInfoDialog = false">取 消</el-button>
        <el-button type="primary" @click="expressInfoDialog = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cityData from "./citydata";
export default {
  data() {
    return {
      //订单数据列表
      ordersListArr: [],
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 6,
      },
      totalOrders: 0,
      adressDialogVisible: false,
      //地址表单
      adressForm: {
        cityName: [],
        streetName: "",
      },
      //地址验证规则
      adressFormRules: {
        cityName: [
          { required: true, message: "省市区地址必须填写", trigger: "blur" },
        ],
        streetName: [
          { required: true, message: "详细地址必须填写", trigger: "blur" },
        ],
      },
      cityData,
      expressInfoDialog: false,
      //物流信息
      expressInfoArr: [],
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    getOrderList() {
      this.$axios.get("orders", { params: this.queryInfo }).then((res) => {
        // console.log(res);
        if (res.data.meta.status !== 200)
          return this.$message.error("获取订单数据失败！");
        this.ordersListArr = res.data.data.goods;
        // console.log(this.ordersListArr);
        this.totalOrders = res.data.data.total;
      });
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getOrderList();
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getOrderList();
    },
    clearForm() {
      this.$refs.adressFormRef.resetFields();
    },
    showExpressInfo() {
      this.$axios.get("/kuaidi/1106975712662").then((res) => {
        console.log(res);
        this.expressInfoArr = res.data;
      });
      this.expressInfoDialog = true;
    },
  },
};
</script>

<style scoped lang='less'>
.searchIpt {
  width: 340px;
  margin-right: 10px;
}
</style>

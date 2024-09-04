<template>
  <div class="container">
    <div class="content">
      <div class="left_content">
        <el-input
          placeholder="请输入关键字进行查询"
          v-model="searchDept"
        ></el-input>
        <el-tree
          :props="defaultProps"
          :data="branch"
          lazy
          :load="loadDepartment"
          ref="tree"
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
        >
        </el-tree>
      </div>
      <div class="right_content">
        <div class="search-shop">
          <label>登录账号：</label>
          <el-input
            placeholder="登录账号"
            v-model="searchAccount"
          ></el-input>
          <label>用户姓名：</label>
          <el-input
            placeholder='用户姓名'
            v-model="searchRealName"
          ></el-input>
          <div class="button-shop">
            <el-button
              class="el-icon-search"
              @click="userSearch"
              type="primary"
            >搜索</el-button>
            <el-button
              class="el-icon-delete"
              @click="clearSearch"
            >清空</el-button>
          </div>

        </div>
        <div class="toolbar">
          <el-button
            class="el-icon-plus"
            type="primary"
            @click="addUser"
          >新增</el-button>
          <el-button
            class="el-icon-delete"
            type="danger"
            plain
            @click="deleteUser"
          >删除</el-button>
          <el-button
            class="el-icon-user"
            type="info"
            plain
            @click="showConfigDialog"
          >角色配置</el-button>
          <el-button
            class="el-icon-refresh"
            @click="resetPassword"
          >密码重置</el-button>
          <el-button
            class="el-icon-upload2"
            type="success"
            plain
            @click="uploadVisible=true"
          >导入</el-button>
          <el-button
            class="el-icon-download"
            type="warning"
            plain
            @click="download"
          >导出</el-button>
        </div>
        <div class="form_info">
          <el-table
            :data="userForm"
            border
            height="24rem"
            ref="multipleTable"
            style="width: 40rem;"
            :header-cell-style="{ 'text-align': 'center' }"
            @selection-change="fetchSelectedIds"
          >
            <el-table-column
              type="selection"
              fixed
            ></el-table-column>
            <el-table-column
              label="#"
              type="index"
              fixed
            ></el-table-column>
            <el-table-column
              label="登录账号"
              prop="account"
              width="110"
            ></el-table-column>
            <el-table-column
              label="所属租号"
              prop="tenantName"
              width="120"
            >
              <template slot-scope="scope">
                <el-tag>{{ scope.row.tenantName }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="用户姓名"
              prop="realName"
              width="100"
            ></el-table-column>
            <el-table-column
              label="所属角色"
              prop="roleName"
              width="150"
            >
              <template slot-scope="scope">
                <el-tag>{{ scope.row.roleName }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="所属部门"
              prop="deptName"
              width="120"
            >
              <template slot-scope="scope">
                <el-tag>{{ scope.row.deptName }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="260"
              fixed="right"
            >
              <template slot-scope="slot">
                <el-button
                  type="text"
                  class="el-icon-view"
                  @click="view(slot.row.id)"
                >查看</el-button>
                <el-button
                  type="text"
                  class="el-icon-edit"
                  @click="edit(slot.row.id)"
                >编辑</el-button>
                <el-button
                  type="text"
                  class="el-icon-delete"
                  @click="deleteItem(slot.row.id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="page-shop">
          <el-pagination
            background
            layout="total,sizes,prev,pager,next,jumper"
            :page-sizes="[10, 20, 30, 40, 50, 100]"
            :page-size="10"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </div>

    </div>
    <div class="el-dialog-wrapper">
      <el-dialog
        title="查看"
        :visible.sync="viewVisible"
      >
        <el-collapse v-model="activeNames">

          <el-collapse-item name="基础信息">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span class="title">基础信息</span>
            </template>
            <div class="dialog-content">
              <div
                v-for="(value, key) in userInfo.basicInfo"
                :key="key"
                class="dialog-item"
              >{{ key }}:{{ value }}</div>
            </div>
          </el-collapse-item>

          <el-collapse-item name="详细信息">
            <template slot="title">
              <i class="el-icon-s-order"></i>
              <span class="title">详细信息</span>
            </template>
            <div class="dialog-content">
              <div
                v-for="(value, key) in userInfo.retails"
                :key="key"
                class="dialog-item"
              >{{ key }}:{{ value }}</div>
            </div>
          </el-collapse-item>

          <el-collapse-item name="职责信息">
            <template slot="title">
              <i class="el-icon-s-custom"></i>
              <span class="title">职责信息</span>
            </template>
            <div class="dialog-content">
              <div
                v-for="(value, key) in userInfo.dutyInfo"
                :key="key"
                class="dialog-item"
              >{{ key }}:{{ value }}</div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-dialog>

      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
      >
        <el-collapse v-model="activeNames">

          <el-collapse-item name="基础信息">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span class="title">基础信息</span>
            </template>
            <div class="dialog-content">
              <div
                v-for="(value, key,index) in userInfo.basicInfo"
                :key="key"
                class="dialog-item"
              >
                <label :class="{required:isRequired(key)}">{{ key }}:</label>
                <template v-if="index===1">
                  <el-select
                    clearable
                    filterable
                    :placeholder="'请输入'+key"
                    v-model="temp.basicInfo[key]"
                    :class="{'input-error':errors[key]}"
                    @change="(selected)=>handleInfoChange(selected,key,'basicInfo')"
                  >
                    <el-option
                      :label="tree[key]"
                      :value="tree[key]"
                      :key="tree[key]"
                    ></el-option>
                  </el-select>
                </template>
                <template v-else>
                  <el-input
                    v-model="userInfo.basicInfo[key]"
                    :class="{'input-error':errors[key]}"
                    :placeholder="'请输入'+key"
                    clearable
                  ></el-input>
                </template>

                <div
                  v-if="errors[key]"
                  class="error"
                >{{errors[key]}}</div>
              </div>
            </div>
          </el-collapse-item>

          <el-collapse-item name="详细信息">
            <template slot="title">
              <i class="el-icon-s-order"></i>
              <span class="title">详细信息</span>
            </template>
            <div class="dialog-content">
              <div
                v-for="(value, key,index) in userInfo.retails"
                :key="key"
                class="dialog-item"
              >
                <label :class="{required:isRequired(key)}">{{ key }}:</label>
                <template v-if="index<4">
                  <el-input
                    v-model="userInfo.retails[key]"
                    :class="{'input-error':errors[key]}"
                    :placeholder="'请输入'+key"
                    clearable
                  ></el-input>
                </template>
                <template v-else-if="index==4">
                  <el-select
                    clearable
                    filterable
                    :class="{'input-error':errors[key]}"
                    v-model="userInfo.retails[key]"
                    :placeholder="'请输入'+key"
                  >
                    <el-option
                      v-for="item in ['男','女','未知']"
                      :key="item"
                      :value="item"
                      :label="item"
                    ></el-option>
                  </el-select>
                </template>
                <template v-else>
                  <el-date-picker
                    type="date"
                    v-model="userInfo.retails[key]"
                    :placeholder="'请输入'+key"
                  ></el-date-picker>
                </template>

                <div
                  v-if="errors[key]"
                  class="error"
                >{{errors[key]}}</div>
              </div>
            </div>
          </el-collapse-item>

          <el-collapse-item name="职责信息">
            <template slot="title">
              <i class="el-icon-s-custom"></i>
              <span class="title">职责信息</span>
            </template>
            <div class="dialog-content">
              <div
                v-for="(value, key,index) in userInfo.dutyInfo"
                :key="key"
                class="dialog-item"
              >
                <label :class="{required:isRequired(key)}">{{ key }}:</label>
                <template v-if="index==0">
                  <el-input
                    v-model="userInfo.dutyInfo[key]"
                    clearable
                    :placeholder="'请输入'+key"
                  ></el-input>
                </template>
                <template v-else-if="index==2">
                  <el-select
                    v-model="temp.dutyInfo[key]"
                    :placeholder="'请输入'+key"
                    multiple
                    filterable
                    @remove-tag="handleRemoveTag"
                    :class="{'input-error':errors[key]}"
                  >
                    <el-option
                      :key="temp.dutyInfo[key]"
                      :label="temp.dutyInfo[key]"
                      :value="temp.dutyInfo[key]"
                      style="height:auto"
                      hidden
                    />
                    <el-tree
                      ref="deptTree"
                      :data="tree[key]"
                      :props="treeSelect"
                      :default-checked-keys="defaultDeptId"
                      node-key="id"
                      show-checkbox
                      check-strictly
                      @check-change="handleCheckNodes"
                    />
                  </el-select>
                </template>

                <template v-else>
                  <el-select
                    v-model="temp.dutyInfo[key]"
                    :placeholder="'请输入'+key"
                    multiple
                    clearable
                    filterable
                    :class="{'input-error':errors[key]}"
                    @change="(selected)=>handleInfoChange(selected,key,'dutyInfo')"
                  >
                    <el-option
                      v-for="item in tree[key]"
                      :key="item.id"
                      :label="item.title"
                      :value="item.title"
                    ></el-option>
                  </el-select>
                </template>
                <div
                  v-if="errors[key]"
                  class="error"
                >{{errors[key]}}</div>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
        <div slot="footer">
          <el-button
            class="el-icon-circle-check"
            type="primary"
            @click="dialogAction"
          >{{dialogText}}</el-button>
          <el-button
            class="el-icon-circle-close"
            @click="dialogVisible=false"
          >取消</el-button>
        </div>

      </el-dialog>

      <el-dialog
        title="用户数据导入"
        :visible.sync="uploadVisible"
      >
        <div class="upload-shop upload-wrapper">
          <span>模板上传：</span>
          <el-upload
            :action="uploadURL"
            :headers="headers"
            accept=".xls,.xlsx"
            drag
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload-text">将文件拖到此处，或<em>点击上传</em></div>
            <div
              class="el-upload-tip"
              slot="tip"
            >请上传.xls .xlsx标准格式文件</div>
          </el-upload>
        </div>
        <div class="upload-wrapper">
          <span>数据覆盖：</span>
          <el-switch
            active-text="是"
            inactive-text="否"
            active-value='1'
            inactive-value='0'
            v-model="isCover"
          ></el-switch>
        </div>
        <div class="upload-wrapper">
          <span>模板下载：</span>
          <el-button
            type="primary"
            @click="templateDownload"
          >点击下载<i class="el-icon-download"></i></el-button>
        </div>
      </el-dialog>

      <el-dialog
        title="用户角色配置"
        :visible.sync="roleFonfigVisible"
        width="20rem"
      >
        <el-checkbox-group v-model="checkList">
          <el-checkbox
            v-for="item in checkbox"
            :key="item.id"
            :label="item.id"
          >{{ item.title }}</el-checkbox>
        </el-checkbox-group>
        <span slot="footer">
          <el-button @click="roleFonfigVisible=false">取消</el-button>
          <el-button
            type="primary"
            @click="roleFonfig"
          >确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>

</template>
<script>
import { fileDownload } from "@/util/handleExcel";
import formateDate from "@/util/formateDate";
export default {
  name: "user",
  data() {
    return {
      searchDept: "",
      searchAccount: "",
      searchRealName: "",
      queryString: {},
      branch: [],
      defaultProps: {
        label: "title",
        isLeaf: "isLeaf",
        children: "children",
      },
      treeSelect: {
        id: "id",
        label: "title",
        children: "children",
      },
      userForm: [], //用户表
      userInfo: {
        id: "",
        basicInfo: {},
        retails: {},
        dutyInfo: {},
      }, //所查看用户的信息
      temp: {
        basicInfo: {
          所属租户: [],
        },
        dutyInfo: {
          所属角色: [],
          所属部门: [],
          所属岗位: [],
        },
      }, //暂存 多选类型
      defaultDeptId: [],
      current: 1,
      size: 10,
      deptId: "",
      dialogTitle: "", //编辑or新增标题
      dialogVisible: false, //编辑or新增对话框
      dialogText: "", //修改or保存 按钮
      idEdit: false,
      viewVisible: false, //查看对话框
      activeNames: ["基础信息", "详细信息", "职责信息"],
      uploadVisible: false, //上传对话框,
      roleFonfigVisible: false, //角色配置对话框
      checkList: [], //选中的角色
      checkbox: [],
      tree: {
        tenantName: "",
        所属角色: {},
        所属部门: {},
        所属岗位: {},
      },
      total: 0,
      errors: {},
      requiredFields: [
        "登录账号",
        "所属租户",
        "用户昵称",
        "用户姓名",
        "所属角色",
        "所属部门",
        "所属岗位",
        "密码",
        "确认密码",
        "手机号码",
      ], //必填项
      selectedIds: [], //表格中被选中用户id
      isCover: 0,
      headers: {
        "Blade-Auth": `bearer ${this.$store.state.token}`, // 授权头
      },
    };
  },
  watch: {
    searchDept(newVal) {
      this.$refs.tree.filter(newVal);
    },
  },
  computed: {
    uploadURL() {
      return `/api/blade-user/import-user?isCovered=${this.isCover}`;
    },
  },
  created() {
    this.creatBranch();
    this.setDefaultQuery();
    this.loadForm();
  },
  methods: {
    creatBranch() {
      //分支
      this.$axios
        .get("/api/blade-system/dept/lazy-tree?parentId=0", {
          headers: this.headers,
        })
        .then((res) => {
          this.branch = res.data.data.map((item) => ({
            title: item.title,
            id: item.id, //deptID
            isLeaf: !item.hasChildren,
            children: [],
          }));
          console.log(this.branch);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    loadDepartment(node, resolve) {
      //各分支下的部门
      const url = `/api/blade-system/dept/lazy-tree?parentId=${node.data.id}`;

      this.$axios
        .get(url, {
          headers: this.headers,
        })
        .then((res) => {
          const children = res.data.data.map((item) => ({
            id: item.id,
            isLeaf: !item.hasChildren,
            title: item.title,
            children: [],
          }));
          node.data.children = children;
          resolve(children);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    loadForm() {
      //表格
      console.log("1", this.current, this.total);
      if (
        this.total - (this.current - 1) * this.size == 0 &&
        this.total !== 0
      ) {
        console.log("1", this.total, this.current, this.size);
        this.current -= 1;
        this.setDefaultQuery();
      }
      console.log("3", this.total, this.current, this.size);
      this.$axios
        .get(`/api/blade-user/page?${this.queryString}`, {
          headers: this.headers,
        })
        .then((res) => {
          this.userForm = res.data.data.records.map((item) => ({
            id: item.id,
            account: item.account, //登录账号
            tenantName: item.tenantName, //所属租户
            realName: item.realName, //用户姓名
            roleName: item.roleName, //所属角色
            deptName: item.deptName, //所属部门
          }));
          this.total = res.data.data.total;
          console.log(this.total);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //指定部门用户
    handleNodeClick(data) {
      this.deptId = data.id;
      this.queryString.set("deptId", this.deptId);
      this.loadForm();
    },
    setDefaultQuery() {
      this.queryString = new URLSearchParams({
        current: this.current,
        size: this.size,
        deptId: this.deptId,
      });
    },
    //搜索
    userSearch() {
      this.current=1;
      this.setDefaultQuery();
      if (this.searchAccount) {
        this.queryString.append("account", this.searchAccount);
      }
      if (this.searchRealName) {
        this.queryString.append("realName", this.searchRealName);
      }
      this.loadForm();
    },
    //清空搜索
    clearSearch() {
      this.searchAccount = "";
      this.searchRealName = "";
      this.deptId = "";
      this.setDefaultQuery();
      this.loadForm();
    },
    //节点显隐
    filterNode(val, nodeData) {
      if (!val) return true;
      return nodeData.title.indexOf(val) !== -1;
    },
    //获取用户详细信息
    async fetchUserInfo(id) {
      try {
        const response = await this.$axios.get(
          `/api/blade-user/detail?id=${id}`,
          {
            headers: this.headers,
          }
        );
        const user = response.data.data;
        this.$set(this.userInfo, "id", user.id);
        this.$set(this.userInfo, "basicInfo", {
          登录账号: user.account,
          所属租户: user.tenantName,
        });
        this.$set(this.userInfo, "retails", {
          用户昵称: user.name,
          用户姓名: user.realName,
          手机号码: user.phone,
          电子邮箱: user.email,
          用户性别: user.sexName,
          用户生日: user.birthday,
        });
        this.$set(this.userInfo, "dutyInfo", {
          用户编号: "",
          所属角色: user.roleName,
          所属部门: user.deptName,
          所属岗位: user.postName,
        });
      } catch (error) {
        console.log(error);
      }
    },
    //初始化用户详细信息
    defaultUserInfo() {
      this.userInfo.basicInfo = {
        登录账号: "",
        所属租户: "",
      };
      this.userInfo.retails = {
        用户昵称: "",
        用户姓名: "",
        手机号码: "",
        电子邮箱: "",
        用户性别: "",
        用户生日: "",
      };
      this.userInfo.dutyInfo = {
        用户编号: "",
        所属角色: "",
        所属部门: "",
        所属岗位: "",
      };
    },

    //查看
    view(id) {
      this.viewVisible = true;
      this.fetchUserInfo(id);
    },
    async getTenantName() {
      try {
        const res = await this.$axios.get("/api/blade-system/tenant/select", {
          headers: this.headers,
        });
        this.tree["所属租户"] = res.data.data[0].tenantName;
      } catch (err) {
        console.log(err);
      }
    },
    async getRoleTree() {
      //所属角色列表
      try {
        const res = await this.$axios.get("/api/blade-system/role/tree", {
          headers: this.headers,
        });
        this.tree["所属角色"] = res.data.data.map((item) => ({
          id: item.id,
          title: item.title,
        }));
      } catch (err) {
        console.log(err);
      }
    },
    async getDeptTree() {
      //所属部门列表
      try {
        const res = await this.$axios.get("/api/blade-system/dept/tree", {
          headers: this.headers,
        });
        const processTree = (nodes) => {
          return nodes.map((node) => ({
            id: node.id,
            title: node.title,
            children: node.children ? processTree(node.children) : [],
          }));
        };
        this.tree["所属部门"] = processTree(res.data.data);
      } catch (err) {
        console.log(err);
      }
    },
    async getPostSelect() {
      //所属岗位列表
      try {
        const res = await this.$axios.get("/api/blade-system/post/select", {
          headers: this.headers,
        });
        this.tree["所属岗位"] = res.data.data.map((item) => ({
          id: item.id,
          title: item.postName,
        }));
      } catch (err) {
        console.log(err);
      }
    },
    handleInfoChange(selected, key2, key1) {
      this.$set(this.userInfo[key1], key2, selected.toString());
      // this.$set(this.temp[key1],key2,selected.toString())
    },
    handleCheckNodes(data, checked) {
      //每当节点选中状态发生变化都会调用(当前节点，当前节点是否被选中)
      console.log(checked);
      if (checked) {
        if (!this.temp.dutyInfo["所属部门"].includes(data.title)) {
          this.temp.dutyInfo["所属部门"].push(data.title);
        }
      } else {
        const index = this.temp.dutyInfo["所属部门"].indexOf(data.title);
        if (index > -1) {
          this.temp.dutyInfo["所属部门"].splice(index, 1);
        }
        console.log(this.temp.dutyInfo["所属部门"]);
      }
      this.userInfo.dutyInfo["所属部门"] =
        this.temp.dutyInfo["所属部门"].toString();
    },
    setTempInfo() {
      this.$set(
        this.temp.basicInfo,
        "所属租户",
        this.userInfo.basicInfo["所属租户"]
      );
      this.$set(
        this.temp.dutyInfo,
        "所属角色",
        this.userInfo.dutyInfo["所属角色"].split(",")
      );
      this.$set(
        this.temp.dutyInfo,
        "所属岗位",
        this.userInfo.dutyInfo["所属岗位"].split(",")
      );
      this.$set(
        this.temp.dutyInfo,
        "所属部门",
        this.userInfo.dutyInfo["所属部门"].split(",")
      );
    },
    defaultTempInfo() {
      this.temp.basicInfo["所属租户"] = [];
      this.temp.dutyInfo["所属角色"] = [];
      this.temp.dutyInfo["所属部门"] = [];
      this.temp.dutyInfo["所属岗位"] = [];
    },
    handleRemoveTag(tag) {
      const node = this.tree["所属部门"].find((item) => item.title === tag);
      if (node) {
        const deptTree = this.$refs.deptTree[0]; // 从数组中取出第一个元素
        if (deptTree && typeof deptTree.setChecked === "function") {
          deptTree.setChecked(node.id, false);
        } else {
          console.error("setChecked method not found on deptTree");
        }
      }
    },
    //编辑
    async edit(id) {
      this.errors = {};
      await this.getTenantName();
      await this.getRoleTree();
      await this.getDeptTree();
      await this.getPostSelect();
      await this.fetchUserInfo(id);
      this.setTempInfo();

      const defaultDept = this.tree["所属部门"].filter((item) => {
        return this.userInfo.dutyInfo["所属部门"]
          .split(",")
          .includes(item.title);
      });
      this.defaultDeptId = defaultDept.map((item) => item.id);

      this.dialogText = "修改";
      this.isEdit = true;
      this.dialogVisible = true;
      this.dialogTitle = "编辑";
    },
    //提交更新
    update() {
      this.validateInput();
      if (Object.keys(this.errors).length === 0) {
        this.dialogVisible = false;
        const payload = this.reqPayload();
        this.$axios
          .post("/api/blade-user/update", payload, {
            headers: this.headers,
          })
          .then((res) => {
            this.$message.success("更新成功");
            this.loadForm();
            console.log(res);
          })
          .catch((err) => {
            this.$message.error("更新失败");
            console.log(err);
          });
        this.defaultDeptId = "";
      }
    },
    //必填项
    isRequired(key) {
      return this.requiredFields.includes(key);
    },
    validateInput() {
      for (const [category, details] of Object.entries(this.userInfo)) {
        for (const [key, value] of Object.entries(details)) {
          if (this.isRequired(key) && !value) {
            this.$set(this.errors, key, `请输入${key}`);
          } else {
            this.$delete(this.errors, key);
          }
        }
      }
    },
    //删除（个人）
    deleteItem(id) {
      this.$confirm("确定将选择数据删除？", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios
            .post(
              `/api/blade-user/remove?ids=${id}`,
              {},
              {
                headers: this.headers,
              }
            )
            .then((res) => {
              console.log(res);
              this.$message({
                type: "success",
                message: "删除成功",
              });
              this.total -= 1;
              this.loadForm();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //分页（切换尺寸）
    handleSizeChange(val) {
      console.log(val); //当前尺寸
      this.size = val;
      this.setDefaultQuery();
      this.loadForm();
    },
    //分页（切换页面）
    handleCurrentChange(val) {
      console.log(val); //当前页
      this.current = val;
      this.setDefaultQuery();
      this.loadForm();
    },

    reqPayload() {
      const role = this.tree["所属角色"].filter((item) => {
        return this.userInfo.dutyInfo["所属角色"]
          .split(",")
          .includes(item.title);
      });
      const roleId = role.map((item) => item.id).toString();
      const dept = this.tree["所属部门"].filter((item) => {
        return this.userInfo.dutyInfo["所属部门"]
          .split(",")
          .includes(item.title);
      });
      const deptId = dept.map((item) => item.id).toString();
      const post = this.tree["所属岗位"].filter((item) => {
        return this.userInfo.dutyInfo["所属岗位"]
          .split(",")
          .includes(item.title);
      });
      const postId = post.map((item) => item.id).toString();
      const sexName = this.userInfo.retails["用户性别"];
      let sex = sexName === "男" ? 1 : sexName === "女" ? 2 : 3;
      const birthday = formateDate(this.userInfo.retails["用户生日"]);
      return {
        account: this.userInfo.basicInfo["登录账号"],
        tenantId: "000000",
        name: this.userInfo.retails["用户昵称"],
        realName: this.userInfo.retails["用户姓名"],
        phone: this.userInfo.retails["手机号码"],
        email: this.userInfo.retails["电子邮箱"],
        sex,
        birthday,
        roleId,
        deptId,
        postId,
        id: this.userInfo.id,
      };
    },
    dialogAction() {
      if (this.isEdit) this.update();
      else this.submit();
    },

    //新增
    async addUser() {
      this.errors = {};
      this.defaultUserInfo();
      this.defaultTempInfo();
      this.$set(this.userInfo.basicInfo, "密码", "");
      this.$set(this.userInfo.basicInfo, "确认密码", "");
      await this.getTenantName();
      await this.getRoleTree();
      await this.getDeptTree();
      await this.getPostSelect();

      this.isEdit = false;
      this.dialogText = "保存";
      this.dialogTitle = "新增";
      this.dialogVisible = true;
    },
    //提交新增用户
    submit() {
      this.validateInput();
      if (
        this.userInfo.basicInfo["密码"] !==
          this.userInfo.basicInfo["确认密码"] &&
        !this.errors["确认密码"]
      ) {
        this.$set(this.errors, "确认密码", "两次密码输入不一致");
      }
      if (Object.keys(this.errors).length === 0) {
        this.dialogVisible = false;
        let payload = this.reqPayload();
        const password = this.userInfo.basicInfo["密码"];
        this.$set(payload, "password", password);
        delete payload.id;
        this.$axios
          .post("/api/blade-user/submit", payload, {
            headers: this.headers,
          })
          .then((res) => {
            this.$message.success("新增成功");
            this.loadForm();
            console.log(res);
            delete this.userInfo.basicInfo["密码"];
            delete delete this.userInfo.basicInfo["确认密码"];
          })
          .catch((err) => {
            this.$message.error(err.response.data.msg);
          });
      }
    },
    //获取所有用户id
    /*
    async fetchAllId() {
      try {
        const response = await this.$axios.get(
          "/api/blade-user/page?current=1&size=100&deptId=",
          {
            headers: this.headers,
          }
        );
        this.allIds = response.data.data.records.map((item) => item.id);
      } catch (error) {
        console.log(error);
      }
    },
    */
    //导出所有用户
    download() {
      /*
      let Info = [];
      await this.fetchAllId();
      //获取数据
      while (this.allIds.length > 0) {
        await this.fetchUserInfo(this.allIds.pop());
        Info.push({
          ...this.userInfo.basicInfo,
          ...this.userInfo.retails,
          ...this.userInfo.dutyInfo,
        });
      }
      fileDownload(Info, "用户信息");
      */
      this.$axios
        .get("/api/blade-user/export-user?account=&realName=", {
          headers: this.headers,
          responseType: "blob",
        })
        .then((res) => {
          const url = window.URL.createObjectURL(res.data);
          fileDownload(url, "用户信息.xlsx");
        })
        .catch((err) => {
          console.log("文件下载错误：", err);
        });
    },
    //下载模板
    templateDownload() {
      this.$axios
        .get("/api/blade-user/export-template", {
          headers: this.headers,
          responseType: "blob",
        })
        .then((res) => {
          const url = window.URL.createObjectURL(res.data);
          fileDownload(url, "模板.xlsx");
        })
        .catch((err) => {
          console.log("模板下载错误：", err);
        });
    },
    //获取当前被选中用户id
    fetchSelectedIds(selection) {
      this.selectedIds = [];
      selection.forEach((item) => {
        this.selectedIds.push(item.id);
      });
      console.log(this.selectedIds);
    },
    //删除or重置密码or角色配置
    manageUser(url, params, isLoad) {
      this.$axios
        .post(url, params, {
          headers: this.headers,
        })
        .then((res) => {
          console.log(res);
          if (isLoad) {
            if (url === "/api/blade-user/remove") {
              this.total -= 1;
            }
            this.loadForm();
          }
          this.$message.success("操作成功！");
        })
        .catch((err) => {
          this.message.error("操作失败！");
          console.log(err);
        });
    },
    deleteUser() {
      const ids = this.selectedIds.toString();
      if (ids) {
        this.$confirm("确定将选择数据删除？", "", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            const params = `ids=${ids}`;
            const url = "/api/blade-user/remove";
            this.manageUser(url, params, 1);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
      } else {
        this.$message.warning("请选择至少一条数据");
      }
    },
    resetPassword() {
      const userIds = this.selectedIds.toString();
      if (userIds) {
        this.$confirm("是否将所选用户密码重置为123456？", "", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            const params = `userIds=${userIds}`;
            const url = "/api/blade-user/reset-password";
            this.manageUser(url, params, 0);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
      } else {
        this.$message.warning("请选择至少一条数据");
      }
    },
    showConfigDialog() {
      if (this.selectedIds.toString()) {
        this.roleFonfigVisible = true;
        this.$axios
          .get("/api/blade-system/role/tree", { headers: this.headers })
          .then((res) => {
            this.checkbox = res.data.data.map((item) => ({
              id: item.id,
              title: item.title,
            }));
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.$message.warning("请选择至少一条数据");
      }
    },
    roleFonfig() {
      this.roleFonfigVisible = false;
      const userIds = this.selectedIds.toString();
      const roleIds = this.checkList.toString();
      const url = "/api/blade-user/grant";
      const params = `userIds=${userIds}&roleIds=${roleIds}`;
      this.manageUser(url, params, 1);
      this.checkList = [];
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-table th {
  background-color: rgb(248, 246, 246);
}

::v-deep .el-table thead {
  color: black;
}

::v-deep .el-table td {
  text-align: center;
  padding: 0.3rem 0;
}

.container {
  height: 100%;

  .content {
    height: 100%;
    padding: 0 1rem;
    display: flex;

    .left_content {
      flex: 1;
      background-color: white;
      margin-right: 1rem;
      height: max-content;
      padding-bottom: 1rem;
      border-radius: 0.4rem;

      .el-input {
        padding: 1rem;
        width: 10rem;
      }
    }

    .right_content {
      flex: 5;
      background-color: white;
      border-radius: 0.4rem;
      height: 100%;
      display: flex;
      flex-direction: column;

      .search-shop {
        display: flex;
        padding: 0.6rem;
        padding-left: 2rem;
        font-size: 0.8rem;
        margin-bottom: 0;

        label {
          display: flex;
          align-items: center;
          white-space: nowrap;
        }

        .el-input {
          width: auto;
          margin-right: 2rem;
          display: flex;
          align-items: center;
        }

        .button-shop {
          margin-left: auto;
          display: flex;

          .el-button {
            height: 2.5rem;
            display: flex;
            align-items: center;
          }
        }
      }

      .toolbar {
        padding: 0.6rem;
        padding-left: 1.5rem;
      }

      .form_info {
        display: flex;
        justify-content: center;
        padding: 1rem 1.5rem;
      }

      .page-shop {
        display: flex;
        justify-content: right;
      }
    }
  }

  .el-dialog-wrapper {
    span {
      font-size: medium;
      font: bolder;
    }
    .dialog-content {
      display: grid;
      grid-template-columns: repeat((2, 1fr));

      .dialog-item {
        margin: 1rem;

        label {
          position: relative;

          &.required::before {
            content: "*";
            color: red;
            position: absolute;
            left: -1rem; // 调整星号位置
            top: 50%;
            transform: translateY(-50%);
          }
        }

        .error {
          color: red;
          position: absolute;
          margin-top: 0.4rem;
          margin-left: 3.7rem;
          font-size: 0.6rem;
        }

        ::v-deep .input-error .el-input__inner {
          border-color: red !important;
        }

        ::v-deep .input-error .el-select__inner {
          border-color: red !important;
        }

        .el-input {
          width: auto;
          height: 0.6rem;
        }
      }
    }
    .upload-shop {
      display: flex;
    }
    .upload-wrapper {
      margin-bottom: 3rem;
    }
    .el-checkbox-group {
      display: flex;
      flex-direction: column;
      margin-left: 1.4rem;

      .el-checkbox {
        padding: 0.1rem;
      }
    }
  }
}
</style>
<template>
  <div>
    <el-button @click="click">点击</el-button>
    <el-dialog
      title="编辑"
      :visible.sync="editVisible"
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
              <template v-if="index==0">
                <el-input
                  v-model="userInfo.basicInfo[key]"
                  @input="validateInput(key,'basicInfo')"
                  clearable
                ></el-input>
              </template>
              <template v-else>
                <el-select
                  clearable
                  filterable
                  v-model="temp.basicInfo[key]"
                  @change="(selected)=>handleInfoChange(selected,key,'basicInfo')"
                >
                  <el-option
                    :label="tree[key]"
                    :value="tree[key]"
                    :key="tree [key]"
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
                  @input="validateInput(key,'retails')"
                  clearable
                ></el-input>
              </template>
              <template v-else-if="index==4">
                <el-select
                  clearable
                  filterable
                  v-model="userInfo.retails[key]"
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
                  placeholder="请输入用户生日"
                  type="date"
                  v-model="userInfo.retails[key]"
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
                  @input="validateInput(key,'dutyInfo')"
                  clearable
                ></el-input>
              </template>
              <template v-else-if="index==2">
                <el-select
                  v-model="temp.dutyInfo[key]"
                  palceholder="请选择"
                  multiple
                  clearable
                  filterable
                  @change="(selected)=>handleInfoChange(selected,key,'dutyInfo')"
                >
                  <el-option
                    :key="temp.dutyInfo[key]"
                    :label="temp.dutyInfo[key]"
                    :value="temp.dutyInfo[key]"
                    style="height:auto"
                    hidden
                  />
                  <el-tree
                    :data="tree[key]"
                    :props="treeSelect"
                    show-checkbox
                    check-strictly
                    @check-change="handleCheckNodes"
                  />
                </el-select>
              </template>

              <template v-else>
                <el-select
                  v-model="temp.dutyInfo[key]"
                  palceholder="请选择"
                  multiple
                  clearable
                  filterable
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
          @click="update"
        >修改</el-button>
        <el-button
          class="el-icon-circle-close"
          @click="editVisible=false"
        >取消</el-button>
      </div>

    </el-dialog>
  </div>

</template>
<!--
  1.回显字符串
  2.显示的变量有没有能不能把temp去掉
  3.tree赋值(√)
  4.原始显示(√)
  5.编辑  post成功(√)

-->
<script>
import formateDate from '@/util/formateDate'
export default {
  data() {
    return {
      userInfo: {
        basicInfo: {},
        retails: {},
        dutyInfo: {},
      }, //所查看用户的信息
      temp: {
        basicInfo: {
          所属租户: "",
        },
        dutyInfo: {
          所属角色: [],
          所属部门: [],
          所属岗位: [],
        },
      }, //暂存 多选类型
      editVisible: false,
      activeNames: ["基础信息", "详细信息", "职责信息"],
      tree: {
        所属租户: "",
        所属角色: {},
        所属部门: {},
        所属岗位: {},
      },
      treeSelect: {
        label: "title",
        children: "children",
      },
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
      ], //必填项
      headers: {
        "Blade-Auth": `bearer ${this.$store.state.token}`, // 授权头
      },
    };
  },
  methods: {
    async fetchUserInfo(id) {
      try {
        const response = await this.$axios.get(
          `/api/blade-user/detail?id=${id}`,
          {
            headers: this.headers,
          }
        );
        const user = response.data.data;

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
    isRequired(key) {
      return this.requiredFields.includes(key);
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
    }, //改了
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
      console.log(this.userInfo);
      // this.$set(this.temp[key1],key2,selected.toString())
    },
    handleCheckNodes(data, checked) {
      //每当节点选中状态发生变化都会调用(当前节点，当前节点是否被选中)
      if (checked) {
        if (!this.temp.dutyInfo["所属部门"].includes(data.title)) {
          this.temp.dutyInfo["所属部门"].push(data.title);
        }
      } else {
        const index = this.temp.dutyInfo["所属部门"].indexOf(data.title);
        if (index > -1) {
          this.temp.dutyInfo["所属部门"].splice(index, 1);
        }
      }
      console.log(this.temp.dutyInfo["所属部门"]);
    },
    async click() {
      //改了
      const id = "1123598821738675201";
      await this.getTenantName();
      await this.getRoleTree();
      await this.getDeptTree();
      await this.getPostSelect();
      await this.fetchUserInfo(id);

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

      this.editVisible = true;
    },
    loadNewUserInfo() {
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
      console.log(this.userInfo.retails['用户生日'])
      return {
        account: this.userInfo.basicInfo["登录账号"],
        tenantId:'000000',
        tenantName: this.userInfo.basicInfo["所属租户"],
        name: this.userInfo.retails["用户昵称"],
        realName: this.userInfo.retails["用户姓名"],
        phone: this.userInfo.retails["手机号码"],
        email: this.userInfo.retails["电子邮箱"],
        sexName: this.userInfo.retails["用户性别"],
        birthday: this.userInfo.retails["用户生日"],
        roleId,
        roleName: this.userInfo.dutyInfo["所属角色"],
        deptId,
        deptName: this.userInfo.dutyInfo["所属部门"],
        postId,
        postName: this.userInfo.dutyInfo["所属岗位"],
        id: "1123598821738675201",
      };
    },
    update() {
      this.editVisible = false;
      console.log(this.userInfo.retails['用户生日'])
      console.log(formateDate(this.userInfo.retails['用户生日']))
      const payload = this.loadNewUserInfo();
      this.$axios
        .post("/api/blade-user/update", payload, {
          headers: this.headers,
        })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    },
  },
};










// const reqPayload = () => {
//         const role = this.tree["所属角色"].filter((item) => {
//           return this.userInfo.dutyInfo["所属角色"]
//             .split(",")
//             .includes(item.title);
//         });
//         const roleId = role.map((item) => item.id).toString();
//         const dept = this.tree["所属部门"].filter((item) => {
//           return this.userInfo.dutyInfo["所属部门"]
//             .split(",")
//             .includes(item.title);
//         });
//         const deptId = dept.map((item) => item.id).toString();
//         const post = this.tree["所属岗位"].filter((item) => {
//           return this.userInfo.dutyInfo["所属岗位"]
//             .split(",")
//             .includes(item.title);
//         });
//         const postId = post.map((item) => item.id).toString();
//         //const sexName=this.userInfo.retails["用户性别"];
//         const birthday=formateDate(this.userInfo.retails["用户生日"]);

//         return {
//           account: this.userInfo.basicInfo["登录账号"],
//           tenantId: "000000",
//           tenantName: this.userInfo.basicInfo["所属租户"],
//           name: this.userInfo.retails["用户昵称"],
//           realName: this.userInfo.retails["用户姓名"],
//           phone: this.userInfo.retails["手机号码"],
//           email: this.userInfo.retails["电子邮箱"],
//           sexName:this.userInfo.retails["用户性别"],
//           birthday,
//           roleId,
//           roleName: this.userInfo.dutyInfo["所属角色"],
//           deptId,
//           deptName: this.userInfo.dutyInfo["所属部门"],
//           postId,
//           postName: this.userInfo.dutyInfo["所属岗位"],
//           id: this.userInfo.id,
//         };
//       };
</script>

<style lang="scss" scoped>
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
      margin-top: 0.25rem;
      margin-left: 3.5rem;
    }

    .el-input {
      width: 13rem;
      height: 0.6rem;
    }
  }
}
</style>
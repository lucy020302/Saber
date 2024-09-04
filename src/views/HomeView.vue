<template>
  <div class="container-wrap">
    <nav class="sidebar">
      <el-scrollbar class="scrollbar">
        <el-menu
          text-color="white"
          background-color="#2e3139"
          :unique-opened='true'
          @select="gotoContent"
          class="menu"
          :default-active="activeTabName"
          :collapse="iscollapse"
        >
          <el-menu-item index="homeIndex">
            <i v-if="iscollapse">S</i>
            <span slot="title">Saber admin</span>
          </el-menu-item>
          <el-submenu
            v-for="item in menuItems"
            :index="item.index"
            :key="item.index"
          >
            <template slot="title">
              <!--
                                <i class="item.icon"></i>
                            -->

              <span>{{ item.name }}</span>
            </template>
            <el-menu-item
              v-for="childItem in item.children"
              :index="childItem.index"
              :key="childItem.index"
            >
              <template slot="title">
                <!--
                                    <i class="childItem.icon"></i>
                                -->
                <span>{{ childItem.name }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-scrollbar>
    </nav>
    <div class="container">
      <div class="header">
        <div class="header-left">
          <el-button @click="changecollapse"><i class="el-icon-more-outline"></i></el-button>
          <el-autocomplete
            :clearable="true"
            v-model="inputValue"
            placeholder="请输入搜索内容"
            :fetch-suggestions="querySearch"
            @select="handleSelect"
          ></el-autocomplete>
        </div>
        <div class="header-right">
          <el-dropdown @command="gotoContent">
            <span>管理员 <i class="el-icon-arrow-down el-icon--right"></i></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="homeIndex">首页</el-dropdown-item>
              <el-dropdown-item command="Info">个人信息</el-dropdown-item>
              <el-dropdown-item
                divided
                command="login"
              >退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

      </div>
      <div class="tab-container">
        <el-tabs
          v-model="activeTabName"
          type="card"
          @tab-remove="removeTab"
          @tab-click="clickTab"
          class="tabs"
        >
          <el-tab-pane
            v-for="tab in tabs"
            :key="tab.name"
            :label="tab.title"
            :name="tab.name"
            :closable="tab.closable"
          >
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="main-content">
        <router-view :key="activeTabName"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name:'home',
    data() {
        return {
            iscollapse: false,
            inputValue: '',
            activeTabName: 'homeIndex',
            menuItems:[],
            tabs: [//已打开标签页
                { name: 'homeIndex', title: '首页', closable: false }
            ],
            map: {//有页面的导航
                'homeIndex':'首页',
                'Info': '用户信息',
                'user': '用户管理',
                'attach': '附件管理',
                'dept': '机构管理',
                'post': '岗位管理',
                'dict': '系统字典',
                'dictbiz': '业务字典',
                'menu': '菜单管理',
                'param': '系统参数',
                'usual': '通用日志',
                'api': '接口日志',
                'error': '错误日志',
                'sms_log': '短信配置',
                'api_scope': '接口权限',
                'role': '角色管理',
                'datascope': '数据权限',
                'region': '行政区划'
            }
        }
    },
    methods: {
        createMenu(){//导航目录
            this.$axios.get('/api/blade-system/menu/routes',{
              withCredentials: true,
                headers:{
                   'Blade-Auth':`bearer ${this.$store.state.token}`//持有者令牌，用于授权请求
                }
            })
            .then(res=>{
                this.menuItems=res.data.data.map(item=>({
                    index:item.code,
                    name:item.name,
                    icon:item.source,
                    children:item.children?item.children.map(child=>({
                        index:child.code,
                        name:child.name,
                        icon:child.source,
                        children:child.children?child.children.map(mchild=>({
                            index:mchild.code,
                            name:mchild.name
                        })):[]
                    })):[]
                }))
            }).catch(err=>{
                console.log(err)
            })
        },
        changecollapse() {
            this.iscollapse = !this.iscollapse
        },
        handleSelect(item){
            this.gotoContent(item.index),
            this.inputValue=''
        },
        gotoContent(index) {
            if (index === 'login') {
                this.$axios.get('/api/blade-auth/oauth/logout').
                then(res=>{console.log(res)})
                .catch(err=>{console.log(err)})
                this.$router.replace({name:index});
                history.pushState(null, null, document.URL);
                window.addEventListener('popstate', function () {
                    history.pushState(null, null, document.URL);
                });
                return;
            }
            console.log('gotocontent:',this.activeTabName,'->',index)
            if (this.activeTabName !== index) {
                this.updateActiveTab(index);
                if (index in this.map) {
                    sessionStorage.setItem('isNavigatingByClick', 'true');
                    this.$router.push({ name: index })
                }
            }
        },
        findTabTitle(index,menuItems){
            for(let item of menuItems){
                if(item.index==index){
                    return item.name
                }else if(item.children&&item.children.length>0){
                    let childItem=this.findTabTitle(index,item.children);
                    if(childItem){
                        return childItem
                    }
                }
            }
        },
        updateActiveTab(index) {
            //当前标签页是否已打开
            console.log('执行更新activeTab')
            let TabExist = this.tabs.find(tab => tab.name === index);
            if (!TabExist) {
                let title='';
                if(index=='Info'){
                    title='用户信息'
                }else{
                    title=this.findTabTitle(index,this.menuItems);
                }
                this.tabs.push({ name: index, title: title, closable: true })
            }
            this.activeTabName = index;
            this.saveTabsState()
        },
        querySearch(queryString, cb) {
            let results = Object.keys(this.map).map(key=>({
                index:key,
                value:this.map[key]
            }));
            results = queryString ? results.filter(this.createFilter(queryString)) : results;
            console.log(results);
            cb(results);
        },
        createFilter(queryString) {
            return (item) => {
                return item.value.toUpperCase().includes(queryString.toUpperCase());
            }
        },
        removeTab(targetName) {
            let tabs = this.tabs;
            let activeTabName = this.activeTabName;
            if (activeTabName === targetName) {
                let i = 1;
                tabs.forEach((tab, index) => {
                    if (tab.name === targetName) {//找到待删除标签在tab中的位置
                        activeTabName = tabs[index - i].name;//更新
                        let nextTab = activeTabName;
                        while (!(nextTab in this.map)&& ++i) {
                            nextTab = tabs[index - i].name
                        }
                        sessionStorage.setItem('isNavigatingByClick','true');
                        this.$router.push({ name: nextTab })
                    }
                });
            }
            this.activeTabName = activeTabName;
            this.tabs = tabs.filter(tab => targetName !== tab.name);
            this.saveTabsState()
        },
        clickTab(tab) {
            if (tab.name in this.map) {
                sessionStorage.setItem('isNavigatingByClick', 'true');
                this.$router.push({ name: tab.name })
            }
        },
        saveTabsState() {
            sessionStorage.setItem('tabs', JSON.stringify(this.tabs));
            sessionStorage.setItem('activeTabName', this.activeTabName)
        },
        loadTabsState() {
            let loadTabs=sessionStorage.getItem('tabs');
            let loadActiveTabName=sessionStorage.getItem('activeTabName');
            if(loadTabs){
                this.tabs = JSON.parse(loadTabs);
                this.activeTabName =loadActiveTabName;
            }
        }
    },
    mounted() {
        if(sessionStorage.getItem('tabs')){
            this.loadTabsState();
        }else{
            this.saveTabsState();
            this.loadTabsState();
        }
        console.log(this.$store.state.token)
        setTimeout(() => {
            sessionStorage.removeItem('isRefreshing')
        }, 1000);
    },
    created() {
        this.$store.commit('setToken', sessionStorage.getItem('token'));
        this.createMenu();
    }
}
</script>
<style lang="scss" scoped>
.el-scrollbar::-webkit-scrollbar {
  display: none;
}

.container-wrap {
  background-color: rgb(236, 244, 245);
  width: 100%;
  height: 100%;
  display: flex;

  .sidebar {
    background-color: #2e3139;
    height: 100vh;
    flex: 1;

    .scrollbar {
      position: sticky;
      top: 0%;
      height: 100%;

      .menu {
        height: 100%;
        background-color: azure;

        .title {
          height: fit-content;
          font-size: 2rem;
          color: white;
          text-align: center;
          padding: 1rem 2rem;
          border-bottom: 0.06rem solid rgb(38, 35, 35);
          position: sticky;
          top: 0%;
          line-height: 2rem;
        }
      }
    }
  }

  .container {
    flex: 5;
    display: flex;
    flex-direction: column;

    .header {
      flex: 2;
      display: flex;
      justify-content: space-between;
      border-bottom: 0.04rem solid rgb(209, 208, 208);
      padding: 0.9rem;
      position: sticky;
      top: 0%;
      background-color: white;

      .header-left {
        .el-button {
          border: 0rem;
        }
      }

      .header-right {
        .el-dropdown {
          align-content: center;
        }
      }
    }

    .tab-container {
      flex: 1;
      border-bottom: 0.06rem solid rgb(209, 208, 208);
      position: sticky;
      top: 4.4rem;
      padding: 1rem;
      background-color: white;

      .tabs {
        margin-bottom: 0%;
      }
    }

    .main-content {
      flex: 52;
      position: relative;
      overflow-y: auto;
      margin-top: 1rem;
    }
  }
}
</style>
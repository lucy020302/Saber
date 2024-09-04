# 仿Saber企业级开发平台

## 介绍
本项目旨在仿照 Saber 企业级开发平台，创建一个简洁实用的登陆页面与用户管理页面。通过该项目，可以体验到应用中常见的功能模块，如用户身份验证、用户信息管理等。
- 登陆页面 提供基础的用户身份验证功能，确保用户的安全访问。
- 用户管理页面 通过直观的界面，使管理员能够方便地管理和维护用户数据，包括用户的创建、编辑、删除，以及数据的批量导入与导出等功能。

![登陆页面](/imit/src/assets/screenShot/login.png)
![登陆页面](/imit/src/assets/screenShot/adminPage.png)

## 技术栈

Vue2、Vuex、Axios、Vue Router、Webpack、Element UI

## 安装

#### 克隆仓库
git clone https://github.com/lucy020302/Saber.git

#### 进入项目目录
cd Saber
#### 安装依赖
npm install
#### 启动项目
npm run serve

## 使用

- 登陆页面
    - 登录名:`<your-username>`
    - 密码:`<your-password>`
- 用户管理页面
    - 点击不同部门获取相应部门的用户信息表
    - 根据登陆账号或用户姓名搜索获取相关用户信息表
    - 单个用户信息的查看编辑与删除
    - 新增用户
    - 表格中选定用户的删除、角色配置、密码重置
    - 用户数据导入（包括模板的下载）
    - 所有用户信息的导出
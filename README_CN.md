# SimpleForum

SimpleForum 是一个论坛应用程序，用户可以通过注册、登录、登出。该应用程序允许用户创建、编辑和删除帖子，搜索帖子以及关注或取消关注其他用户。此外，用户还可以与其他在线用户聊天。

这是英文版本的 README [EN](README.md).

这是一个[演示](https://simpleforum-2.onrender.com/)

## 功能

- 用户注册和认证。
- 创建、编辑和删除帖子。
- 搜索帖子。
- 关注和取消关注用户。
- 实时与其他用户聊天。

## 截图

### 登录

![登录](https://github.com/penn201500/simpleForum/blob/main/screenshots/simpleForum-login.gif)

### 帖子

![帖子](https://github.com/penn201500/simpleForum/blob/main/screenshots/simpleForum-posts.gif)

### 搜索和关注

![搜索和关注](https://github.com/penn201500/simpleForum/blob/main/screenshots/simpleForum-searchAndFollow.gif)

### 聊天

![聊天](https://github.com/penn201500/simpleForum/blob/main/screenshots/simpleForum-chat.gif)

## 技术栈

- JavaScript
- Node.js 与 Express
- EJS 模板
- Webpack 和 Babel 用于构建和转译
- MongoDB 数据库
- Socket.IO 实现实时通信

## 预安装

要在本地机器上运行 SimpleForum，您需要安装 Node.js 和 npm。您可以从 [Node.js 官方网站](https://nodejs.org/) 下载并安装。

## 安装

克隆此仓库到本地机器：

```bash
git clone https://github.com/yourgithub/simpleforum.git
cd simpleforum
npm install
```


## 配置

在运行应用程序之前，您必须设置环境变量。在根目录下创建一个 .env 文件，并提供以下配置：

```text
DB_USERNAME=yourMongoDBUsername
DB_PASSWORD=yourMongoDBPassword
DB_HOST=yourMongoDBHost
APP_NAME=SimpleForum
DB_COLLECTION=yourCollectionName
DB_NAME=yourDatabaseName
```

## 运行

在终端中运行以下命令以启动应用程序：

```bash
npm run watch
```

此命令将启动 Node.js 服务器并设置 Webpack 以监视源文件的任何更改。

## 使用

打开浏览器，访问 [http://localhost:3001](http://localhost:3001) 以开始使用 SimpleForum。注册一个帐户以探索所有功能。

## 贡献

欢迎贡献！如果您有建议或改进，请 fork 此仓库并提交一个 pull request。

## 许可证

此脚本是开源的，可以在 MIT 许可证下免费使用。

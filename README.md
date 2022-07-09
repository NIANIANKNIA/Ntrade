# Ntrade - 新一代的玩家交易市场插件
Ntrade是一个基于LLSE的MC服务器玩家交易市场插件，基于JavaScript为玩家带来高效便捷的使用体验。

##### 语言：[English](README_en.md) | 简体中文

## 插件特性
- **多语言** 目前支持简体中文和英语两种语言，更多语言将在后续更新支持

- **全GUI** 所有的功能全部有相应的GUI界面

- **自定义** 服主可以根据自己的需求修改相应的语言包，进而达到自定义效果

- **支持玩家自主上架/下架** 全过程由玩家自主操作，可以设定物品名称/价格，不需要管理员干涉

- **支持玩家上架带有NBT的物品** 不仅仅限制于普通的物品，可以上架带有NBT的物品

- **支持设定下架时限** 上架时间过长的物品将自动下架

- **支持管理员下架** 违规上架的物品可由管理员及时下架

- **可以设定禁止上架的物品** 在配置文件中进行相应的设定，达到禁止某些物品上架的功能

- **支持玩家查看历史的交易记录** 随时查看历史交易动向

## 安装教程

### 初始化插件

1. 配置好相应的BDS服务端，并安装好LiteLoader

2. 下载最新版本的[Ntrade](https://github.com/NIANIANKNIA/Ntrade/releases)

3. 将解压包中的Ntrade.lxl.js放到BDS根目录的plugins文件夹下

4. 启动**bedrock_server_mod.exe**，然后插件会自动生成相应的配置文件

### 修改配置文件

请参考以下内容修改配置文件

配置文件位置：`plugins/Ntrade/config.json`

```json
{
    "marketID": 1,  //市场ID，正常情况下不要更改
    "llmoney": 0,   //是否启用llmoney经济，0（false）为不启用，1（true）为启用
    "MoneyScoresBoardName": "money",  //如果为计分板经济，相应的计分板名称
    "Password": "123456",   //下架授权码
    "BanItems": [
        {
            "type": "minecraft:clock",  //禁止上架的物品id
            "aux": -1   //禁止上架的物品特殊值（-1就是不限制特殊值）
        }
    ],
    "language": "zh_CN",  //插件的主语言 en_US 为英语
    "AutoOffShelfTime": 72,   //自动下架的时间（单位：小时），设置为-1则不会自动下架
    "TaxRate": 0    //转账税率，设置为0则不收手续费，若有需求，请自行更改为[0，1)的任意数字
}
```

## 联系作者
email：nianianknia@163.com qq:1020317403

## 许可证

您必须接受 Minecraft 的最终用户许可协议(EULA).

- 它意味着**请勿将任何违反 EULA 的内容用于商业用途**
- 接受这个**许可证**意味着您也**接受了**[Minecraft EULA](https://account.mojang.com/terms)
- 如果您违反了 **EULA**，任何法律责任都与开发者**无关**
- **开发者不对您负责，开发者没有义务为你编写代码、为你使用造成的任何后果负责**

另外，您需要遵守本项目的`AGPL-3.0`开源许可证条款




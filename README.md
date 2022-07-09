# Ntrade
一个基于LLSE的用于实现玩家间交易的插件
v1.0.6版本以前更新v1.0.7版本需要使用另外的插件转换数据格式

TFNtrade 转化插件链接

由于涉及格式转换，升级前请做好备份！

尽量先在本地测试后再上线！

另外本次更新涉及语言包更新，请按照文末方法更新！



==关于本插件==



（本插件是我从我自己服务器插件上扒出来的一部分，所有可能有一些奇奇挂怪的bug？

由于我自己的服务器没有用ll自带的经济，所以ll的经济可能有点问题（有bug就反馈

计分板经济：可以在配置文件的"MoneyScoresBoardName"中更改计分板名称

并把llmoney改为false

LLmone经济：只要把配置文件中的"llmoney"改为true即可，不用管"MoneyScoresBoardName"

配置文件地址：/plugins/NTrade/config.json



这个是插件的配置文件：



v1.0.7版本

[CODE=json]{//其他的项目看老版本的配置文件介绍

    "marketID": 1,

    "llmoney": false,

    "MoneyScoresBoardName": "money",

    "Password": "123456",

    "BanItems": [

        {

            "type": "minecraft:clock",

            "aux": 0

        }

    ],

    "language": "zh_CN", //插件主语言，目前可选项目："zh_CN"--简体中文 "en_US"--英文

                                       //目前语言项目只能填这两个，填其他内容均会报错！

    "TaxRate": 0,  //手续费，默认为0，不需要手续费，若有需求请自行更改为（0，1）之间的任何数

    "AutoOffShelfTime": 72  //自动下架时间(单位：小时)，设置为-1则不自动下架

}[/CODE]

[SPOILER="老版本配置文件格式"]

v1.0.5版本

[CODE=json]{

    "marketID": 1,  //不用管，最好也不要改

    "llmoney": false,  //如果该项目为true则使用llmoney经济核心，如果计分板核心请将本项目改为false

    "MoneyScoresBoardName": "money",  //（如果使用llmoney经济核心请无视）服务器计分板名称

    "Password": "123456",  //下架二次授权码

    "BanItems": [

        {

            "type": "minecraft:clock",  //禁止上架的物品ID

            "aux": 0  //物品的特殊值，如果为-1，则不限制特殊值

        }

    ],  //禁止上架的物品

    "language": "zh_CN"  //插件主语言，目前可选项目："zh_CN"--简体中文 "en_US"--英文

                                       //目前语言项目只能填这两个，填其他内容均会报错！

}[/CODE]



v1.0.4版本

[CODE=json]{

    "marketID": 1,   //不用管

    "llmoney": false   //如果该项目为true则使用llmoney经济核心，如果计分板核心请将本项目改为false

    "MoneyScoresBoardName": "money",  //（如果使用llmoney经济核心请无视）服务器计分板名称

    "Password": "123456" //下架二次授权码

}[/CODE]

[/SPOILER]





使用方法也很简单，服务器内使用/trade指令即可打开玩家交易市场的GUI





==安装方法==



下载插件，扔到plugins文件夹后开服！





==相关文件说明==



配置文件地址：/plugins/NTrade/config.json

用于存储玩家商店数据的文件地址：/plugins/NTrade/market.json

用于存储不在线商家金币数据的地址：/plugins/NTrade/playermoney.json

用于存储交易成功数据的地址：/plugins/NTrade/PlayerTradeDate.json

用于存储本插件的语言文件地址：/plugins/NTrade/lang/

如果你觉得插件有些文字表达不合理，想要进行更改，请打开相应的语言文件自行更改！

注意：以上的除配置文件以外的文件，看不懂不要乱改

更不要使用记事本更改这些文件！！！





==本插件已有的功能==



1.支持玩家自己上架带有NBT的物品（上架的是玩家主手所持有的所有物品）

2.支持玩家自由定价，自由上下架，完全不需要管理的干涉

3.支持商品预览，点击预览按钮后可以预览商品10s

4.支持离线玩家转账，即使商家不在线也可以在商家下回上线的时候打款

5.支持查看交易记录，所有交易成功后可随时随地查看原有的交易记录

6.支持管理员下架商品，及时下架不合理的商品

7.为防止误操作导致的下架，需要输入二次确认码（初始为123456 可在配置文件更改）才可以下架

8.支持玩家对上架后商品更改属性，进行下架等操作

9.可以检测玩家背包是否有空余，没有空余位置，无法进行下架购买等操作

10.支持计分板、LL双经济系统

11.服主可以自己设置哪些物品不能上架到市场

12.增加其他语言项目的支持

13.玩家上架商品，成功购买后收取部分手续费

14.可设置上架的物品过长时间会自动下架





==插件计划中功能==



对接PTitle插件，玩家上架自己的称号到交易市场（预计v1.1.0前实现）









==插件部分界面截图==



主界面.png交易市场主界面.png商品详细页面.png上架界面1.png上架界面2.png编辑上架物品信息.png下架确定界面.png交易记录.png





==BUG反馈/提交建议==



有BUG可以直接在评论区反馈

也可以加我QQ：1020317403 或者QQ群：630507266

（第一次写插件，里面变量名乱的一批，后面可能会改，大佬轻喷）



==语言包更新==



用于存储本插件的语言文件夹地址：/plugins/NTrade/lang/

自行更改不要使用记事本！！！！！！

简体中文（zh_CN）

语言包发生了变动，您可以选择删除原有的语言文件后让系统自动生成，或者按照下面的变动记录自行更改

v1.0.6=>v1.0.7 语言包变动记录

语言包中的"enable_false_button1"项目由原有的"已被管理员下架"更正为"已被下架"

语言包中新增"OffShelf_TimeOut"项目，在语言包最后一行，建议将如下内容添加到最后一行

"OffShelf_TimeOut": "到期已被系统自动下架"



English（en_US）

The language pack has changed. You can choose to delete the original language file and let the system generate it automatically, or change it by yourself according to the change record below

V1.0.6=>v1.0.7 language pack change record

The "offshelf_timeout" item is added to the language pack. In the last line of the language pack, it is recommended to add the following content to the last line

"OffShelf_TimeOut": "Removed by the system"




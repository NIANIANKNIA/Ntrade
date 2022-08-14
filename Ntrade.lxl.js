//LiteLoaderScript Dev Helper
/// <reference path="d:\minecraftserver\bedrock-server-1.18.32.02\plugins/Library/JS/Api.js" />

////////////////////////////////////////////////////////////////
//关于本插件的一些基本信息
//作者：NIANIANKNIA
//联系方式：邮箱：admin@mcnia.top QQ：1020317403
//在本插件的制作中特别鸣谢 Arnol梧桐 的插件，以及PTitle等优秀插件
//本插件是从我服务器上的插件直接拆下来的，所以说可能有bug
//bug可以直接在minebbs评论反馈，也可以加群630507266反馈！
//这个版本刚做好多语言，所以注释几乎没有，有时间一定写）
////////////////////////////////////////////////////////////////
//v1.0.6=>v1.0.7 语言包变动记录
//V1.0.6=>v1.0.7 language pack change record
//语言包发生了变动，您可以选择删除原有的语言文件后让系统自动生成，或者按照下面的变动记录自行更改
//The language pack has changed. You can choose to delete the original language file and let the system generate it automatically, or change it by yourself according to the change record below
//语言包中的"enable_false_button1"项目由原有的"已被管理员下架"更正为"已被下架"
//The "enable_false_button1" item in the language pack is corrected from the original "offline by the administrator" to "offline by the administrator"
//语言包中新增"OffShelf_TimeOut"项目，在语言包最后一行，建议将如下内容添加到最后一行
//The "offshelf_timeout" item is added to the language pack. In the last line of the language pack, it is recommended to add the following content to the last line
//简体中文（zh_CN）
//"OffShelf_TimeOut": "到期已被系统自动下架"
//English（en_US）
//"OffShelf_TimeOut": "Removed by the system"
////////////////////////////////////////////////////////////////


//相关文件位置的定义

const dir_path = './plugins/NTrade/';
const market_path = './plugins/NTrade/market.json';
const Playmoney_path = './plugins/NTrade/playmoney.json';
const PlayerTradeDate_path = './plugins/NTrade/PlayerTradeDate.json';
const language_path = './plugins/NTrade/lang/';
const config_path = './plugins/NTrade/config.json';

//本插件基本信息定义

const PLUGIN_NAME = "NTrade";
const PLUGIN_DESCRIPTION = "NTrade 玩家交易--玩家间的自由交易市场";
const VERSION = [1,0,9];
const AUTHOR = "NIANIANKNIA";

//插件日志消息标头

logger.setTitle(`${PLUGIN_NAME}`);
logger.setConsole(true, 4);

//生成相关文件，写入第一次的配置

if (File.exists(dir_path) == false) {
    File.mkdir(dir_path);
    log("首次运行，正在生成Ntrade文件夹，用于存放本插件相关数据");
}

if (File.exists(language_path) == false) {
    File.mkdir(language_path);
    log("首次运行，正在生成语言文件夹，用于存放本语言包相关数据");
}

if (!file.exists(market_path)) {
    log("首次运行，正在生成market文件");
    let a = [];
    File.writeTo(market_path,JSON.stringify(a, null, 2));
} else {
    var market = JSON.parse(File.readFrom(market_path));
}

if (!file.exists(Playmoney_path)) {
    log("首次运行，正在生成Playmoney文件");
    let a = [{"name": "Steve","money": 10000}];
    File.writeTo(Playmoney_path,JSON.stringify(a, null, 2));
} else {
    var Playmoney = JSON.parse(File.readFrom(Playmoney_path));
}

if (!file.exists(PlayerTradeDate_path)) {
    log("首次运行，正在生成PlayerTradeDate文件");
    let a = [];
    File.writeTo(PlayerTradeDate_path,JSON.stringify(a, null, 2));
} else {
    var PlayerTradeDate = JSON.parse(File.readFrom(PlayerTradeDate_path));
}

//配置文件

let niaconfig = new JsonConfigFile(config_path);
    niaconfig.init("marketID", 1);
    niaconfig.init("llmoney", false);
    niaconfig.init("MoneyScoresBoardName", "money");
    niaconfig.init("Password", "123456");
    niaconfig.init("BanItems", [{type: "minecraft:clock", aux: -1}]);
    niaconfig.init("language", "zh_CN");
    niaconfig.init("AutoOffShelfTime", 72);
    niaconfig.init("TaxRate", 0);
//判断配置文件的语言项目是否合规
if (!(niaconfig.get("language") == "zh_CN" || niaconfig.get("language") == "en_US")) {
    logger.error("错误的语言配置文件，已自动选择简体中文作为本插件的主要语言！");
    niaconfig.set("language","zh_CN");
}

//根据配置文件的语言配置项目，进行相应语言项目的写入与更改
if (!file.exists(language_path + niaconfig.get("language") + ".json")) {
    let a = {};
    switch(niaconfig.get("language")) {
        case "zh_CN":
            a = {
                "version": 1.1,
                "cancel_operation_info": "你取消了本次操作",
                "MarketMenu_title": "服务器官方交易平台",
                "MarketMenu_Nocommodity": "还没有玩家上线自己的物品！赶快来上架第一个物品吧！",
                "MarketMenu_Info": "服务器提醒：交易仅限于使用服务器内货币交易，严禁涉及人民币交易，违者双方将封号处理！",
                "MarketMenu_button_price": "价格：",
                "preview_start_info": "你要预览的商品已发放到你的背包！请尽快查看商品属性！10s后商品将自动消失!",
                "preview_end_info": "预览时间到！物品已收回，您可以继续点击预览查看商品属性，也可以点击购买按钮进行购买！",
                "preview_bag_full_info": "背包空间不足，无法将预览商品放入，请清理足够的格子后再次尝试！",
                "commodity_sold_info": "您在玩家交易市场上线的物品已卖出，您获得金币：",
                "success_buy_info": "购买成功，期待您的下次光临！",
                "buy_bag_full_info": "背包空间不足，无法将商品放入，请清理足够的格子后再次尝试！",
                "fail_buy_info": "购买失败，您的余额不足!",
                "marketSetupMenu_title": "填写下架的原因",
                "marketSetupMenu_input_reason_title": "请输入下架本商品的原因",
                "marketSetupMenu_input_reason_placeholder": "原因不能不填！",
                "marketSetupMenu_input_password_title": "请输入下架授权码",
                "marketSetupMenu_input_password_placeholder": "不知道下架授权码找服主要！",
                "take_down_reason_null_info": "下架理由不能为空！请重新操作！",
                "take_down_success_info": "下架成功！",
                "take_down_passworderr_info": "下架授权码错误，下架失败！",
                "PreBuyMenu_title": "对所选商品进行操作",
                "PreBuyMenu_description1": "商品属性描述：",
                "PreBuyMenu_description2": "所有者",
                "PreBuyMenu_description3": "商品名字",
                "PreBuyMenu_description4": "商品描述",
                "PreBuyMenu_description5": "商品价格",
                "PreBuyMenu_description6": "商品NBT值",
                "PreBuyMenu_preview_button": "预览商品",
                "PreBuyMenu_preview_description_button": "点击后你将有10s预览商品的属性",
                "PreBuyMenu_buy_button": "购买商品",
                "PreBuyMenu_buy_description_button": "点击后你可以购买本商品",
                "PreBuyMenu_takedown_button": "下架商品",
                "PreBuyMenu_takedown_description_button": "仅管理员可见本按钮",
                "GiveMoneyOffline_info1": "自从你上回下线后，产生收益(别人购买你上架的物品等)",
                "GiveMoneyOffline_info2": "金币，现已发放至您的账户，请及时查收!",
                "TradeCmd_description": "玩家市场主菜单",
                "MainMenu_title": "服务器官方交易平台",
                "MainMenu_tip_info": "服务器提醒：交易仅限于使用服务器内货币交易，严禁涉及人民币交易，违者双方将封号处理！",
                "MainMenu_view_button": "查看玩家市场",
                "MainMenu_view_description_button": "由玩家自行定价的交易市场",
                "MainMenu_take_down_button": "上架自己的物品",
                "MainMenu_take_down_description_button": "在这里将自己的主手物品上架",
                "MainMenu_edit_button": "编辑自己已上架的物品",
                "MainMenu_edit_description_button": "在这里可以编辑自己已上架的物品",
                "MainMenu_view_record_button": "查看交易记录",
                "MainMenu_view_record_description_button": "在这里有你的交易记录",
                "err_empty_info": "你不能上架空气，请重新选择要上架的物品！",
                "OnShelfMenu_title": "上架自己的物品",
                "OnShelfMenu_info": "上架物品需知：\n1.在服务器上架物品命名应当符合法律法规，一旦发现有任何违法内容，服务器有权限在不提前告知的的情况下直接下架商品\n2.服务器内所有交易仅限于使用服务器内货币交易，严禁使用人民币进行交易，一旦发现双方将封号处理！\n3.上架的物品名称不应当包含广告内容，否则服务器将进行下架处理！\n4.商品名称以及描述都应当实事求是反应商品真实情况，不真实者将下架处理\n5.严禁上架服务器违禁品，违者后果自负！\n6.注意：上架的物品为当前主手选中的栏位中的所有物品\n7.别人购买你上架的商品的钱款将在你下回上线后发放（即使你在线也是）",
                "OnShelfMenu_nbt_info": "当前选中的物品NBT值为",
                "OnShelfMenu_name_input": "请输入商品的名字",
                "OnShelfMenu_name_description_input": "不要太长，避免显示出错",
                "OnShelfMenu_description_input": "请输入商品的描述",
                "OnShelfMenu_description_description_input": "在这里简单描述你的商品",
                "OnShelfMenu_price_input": "请输入商品的价格",
                "OnShelfMenu_price_description_input": "只能输入正整数，否则一律按0处理",
                "err_take_down_info": "上架失败！商品的名字以及价格是必填项！",
                "err_price_format_info": "未知的价格类型，价格已自动设置为默认值！",
                "onshelf_success_info": "上架成功！",
                "err_onshelf_banitem_info": "违规物品，禁止上架！",
                "OpOnShelfMenu_title": "管理自己的已上架商品",
                "enable_true_button1": "可用状态",
                "enable_true_button2": "价格",
                "enable_false_button1": "已被下架",
                "enable_false_button2": "下架原因",
                "item_null_info": "你还没有已上架的物品可以进行操作！",
                "chose_op_itemMenu_title": "请选择对商品的操作",
                "chose_op_itemMenu_edit_button": "编辑本商品基本信息",
                "chose_op_itemMenu_take_down_button": "下架本商品",
                "edit_itemMenu_title": "编辑本商品基本信息",
                "edit_item_success_info": "修改成功！",
                "item_back_info": "该商品已自动下架并返还您的背包，如果您想继续售卖请重新上架！",
                "err_give_item_info": "背包空间不足，无法将下架物品放入背包，请清理足够的格子后再次尝试！",
                "TradeDateMenu_title": "交易记录",
                "TradeDateMenu_sell_info1": "出售订单",
                "TradeDateMenu_sell_info2": "订单号ID",
                "TradeDateMenu_sell_info3": "买家",
                "TradeDateMenu_sell_info4": "交易时间",
                "TradeDateMenu_sell_info5": "成交金额",
                "TradeDateMenu_sell_info6": "成交物品名称",
                "TradeDateMenu_sell_info7": "成交物品描述",
                "TradeDateMenu_sell_info8": "成交物品NBT",
                "TradeDateMenu_buy_info1": "出售订单",
                "TradeDateMenu_date_null_info": "暂时未查到您的交易记录哦！",
                "OffShelf_TimeOut": "到期已被系统自动下架"
            }
            colorLog("yellow", "您选择的是简体中文作为本插件的主语言");
            break;
        case "en_US":
            a = {
                "version": 1.1,
                "cancel_operation_info": "You canceled this operation!",
                "MarketMenu_title": "Player Trading Platform",
                "MarketMenu_Nocommodity": "No players have listed their items yet! Hurry up to put the first item on the shelves!",
                "MarketMenu_Info": "Transactions are limited to currency transactions in the server, and transactions involving money are strictly prohibited. Offenders will be banned from both parties!",
                "MarketMenu_button_price": "price：",
                "preview_start_info": "The item you want to preview has been delivered to your backpack! Please check the item attributes as soon as possible! The item will disappear automatically after 10s!",
                "preview_end_info": "Preview time is up! The item has been recovered, you can continue to click the preview to view the item properties, or click the buy button to purchase!",
                "preview_bag_full_info": "There is not enough space in the backpack to put the preview items in, please clear enough grids and try again!",
                "commodity_sold_info": "The item you listed on the player market has been sold, and you get gold coins:",
                "success_buy_info": "The purchase is successful, looking forward to your next visit!",
                "buy_bag_full_info": "There is not enough space in the backpack to put the item in, please clear enough cells and try again!",
                "fail_buy_info": "Purchase failed, your balance is insufficient!",
                "marketSetupMenu_title": "Fill in the reason for removal",
                "marketSetupMenu_input_reason_title": "Please enter the reason for removing this item",
                "marketSetupMenu_input_reason_placeholder": "The reason cannot be left blank!",
                "marketSetupMenu_input_password_title": "Please enter the password",
                "marketSetupMenu_input_password_placeholder": "",
                "take_down_reason_null_info": "The reason for removal cannot be empty! Please try again!",
                "take_down_success_info": "Delisted successfully!",
                "take_down_passworderr_info": "The authorization code for delisting is wrong, and the delisting failed!",
                "PreBuyMenu_title": "Take action on the selected item",
                "PreBuyMenu_description1": "Item attribute description:",
                "PreBuyMenu_description2": "owner",
                "PreBuyMenu_description3": "name",
                "PreBuyMenu_description4": "description",
                "PreBuyMenu_description5": "price",
                "PreBuyMenu_description6": "NBT",
                "PreBuyMenu_preview_button": "Preview this item",
                "PreBuyMenu_preview_description_button": "You will have 10s to preview the item",
                "PreBuyMenu_buy_button": "Buy this item",
                "PreBuyMenu_buy_description_button": "After clicking you can buy this item",
                "PreBuyMenu_takedown_button": "Off the shelf",
                "PreBuyMenu_takedown_description_button": "Only visible to admins",
                "GiveMoneyOffline_info1": "Since you went online and offline, generate revenue (others buy items you listed, etc.) ",
                "GiveMoneyOffline_info2": " coins have been issued to your account, please check in time!",
                "TradeCmd_description": "Player Market Main Menu",
                "MainMenu_title": "Player Trading Platform",
                "MainMenu_tip_info": "The transaction is limited to the use of currency transactions in the server. It is strictly prohibited to involve money transactions. The offenders will be banned from both sides!",
                "MainMenu_view_button": "View Player Market",
                "MainMenu_view_description_button": "Marketplaces priced by players themselves",
                "MainMenu_take_down_button": "List your own items",
                "MainMenu_take_down_description_button": "List your main hand items here",
                "MainMenu_edit_button": "Edit your own listed items",
                "MainMenu_edit_description_button": "Here you can edit your own listed items",
                "MainMenu_view_record_button": "View transaction history",
                "MainMenu_view_record_description_button": "have your transaction history here",
                "err_empty_info": "You cannot list air, please re-select items to list!",
                "OnShelfMenu_title": "List your own items",
                "OnShelfMenu_info": "Please open the language pack en_US.json file and change the content of line 50 to change this paragraph",
                "OnShelfMenu_nbt_info": "The NBT value of the currently selected item is",
                "OnShelfMenu_name_input": "Please enter the name of the item",
                "OnShelfMenu_name_description_input": "Don't be too long to avoid display errors",
                "OnShelfMenu_description_input": "Please enter a description of the item",
                "OnShelfMenu_description_description_input": "Briefly describe your item here",
                "OnShelfMenu_price_input": "Please enter the price of the item",
                "OnShelfMenu_price_description_input": "Only positive integers can be entered",
                "err_take_down_info": "Listing failed! The name and price of the product are required!",
                "err_price_format_info": "Unknown price data type, price has been automatically set to default!",
                "onshelf_success_info": "Launched successfully!",
                "err_onshelf_banitem_info": "Illegal items are prohibited from listing!",
                "OpOnShelfMenu_title": "Manage your own listings",
                "enable_true_button1": "Availability",
                "enable_true_button2": "price",
                "enable_false_button1": "Was removed",
                "enable_false_button2": "Reason",
                "item_null_info": "You have no listed items to operate!",
                "chose_op_itemMenu_title": "Please select an action on the item",
                "chose_op_itemMenu_edit_button": "Edit the basic information of this product",
                "chose_op_itemMenu_take_down_button": "Remove this item",
                "edit_itemMenu_title": "Edit the basic information of this product",
                "edit_item_success_info": "Successfully modified!",
                "item_back_info": "This item has been automatically removed from the shelves and returned to your backpack, please re-list if you want to continue selling!",
                "err_give_item_info": "There is not enough space in the backpack to put the off-shelf items into the backpack, please clear enough grids and try again!",
                "TradeDateMenu_title": "Transaction Record",
                "TradeDateMenu_sell_info1": "sell order",
                "TradeDateMenu_sell_info2": "order number id",
                "TradeDateMenu_sell_info3": "buyer",
                "TradeDateMenu_sell_info4": "transaction hour",
                "TradeDateMenu_sell_info5": "Turnover",
                "TradeDateMenu_sell_info6": "Transaction item name",
                "TradeDateMenu_sell_info7": "Description of the traded item",
                "TradeDateMenu_sell_info8": "Transaction Items NBT",
                "TradeDateMenu_buy_info1": "sell order",
                "TradeDateMenu_date_null_info": "Your transaction record has not been found yet!",
                "OffShelf_TimeOut": "Removed by the system"
            }
            colorLog("yellow", "You have selected English as the primary language of this plugin");
            logger.warn("This language pack uses machine translation, if you think there is something inaccurate about the translation, please email admin@mcnia.top");
            break;
    }
    File.writeTo(language_path + niaconfig.get("language") + ".json",JSON.stringify(a, null, 4));
    var language = JSON.parse(File.readFrom(language_path + niaconfig.get("language") + ".json"));
} else {
    switch (niaconfig.get("language")) {
        case "zh_CN":
            colorLog("yellow", "您选择的是简体中文作为本插件的主语言");
            break;
        case "en_US":
            colorLog("yellow", "You have selected English as the primary language of this plugin");
            logger.warn("This language pack uses machine translation, if you think there is something inaccurate about the translation, please email admin@mcnia.top");
            break;
    }
    var language = JSON.parse(File.readFrom(language_path + niaconfig.get("language") + ".json"));
}

//插件加载成功后在控制台输出版权信息
switch (niaconfig.get("language")) {
    case "zh_CN":
        if (niaconfig.get("llmoney")) {
            colorLog("yellow", "您选择的是LLmoney当作经济核心");
        } else {
            colorLog("yellow", "您选择的是计分板当作经济核心");
        }
        colorLog("green", "Ntrade 加载成功 版本号:" + `${VERSION.join(".")} 作者:${AUTHOR}` + " 插件更新网址：https://www.minebbs.com/threads/ntrade-gui.12374/");
        if (niaconfig.get("TaxRate") < 0 || niaconfig.get("TaxRate") >= 1) {
            logger.error("税率配置错误，请重新配置！");
        }
        break;
    case "en_US":
        if (niaconfig.get("llmoney")) {
            colorLog("yellow", "You have chosen llmoney as the economic core");
        } else {
            colorLog("yellow", "You have chosen the scoreboard as the core of the economy");
        }
        colorLog("green", "Ntrade load successfully, version: " + `${VERSION.join(".")} ,author: ${AUTHOR}`);
        if (niaconfig.get("TaxRate") < 0 || niaconfig.get("TaxRate") >= 1) {
            logger.error("Tax rate configuration error, please reconfigure!");
        }
        break;
}


//注册插件

ll.registerPlugin(PLUGIN_NAME, PLUGIN_DESCRIPTION, VERSION, {"作者":AUTHOR});

//自定义函数

/**
 * 调用函数后判断时间是否达到下架时间
 */
function OffShelf() {
    market = JSON.parse(File.readFrom(market_path));
    let time = new Date();
    if (time.getMonth() < 9) {
        endMonth = 1 + time.getMonth();
        endMonth = "0" + endMonth;
    } else {
        endMonth = 1 + time.getMonth();
    }
    if (time.getDate() < 10) {
        endDate = "0" + time.getDate();
    } else {
        endDate = time.getDate();
    }
    if (time.getHours() < 10) {
        endHour = "0" + time.getHours();
    } else {
        endHour = time.getHours();
    }
    if (time.getMinutes() < 10) {
        endMinute = "0" + time.getMinutes();
    } else {
        endMinute = time.getMinutes();
    }
    if (time.getSeconds() < 10) {
        endSecond = "0" + time.getSeconds();
    } else {
        endSecond = time.getSeconds();
    }
    NowTime = time.getFullYear() + "-" + endMonth + "-" + endDate + " " + endHour + ":" + endMinute + ":" + endSecond;
    for (let i = 0; i < market.length; i++) {
        if (market[i].endTime <= NowTime && market[i].enabled == true) {
            market[i].enabled = false;
            market[i].reason = language.OffShelf_TimeOut;
        }
    }
    File.writeTo(market_path,JSON.stringify(market, null, 2));
}

/**
 * 判断一个对象obj是否为空对象
 * @param {object} obj
 * @returns {boolean} 该对象是否为空
 */
function isEmptyObject(obj){
    for (let key in obj) {
        if (obj[key].enabled == true) {
            return false;
        }
    };
    return true;
};

/**
 * 判断一个字符串中是否含有数字
 * @param {string} str
 * @returns {boolean} 该字符串是否蕴含数字
 */
function containsNumber(str) {
    var regNumber = /\d+/;
    if (regNumber.test(str)) {
        return true;
    }
    return false;
}

/**
 * 对玩家对象player发起一个市场主菜单GUI
 * @param {object} player 目标玩家对象
 * @param {object} market 传入的市场文件数据
 */
function MarketMenu(player, market) {
    let MarketMenu = mc.newSimpleForm();
        MarketMenu.setTitle(language.MarketMenu_title);
    if (isEmptyObject(market)) {
        MarketMenu.setContent("§6" + language.MarketMenu_Nocommodity);
    } else {
        MarketMenu.setContent("§c" + language.MarketMenu_Info);
        for (let i = 0; i < market.length; i++) {
            if (market[i].enabled) {
                MarketMenu.addButton("§1[§r§9" + market[i].player + "§r] " + market[i].name + "§r " + language.MarketMenu_button_price + "§：§9" + market[i].price + "§9\n" + market[i].description);
            }
        }
    }
    player.sendForm(MarketMenu,function(player, PreBuyID) {
        if (PreBuyID == null) {
            player.tell("§c>> " + language.cancel_operation_info);
        } else {
            for (let i = 0; i < market.length; i++) {
                if (!market[i].enabled && i <= PreBuyID) {
                    PreBuyID++;
                }
            }
            BuyInfoMenu(player, PreBuyID);    //调用自定义函数
        }
    })
}

/**
 * 对玩家对象player发起一个商品详情菜单
 * @param {object} player 目标玩家对象
 * @param {integer} PreBuyID
 * @param {integer} SubPreBuyID
 */
function BuySubMenu(player, PreBuyID, SubPreBuyID) {
    var Password = niaconfig.get("Password");
    switch (SubPreBuyID) {
        case 0:
            let result = player.getInventory().addItemToFirstEmptySlot(mc.newItem(NBT.parseSNBT(market[PreBuyID].nbt)));
            player.refreshItems();
            if (result) {
                let haveItems = player.getInventory().getAllItems();
                for(let i = 0; i < haveItems.length; i++) {
                    let item = haveItems[i];
                    if (item.getNbt().toString() == NBT.parseSNBT(market[PreBuyID].nbt).toString()) {
                        player.tell("§e>> " + language.preview_start_info);
                        item.setNull();
                        setTimeout(function() {
                            player.refreshItems()
                            player.tell("§e>> " + language.preview_end_info);
                            BuyInfoMenu(player, PreBuyID);
                        },10000);
                        break;
                    }
                }
            } else {
                player.tell("§c>> " + language.preview_bag_full_info);
            }
            break;
        case 1:
            if (niaconfig.get("llmoney")) {
                HaveMoney = money.get(player.xuid);
            } else {
                HaveMoney = player.getScore(MONEY);
            }
            if (HaveMoney >= market[PreBuyID].price) {
                let result = player.getInventory().addItemToFirstEmptySlot(mc.newItem(NBT.parseSNBT(market[PreBuyID].nbt)));
                player.refreshItems();
                if (result) {
                    Playmoney = JSON.parse(File.readFrom(Playmoney_path));
                    let GiveMoneyResult = false;
                    let ReduceMoneyResult = false;
                    let onlinePlayers = mc.getOnlinePlayers();
                    let onlineResult = false;
                    for (let k = 0; k < onlinePlayers.length; k++) {
                        if (onlinePlayers[k].realName == market[PreBuyID].player) {
                            onlineResult = true;
                            if (niaconfig.get("llmoney")) {
                                onlinePlayers[k].tell("§e>> " + language.commodity_sold_info + parseInt(market[PreBuyID].price * (1 - niaconfig.get("TaxRate"))));
                                GiveMoneyResult = money.add(onlinePlayers[k].xuid, parseInt(market[PreBuyID].price * (1 - niaconfig.get("TaxRate"))));
                            } else {
                                onlinePlayers[k].tell("§e>> " + language.commodity_sold_info + parseInt(market[PreBuyID].price * (1 - niaconfig.get("TaxRate"))));
                                GiveMoneyResult = onlinePlayers[k].addScore(MONEY, parseInt(market[PreBuyID].price * (1 - niaconfig.get("TaxRate"))));
                            }
                            break;
                        }
                    }
                    if (!onlineResult) {
                        for (let i = 0; i < Playmoney.length; i++) {
                            if (Playmoney[i].name == market[PreBuyID].player) {
                                Playmoney[i].money = parseInt(market[PreBuyID].price * (1 - niaconfig.get("TaxRate"))) + Playmoney[i].money;
                                GiveMoneyResult = File.writeTo(Playmoney_path,JSON.stringify(Playmoney, null, 2));
                                break;
                            }
                        }
                    }
                    if (niaconfig.get("llmoney")) {
                        ReduceMoneyResult = money.reduce(player.xuid,market[PreBuyID].price)
                    } else {
                        ReduceMoneyResult = player.reduceScore(MONEY,market[PreBuyID].price);
                    }
                    PlayerTradeDate = JSON.parse(File.readFrom(PlayerTradeDate_path));
                    let TradeDate = {};
                        TradeDate.seller = market[PreBuyID].player;
                        TradeDate.buyer = player.realName;
                        TradeDate.endtime = system.getTimeStr();
                        TradeDate.ID = market[PreBuyID].ID;
                        TradeDate.GiveMoney = GiveMoneyResult;
                        TradeDate.ReduceMoney = ReduceMoneyResult;
                        TradeDate.date = market[PreBuyID];
                    PlayerTradeDate.push(TradeDate);
                    market.splice(PreBuyID, 1);
                    File.writeTo(market_path,JSON.stringify(market, null, 2));
                    player.tell("§e>> " + language.success_buy_info);
                    File.writeTo(PlayerTradeDate_path,JSON.stringify(PlayerTradeDate, null, 2));
                } else {
                    player.tell("§c>> " + language.buy_bag_full_info);
                }
            } else {
                player.tell("§c>> " + language.fail_buy_info);
            }
            break;
        case 2:
            let marketSetup = mc.newCustomForm();
                marketSetup.setTitle(language.marketSetupMenu_title);
                marketSetup.addInput(language.marketSetupMenu_input_reason_title, language.marketSetupMenu_input_reason_placeholder);
                marketSetup.addInput(language.marketSetupMenu_input_password_title, language.marketSetupMenu_input_password_placeholder);
            player.sendForm(marketSetup,function(marketSetupPl, marketSetupDates) {
                if (marketSetupDates == null) {
                    marketSetupPl.tell("§c>> " + language.cancel_operation_info)
                } else {
                    if (marketSetupDates[1] == Password) {
                        if (marketSetupDates[0] == "") {
                            marketSetupPl.tell("§c>> " + language.take_down_reason_null_info);
                        } else {
                            market[PreBuyID].enabled = false;
                            market[PreBuyID].reason = marketSetupDates[0];
                            File.writeTo(market_path,JSON.stringify(market, null, 2));
                            marketSetupPl.tell("§e>> " + language.take_down_success_info);
                            MarketMenu(player, market);
                        }
                    } else {
                        marketSetupPl.tell("§c>> " + language.take_down_passworderr_info);
                    }
                }
            });
            break;
    }
}

/**
 * 对玩家对象player发起一个商品详情菜单
 * @param {object} player 目标玩家对象
 * @param {integer} PreBuyID
 * @param {integer} SubPreBuyID
 */
function BuyInfoMenu(player, PreBuyID) {
    let PreBuyMenu = mc.newSimpleForm();
        PreBuyMenu.setTitle(language.PreBuyMenu_title);
        PreBuyMenu.setContent("§e" + language.PreBuyMenu_description1 + "\n [" + language.PreBuyMenu_description2 + "] §b" + market[PreBuyID].player + "\n §r§e[" + language.PreBuyMenu_description3 + "] §b" + market[PreBuyID].name + "\n §r§e[" + language.PreBuyMenu_description4 + "] §b" + market[PreBuyID].description + "\n §r§e[" + language.PreBuyMenu_description5 + "] §b" + market[PreBuyID].price + "\n §r§e[" + language.PreBuyMenu_description6 + "] §b" + market[PreBuyID].nbt);
        PreBuyMenu.addButton(language.PreBuyMenu_preview_button + "\n§9" + language.PreBuyMenu_preview_description_button);
        PreBuyMenu.addButton(language.PreBuyMenu_buy_button + "\n§9" + language.PreBuyMenu_buy_description_button);
    if (player.isOP() == true) {
        PreBuyMenu.addButton("§c" + language.PreBuyMenu_takedown_button + "\n§e[" + language.PreBuyMenu_takedown_description_button +"]");
    }
    player.sendForm(PreBuyMenu, function(player, SubPreBuyID) {
        BuySubMenu(player, PreBuyID, SubPreBuyID);
    });
}

function MainMenu(player) {
    let TradeMenu = mc.newSimpleForm();
        TradeMenu.setTitle(language.MainMenu_title);
        TradeMenu.setContent("§c" + language.MainMenu_tip_info);
        TradeMenu.addButton(language.MainMenu_view_button + "\n§9" + language.MainMenu_view_description_button);
        TradeMenu.addButton(language.MainMenu_take_down_button + "\n§9" + language.MainMenu_take_down_description_button);
        TradeMenu.addButton(language.MainMenu_edit_button + "\n§9" + language.MainMenu_edit_description_button);
        TradeMenu.addButton(language.MainMenu_view_record_button + "\n§9" + language.MainMenu_view_record_description_button);
    player.sendForm(TradeMenu,function(Tradeplayer, id) {
        market = JSON.parse(File.readFrom(market_path));
        OffShelf();
        switch (id) {
            case 0:
                MarketMenu(Tradeplayer, market);
                break;
            case 1:
                let HandItem = Tradeplayer.getHand();
                let ItemNbt = HandItem.getNbt().toSNBT();
                let BanItemResult = false;
                let BanItems = niaconfig.get("BanItems");
                for (let i = 0; i < BanItems.length; i++) {
                    if (HandItem.type == BanItems[i].type && HandItem.aux == BanItems[i].aux ||HandItem.type == BanItems[i].type && BanItems[i].aux == -1) {
                        BanItemResult = true;
                    }
                }
                if (ItemNbt == "{\"Count\":0b,\"Damage\":0s,\"Name\":\"\",\"WasPickedUp\":0b}" || ItemNbt == "{\"Count\":0b,\"Damage\":0s,\"Name\":\"\",\"WasPickedUp\":1b}") {
                    Tradeplayer.tell("§c>> " + language.err_empty_info)
                } else if(!BanItemResult) {
                    let AddItemMenu = mc.newCustomForm();
                    AddItemMenu.setTitle(language.OnShelfMenu_title);
                    AddItemMenu.addLabel("§c" + language.OnShelfMenu_info);
                    AddItemMenu.addLabel("§e" + language.OnShelfMenu_nbt_info + ":\n" + ItemNbt + "\n ");
                    AddItemMenu.addInput(language.OnShelfMenu_name_input, language.OnShelfMenu_name_description_input);
                    AddItemMenu.addInput(language.OnShelfMenu_description_input, language.OnShelfMenu_description_description_input);
                    AddItemMenu.addInput(language.OnShelfMenu_price_input, language.OnShelfMenu_price_description_input);
                    Tradeplayer.sendForm(AddItemMenu,function(AddItemPlayer, AddItemDates) {
                        if (AddItemDates == null) {
                            AddItemPlayer.tell("§c>> " + language.cancel_operation_info);
                        } else if (AddItemDates[2] == "" || AddItemDates[4] == "") {
                            AddItemPlayer.tell("§c>> " + language.err_take_down_info);
                        } else {
                            let PreAddItem = {};
                            PreAddItem.ID = niaconfig.get("marketID");
                            niaconfig.set("marketID", niaconfig.get("marketID") + 1);
                            PreAddItem.player = AddItemPlayer.realName;
                            PreAddItem.name = AddItemDates[2];
                            PreAddItem.description = AddItemDates[3];
                            PreAddItem.type = "item";
                            let havenum = containsNumber(AddItemDates[4])
                            if (havenum) {
                                PreAddItem.price = parseInt(AddItemDates[4]);
                            } else {
                                AddItemPlayer.tell("§c>> " + language.err_price_format_info);
                                PreAddItem.price = 10000;
                            }
                            PreAddItem.nbt = ItemNbt;
                            PreAddItem.enabled = true;
                            PreAddItem.reason = "";
                            if (niaconfig.get("AutoOffShelfTime") == -1) {
                                PreAddItem.endTime = "2099-12-31 12:00:00";
                            } else {
                                let time = new Date();
                                time.setTime(new Date().getTime() + 3600000 * niaconfig.get("AutoOffShelfTime"));
                                if (time.getMonth() < 9) {
                                    endMonth = 1 + time.getMonth();
                                    endMonth = "0" + endMonth;
                                } else {
                                    endMonth = 1 + time.getMonth();
                                }
                                if (time.getDate() < 10) {
                                    endDate = "0" + time.getDate();
                                } else {
                                    endDate = time.getDate();
                                }
                                if (time.getHours() < 10) {
                                    endHour = "0" + time.getHours();
                                } else {
                                    endHour = time.getHours();
                                }
                                if (time.getMinutes() < 10) {
                                    endMinute = "0" + time.getMinutes();
                                } else {
                                    endMinute = time.getMinutes();
                                }
                                if (time.getSeconds() < 10) {
                                    endSecond = "0" + time.getSeconds();
                                } else {
                                    endSecond = time.getSeconds();
                                }
                                PreAddItem.endTime = time.getFullYear() + "-" + endMonth + "-" + endDate + " " + endHour + ":" + endMinute + ":" + endSecond;
                            }
                            market.push(PreAddItem);
                            File.writeTo(market_path,JSON.stringify(market, null, 2));
                            //////////////////////////////////////////
                            let haveItems = Tradeplayer.getInventory().getAllItems();
                            for(let i = 0; i < haveItems.length; i++) {
                                let item = haveItems[i];
                                if (item.getNbt().toString() == NBT.parseSNBT(PreAddItem.nbt).toString()) {
                                    item.setNull();
                                    Tradeplayer.refreshItems();
                                    Tradeplayer.tell("§e>> " + language.onshelf_success_info);
                                    break;
                                }
                            }
                            //////////////////////////////////////////
                        }
                    })
                } else if(BanItemResult) {
                    Tradeplayer.tell("§c>> " + language.err_onshelf_banitem_info);
                }
                break;
            case 2:
                let PlShopMenu = mc.newSimpleForm();
                    PlShopMenu.setTitle(language.OpOnShelfMenu_title);
                let haveItems = false;
                    for (let i = 0; i < market.length; i++) {
                        if (market[i].player == Tradeplayer.realName) {
                            if (market[i].enabled) {
                                PlShopMenu.addButton("§1[§r§9" + language.enable_true_button1 + "§r] " + market[i].name + "§r " + language.enable_true_button2 + "：§9 " + market[i].price + "§9\n" + market[i].description);
                            } else {
                                PlShopMenu.addButton("§r§c[" + language.enable_false_button1 + "] §r" + market[i].name + "§9\n" + language.enable_false_button2 + "：" + market[i].reason);
                            }
                            haveItems = true;
                        }
                    }
                if (!haveItems) {
                    PlShopMenu.setContent("§c" + language.item_null_info);
                }
                Tradeplayer.sendForm(PlShopMenu,function(OpItemsPlayer, OpItemsID) {
                    if (OpItemsID == null) {
                        OpItemsPlayer.tell("§c>> " + language.cancel_operation_info);
                    } else {
                        for (let i = 0; i < market.length; i++) {
                            if (market[i].player != Tradeplayer.realName) {
                                if (i <= OpItemsID) {
                                    OpItemsID++;
                                }
                            }
                        }
                        if (market[OpItemsID].enabled) {
                            let editItemMenu = mc.newSimpleForm();
                            editItemMenu.setTitle(language.chose_op_itemMenu_title);
                            editItemMenu.addButton(language.chose_op_itemMenu_edit_button);
                            editItemMenu.addButton(language.chose_op_itemMenu_take_down_button);
                            OpItemsPlayer.sendForm(editItemMenu,function(editItemPlayer, editItemID) {
                                switch (editItemID) {
                                    case 0:
                                        let editMenu = mc.newCustomForm();
                                            editMenu.setTitle(language.edit_itemMenu_title);
                                            editMenu.addInput(language.OnShelfMenu_name_input, language.OnShelfMenu_name_description_input, market[OpItemsID].name);
                                            editMenu.addInput(language.OnShelfMenu_description_input, language.OnShelfMenu_description_description_input, market[OpItemsID].description);
                                            editMenu.addInput(language.OnShelfMenu_price_input, language.OnShelfMenu_price_description_input, market[OpItemsID].price.toString());
                                            editItemPlayer.sendForm(editMenu,function(editItemPlayer, editItemDates) {
                                                if (editItemDates == null) {
                                                    editItemPlayer.tell("§c>> " + language.cancel_operation_info);
                                                } else if (editItemDates[0] == "" || editItemDates[2] == "") {
                                                    editItemPlayer.tell("§c>> " + language.err_take_down_info);
                                                } else {
                                                    market[OpItemsID].name = editItemDates[0];
                                                    market[OpItemsID].description = editItemDates[1];
                                                    let havenum = containsNumber(editItemDates[2])
                                                    if (havenum) {
                                                        market[OpItemsID].price = parseInt(editItemDates[2]);
                                                        editItemPlayer.tell(language.err_price_format_info)
                                                    } else {
                                                        market[OpItemsID].price = 10000;
                                                    }
                                                    File.writeTo(market_path,JSON.stringify(market, null, 2));
                                                    Tradeplayer.tell("§e>> " + language.edit_item_success_info);
                                                }
                                            })
                                        break;
                                    case 1:
                                        let result = OpItemsPlayer.getInventory().addItemToFirstEmptySlot(mc.newItem(NBT.parseSNBT(market[OpItemsID].nbt)));
                                        OpItemsPlayer.refreshItems();
                                        if (result) {
                                            OpItemsPlayer.tell("§e>> " + language.item_back_info);
                                            market.splice(OpItemsID,1);
                                            File.writeTo(market_path,JSON.stringify(market, null, 2));
                                        } else {
                                            OpItemsPlayer.tell("§c>> " + language.err_give_item_info);
                                        }
                                        break;
                                }
                            });
                        } else {
                            let result = OpItemsPlayer.getInventory().addItemToFirstEmptySlot(mc.newItem(NBT.parseSNBT(market[OpItemsID].nbt)));
                            OpItemsPlayer.refreshItems();
                            if (result) {
                                OpItemsPlayer.tell("§e>> " + language.item_back_info);
                                market.splice(OpItemsID,1);
                                File.writeTo(market_path,JSON.stringify(market, null, 2));
                            } else {
                                OpItemsPlayer.tell("§c>> " + language.err_give_item_info);
                            }
                        }
                    }
                })
                break;
            case 3:
                PlayerTradeDate = JSON.parse(File.readFrom(PlayerTradeDate_path));
                let Tradeinfo = mc.newCustomForm();
                    Tradeinfo.setTitle(language.TradeDateMenu_title);
                    let havedate = false;
                    for (let i = 0; i <PlayerTradeDate.length; i++) {
                        if (PlayerTradeDate[i].seller == Tradeplayer.realName) {
                            Tradeinfo.addLabel("§e【" + language.TradeDateMenu_sell_info1 + "】 " + language.TradeDateMenu_sell_info2 + " " + PlayerTradeDate[i].ID + "\n" + language.TradeDateMenu_sell_info3 + ": " + PlayerTradeDate[i].buyer + "\n" + language.TradeDateMenu_sell_info4 + "： " + PlayerTradeDate[i].endtime + "\n" + language.TradeDateMenu_sell_info5 + "： " + PlayerTradeDate[i].date.price + "\n" + language.TradeDateMenu_sell_info6 + "： " + PlayerTradeDate[i].date.name + "\n§r§e" + language.TradeDateMenu_sell_info7 + "： " + PlayerTradeDate[i].date.description + "\n§r§e" + language.TradeDateMenu_sell_info8 + "： " + PlayerTradeDate[i].date.nbt + "\n ");
                            havedate = true;
                        } else if (PlayerTradeDate[i].buyer == Tradeplayer.realName) {
                            Tradeinfo.addLabel("§e【" + language.TradeDateMenu_buy_info1 + "】 " + language.TradeDateMenu_sell_info2 + " " + PlayerTradeDate[i].ID + "\n" + language.TradeDateMenu_sell_info3 + ": " + PlayerTradeDate[i].buyer + "\n" + language.TradeDateMenu_sell_info4 + "： " + PlayerTradeDate[i].endtime + "\n" + language.TradeDateMenu_sell_info5 + "： " + PlayerTradeDate[i].date.price + "\n" + language.TradeDateMenu_sell_info6 + "： " + PlayerTradeDate[i].date.name + "\n§r§e" + language.TradeDateMenu_sell_info7 + "： " + PlayerTradeDate[i].date.description + "\n§r§e" + language.TradeDateMenu_sell_info8 + "： " + PlayerTradeDate[i].date.nbt + "\n ");
                            havedate = true;
                        }
                    }
                    if (!havedate) {
                        Tradeinfo.addLabel("§c" + language.TradeDateMenu_date_null_info)
                    }
                Tradeplayer.sendForm(Tradeinfo,function(pl, date) {})
                break;
        }
    })
}



if (typeof(niaconfig.get("MoneyScoresBoardName"))=='string') {
    if (!niaconfig.get("llmoney")) {
        var MONEY = niaconfig.get("MoneyScoresBoardName");
    }
    setTimeout(function() {mc.listen("onJoin",function(pl) {
        Playmoney = JSON.parse(File.readFrom(Playmoney_path));
        let result = true;
        for (let i = 0; i < Playmoney.length; i++) {
            if (Playmoney[i].name == pl.realName && Playmoney[i].money != 0) {
                pl.tell("§e>> " + pl.realName + " " + language.GiveMoneyOffline_info1 + " " + Playmoney[i].money + " " + language.GiveMoneyOffline_info2 + "");
                if (niaconfig.get("llmoney")) {
                    money.add(pl.xuid,Playmoney[i].money);
                } else {
                    pl.addScore(MONEY, Playmoney[i].money);
                }
                Playmoney[i].money = 0;
                File.writeTo(Playmoney_path,JSON.stringify(Playmoney, null, 2));
                result = false;
                break;
            } else if (Playmoney[i].name == pl.realName && Playmoney[i].money == 0) {
                result = false;
                break;
            }
        }
        if (result) {
            let addPlayer = {}
            addPlayer.name = pl.realName;
            addPlayer.money = 0;
            Playmoney.push(addPlayer);
            File.writeTo(Playmoney_path,JSON.stringify(Playmoney, null, 2));
        }
    });}, 1000);

    mc.listen("onServerStarted", () => {
        let cmdOpenGUI = mc.newCommand("opentradegui", "对特定对象打开trade的GUI", PermType.GameMasters);
            cmdOpenGUI.mandatory("player",ParamType.Player);
            cmdOpenGUI.overload(["player"]);
        cmdOpenGUI.setCallback((cmd, origin, out, res) => {
            for (let i = 0; i < res.player.length; i++) {
                MainMenu(res.player[i]);
            }
        })
        cmdOpenGUI.setup();

        let cmdTrade = mc.newCommand("trade", language.TradeCmd_description, PermType.Any);
            cmdTrade.overload([]);
        cmdTrade.setCallback((cmdTrade, origin, out, res) =>{
            MainMenu(origin.player);
        })
        cmdTrade.setup();
    })
} else {
    logger.error("启动错误，配置文件的经济计分板名称类型错误！");
}
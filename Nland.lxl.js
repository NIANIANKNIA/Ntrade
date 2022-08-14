//LiteXLoader Dev Helper
/// <reference path="d:\minecraftserver\bedrock-server-1.18.32.02\plugins/Library/JS/Api.js" />

////////////////////////////////////////////////////////////////
//关于本插件的一些基本信息
//作者：NIANIANKNIA
//联系方式：邮箱：admin@mcnia.top QQ：1020317403
//在本插件的制作中特别鸣谢 LandEx提供了部分思路！
//本插件仅用于NIA服务器的运行！不会进行公开！！！
//如果你看到公开的版本，那么一定是本插件意外泄露，请联系作者处理，谢谢！！！
////////////////////////////////////////////////////////////////

//文件相关位置定义

const config_path = './plugins/NLand/config.json';
const LandDate_path = './plugins/NLand/LandDate.json';
const LandHistory_path = './plugins/NLand/LandHistory.json';
const LandIndex_path = './plugins/NLand/LandIndex.json';
const Playmoney_path = './plugins/NLand/playmoney.json';


//本插件基本信息定义

const PLUGIN_NAME = "Nland";
const PLUGIN_DESCRIPTION = "Nland -- NIA服务器圈地插件";
const VERSION = [1,0,0];
const AUTHOR = "NIANIANKNIA";

//插件日志消息标头

logger.setTitle(`${PLUGIN_NAME}`);
logger.setConsole(true, 4);

log("Nland 加载成功！");

//配置文件

let config = new JsonConfigFile(config_path);
    config.init("PrivateLandID", 10000);
    config.init("OrganizationLandID", 50000);
    config.init("economy", {llmoney:false,moneyScoreboard:"money"});
    config.init("recycleRate",0.9);
    config.init("limit",{dimid:[0,1,2],type2DSquare:[100,100000],type3DVolume:[100,3840000],typeCircle:[6,200]});
    config.init("price",{type2D:200,type3D:{XZ:2,Y:1},typeCircle:10});
    config.init("operator",[]);

//定义一些全局变量
var LandIndex = {};
var TeskID = {};

//统一货币操作相关API
const moneyAPI = {

    /**
     * 获取玩家对象player有多少余额
     * @param {object} player
     * @returns {number} 玩家的货币余额
     */
    Get(player) {
        if(config.get("economy").llmoney) {
            return money.get(player.xuid);
        } else {
            return player.getScore(config.get("economy").moneyScoreboard);
        }
    },

    /**
     * 给Xuid为playerXuid玩家增添count数目的货币
     * @param {number} playerXuid
     * @param {number} count
     */
    Add(playerXuid,count){
        if(config.get("economy").llmoney) {
            //这里相当于一个在线检测
            if(PlayerIsOnline(playerXuid)) {
                money.add(playerXuid,count);
                return;
            } else {
                //不在线的话进行写入相关文件
                let Playmoney = JSON.parse(File.readFrom(Playmoney_path) || "{}");
                if(isEmptyObject(Playmoney)) {
                    Playmoney[playerXuid] = count;
                } else {
                    let HaveDate = false;
                    for (let xuid in Playmoney) {
                        if (xuid == playerXuid) {
                            Playmoney[xuid] = Playmoney[xuid] + count;
                            HaveDate = true;
                            break;
                        }
                    }
                    if(!HaveDate) {
                        Playmoney[playerXuid] = count;
                    }
                }
                File.writeTo(Playmoney_path,JSON.stringify(Playmoney, null, 2));
            }
        } else {
            //还是一个在线检测
            if(PlayerIsOnline(playerXuid)) {
                mc.getPlayer(playerXuid).addScore(config.get("economy").moneyScoreboard,count)
            } else {
                let Playmoney = JSON.parse(File.readFrom(Playmoney_path) || "{}");
                if(isEmptyObject(Playmoney)) {
                    Playmoney[playerXuid] = count;
                } else {
                    let HaveDate = false;
                    for (let xuid in Playmoney) {
                        if (xuid == playerXuid) {
                            Playmoney[xuid] = Playmoney[xuid] + count;
                            HaveDate = true;
                            break;
                        }
                    }
                    if(!HaveDate) {
                        Playmoney[playerXuid] = count;
                    }
                }
                File.writeTo(Playmoney_path,JSON.stringify(Playmoney, null, 2));
            }
        }
    },

    /**
     * 给玩家对象player减少count数目的货币
     * @param {object} player
     * @param {number} count
     * @returns {number} 是否成功减少
     */
     Reduce(player,count){
        if(config.get("economy").llmoney) {
            if (this.Get(player) >= count) {
                money.reduce(player.xuid,count);
                return true;
            }
            return false;
        } else {
            if (this.Get(player) >= count) {
                player.reduceScore(config.get("economy").moneyScoreboard,count);
                return true;
            }
            return false;
        }
    }

}

//统一的圈地API
const LandingAPI = {
    /**
     * 圈地的时候显示的actionbar
     * @param {object} player
     * @param {Array} pos1
     * @param {Array} pos2
     * @param {Array} dimid
     */
    ShowActionbar(player,pos1,pos2,dimid) {
        if (pos1.length == 0) {
            pos1 = "未选择相应框选点"
        } else {
            pos1 = `(${pos1[0]},${pos1[1]},${pos1[2]})`;
        }
        if (pos2.length == 0) {
            pos2 = "未选择相应框选点"
        } else {
            pos2 = `(${pos2[0]},${pos2[1]},${pos2[2]})`
        }

        switch (dimid) {
            case -1:
                dimid = "未选择相关维度";
                break;
            case 0:
                dimid = "主世界";
                break;
            case 1:
                dimid = "下界";
                break;
            case 2:
                dimid = "末地";
                break;
        }
        player.tell(`当前框选点1： ${pos1}\n当前框选点2： ${pos2}\n当前维度： ${dimid}`,5);
    },

    /**
     * 圈地的时候开始显示actionbar
     * @param {object} player
     * @param {Array} pos1
     * @param {Array} pos2
     * @param {Array} dimid
     */
    StartShow(player,pos1,pos2,dimid) {
        return setInterval (function() {LandingAPI.ShowActionbar(player,pos1,pos2,dimid)},500);
    },

    /**
     * 圈地的时候停止显示actionbar
     * @param {object} player
     */
    StopShow(player){
        if(!isEmptyObject(TeskID)) {
            for (let xuid in TeskID) {
                if (xuid == player.xuid) {
                    clearInterval(TeskID[xuid]);
                    delete TeskID[xuid];
                    break;
                }
            }
        }
    }

}

//统一的GUI API
const guiAPI = {

    /**
     * 给玩家对象player发送圈地主菜单
     * @param {object} player
     */
    Main(player) {
        let MainMenu = mc.newSimpleForm();
            MainMenu.setTitle("圈地主菜单");
            MainMenu.addButton("传送到我的领地");
            MainMenu.addButton("管理自己的领地");
            MainMenu.addButton("购买出售中领地");
            MainMenu.addButton("开始圈地");
            player.sendForm(MainMenu,function(player, id) {
                if (id == null) {
                    return;
                }
                switch (id) {
                    case 0:
                        break;
                    case 1:
                        break;
                    case 2:
                        break;
                    case 3:
                        guiAPI.Land(player);
                        break;
                }
            })
    },

    /**
     * 给玩家对象player发送圈地菜单
     * @param {object} player
     */
    Land(player) {
        let LandMenu = mc.newSimpleForm();
            LandMenu.setTitle("圈地菜单");
            LandMenu.addButton("恢复上回圈地数据");
            LandMenu.addButton("设置框选点1");
            LandMenu.addButton("设置框选点2");
            LandMenu.addButton("手动改变坐标");
            LandMenu.addButton("确认圈地范围");
            LandMenu.addButton("退出圈地模式");
            LandMenu.addButton("返回上一页");
        player.sendForm(LandMenu,function(player,id) {
            if (id == null) {
                return;
            }
            let LandHistory = JSON.parse(File.readFrom(LandHistory_path) || "{}");
            switch (id) {
                case 0:
                    HaveHistory = false;
                    for (let Xuid in LandHistory) {
                        if (player.xuid == Xuid) {
                            LandingAPI.StopShow(player);
                            TeskID[Xuid] = LandingAPI.StartShow(player,LandHistory[Xuid].pos1,LandHistory[Xuid].pos2,LandHistory[Xuid].dimid);
                            HaveHistory = true;
                            break;
                        }
                    }
                    //如果没有历史记录则创建相关历史记录文件
                    if (!HaveHistory) {
                        let CreateHistoryDate = {};
                        CreateHistoryDate.name = player.realName;
                        CreateHistoryDate.type = "";
                        CreateHistoryDate.is_private = "";
                        CreateHistoryDate.pos1 = [];
                        CreateHistoryDate.pos2 = [];
                        CreateHistoryDate.dimid = -1;
                        LandHistory[player.xuid] = CreateHistoryDate;
                        File.writeTo(LandHistory_path,JSON.stringify(LandHistory, null, 2));
                        player.sendToast("§e系统提示","未找到相应数据，已自动生成初始化数据！");
                        TeskID[player.xuid] = LandingAPI.StartShow(player,LandHistory[player.xuid].pos1,LandHistory[player.xuid].pos2,LandHistory[player.xuid].dimid);
                    }
                    break;
                case 1:
                    HaveHistory = false;
                    for (let Xuid in LandHistory) {
                        if (player.xuid == Xuid) {
                            //啊，pos1就作为维度基础吧，不做维度判断力
                            LandingAPI.StopShow(player);
                            LandHistory[Xuid].pos1 = [parseInt(player.pos.x),parseInt(player.pos.y) - 1,parseInt(player.pos.z)];
                            LandHistory[Xuid].dimid = player.pos.dimid;
                            File.writeTo(LandHistory_path,JSON.stringify(LandHistory, null, 2));
                            TeskID[Xuid] = LandingAPI.StartShow(player,LandHistory[Xuid].pos1,LandHistory[Xuid].pos2,LandHistory[Xuid].dimid);
                            HaveHistory = true;
                            break;
                        }
                    }
                    //如果没有历史记录则创建相关历史记录文件
                    if (!HaveHistory) {
                        LandingAPI.StopShow(player);
                        let CreateHistoryDate = {};
                        CreateHistoryDate.name = player.realName;
                        CreateHistoryDate.type = "";
                        CreateHistoryDate.is_private = "";
                        CreateHistoryDate.pos1 = [parseInt(player.pos.x),parseInt(player.pos.y),parseInt(player.pos.z)];
                        CreateHistoryDate.pos2 = [];
                        CreateHistoryDate.dimid = player.pos.dimid;
                        LandHistory[player.xuid] = CreateHistoryDate;
                        File.writeTo(LandHistory_path,JSON.stringify(LandHistory, null, 2));
                        player.sendToast("§e系统提示","未找到相应数据，已自动生成初始化数据！");
                        TeskID[player.xuid] = LandingAPI.StartShow(player,LandHistory[player.xuid].pos1,LandHistory[player.xuid].pos2,LandHistory[player.xuid].dimid);
                    }
                    break;
                case 2:
                    HaveHistory = false;
                    for (let Xuid in LandHistory) {
                        if (player.xuid == Xuid) {
                            //啊，pos1就作为维度基础把，不做维度判断力
                            LandingAPI.StopShow(player);
                            if (LandHistory[Xuid].dimid != player.pos.dimid && LandHistory[Xuid].dimid != -1) {
                                player.tell("§c>> 框选点2坐标维度与框选点1坐标维度不相同，请在同一维度圈地！若要更换维度，请重新选择框选点1的坐标");
                                TeskID[Xuid] = LandingAPI.StartShow(player,LandHistory[Xuid].pos1,LandHistory[Xuid].pos2,LandHistory[Xuid].dimid);
                                break;
                            }
                            LandHistory[Xuid].pos2 = [parseInt(player.pos.x),parseInt(player.pos.y),parseInt(player.pos.z)];
                            LandHistory[Xuid].dimid = player.pos.dimid;
                            File.writeTo(LandHistory_path,JSON.stringify(LandHistory, null, 2));
                            TeskID[Xuid] = LandingAPI.StartShow(player,LandHistory[Xuid].pos1,LandHistory[Xuid].pos2,LandHistory[Xuid].dimid);
                            HaveHistory = true;
                            break;
                        }
                    }
                    //如果没有历史记录则创建相关历史记录文件
                    if (!HaveHistory) {
                        LandingAPI.StopShow(player);
                        let CreateHistoryDate = {};
                        CreateHistoryDate.name = player.realName;
                        CreateHistoryDate.type = "";
                        CreateHistoryDate.is_private = "";
                        CreateHistoryDate.pos1 = [];
                        CreateHistoryDate.pos2 = [parseInt(player.pos.x),parseInt(player.pos.y),parseInt(player.pos.z)];
                        CreateHistoryDate.dimid = player.pos.dimid;
                        LandHistory[player.xuid] = CreateHistoryDate;
                        File.writeTo(LandHistory_path,JSON.stringify(LandHistory, null, 2));
                        player.sendToast("§e系统提示","未找到相应数据，已自动生成初始化数据！");
                        TeskID[player.xuid] = LandingAPI.StartShow(player,LandHistory[player.xuid].pos1,LandHistory[player.xuid].pos2,LandHistory[player.xuid].dimid);
                    }
                    break;
                case 3:
                    break;
                case 4:
                    if (!TeskID[player.xuid]) {
                        //
                        player.tell("§c>> 未找到相应的数据文件，请先开始圈地模式！");
                    } else {
                        //创建文件的时候是否同一领地，然后配置项写入
                        let haveDate = false;
                        for (let xuid in LandHistory) {
                            if (player.xuid == xuid) {
                                haveDate = true;
                                //先检查缓存数据是否齐全
                                if (LandHistory[xuid].pos1.length == 3 && LandHistory[xuid].pos2.length == 3 && LandHistory[xuid].dimid != -1) {
                                    //如果都没有就开始选择相应的地皮类型（2d 3d）
                                    LandingAPI.StopShow(player);
                                    guiAPI.ChoseLandType(player,LandHistory);
                                } else {
                                    player.tell("§c>> 数据不全，请框选连两个坐标后继续本操作！")
                                    //缓存数据不齐全直接结束
                                    break;
                                }
                                break;
                            }
                        }
                        if (!haveDate) {
                            player.tell("§c>> 未找到相应的数据文件，请先开始圈地模式！");
                        }
                    }
                    // File.writeTo(LandHistory_path,JSON.stringify(LandHistory, null, 2));
                    break;
                case 5:
                    if(!isEmptyObject(TeskID)) {
                        for (let xuid in TeskID) {
                            if (xuid == player.xuid) {
                                clearInterval(TeskID[xuid]);
                                delete TeskID[xuid];
                                break;
                            }
                        }
                    }
                    break;
                case 6:
                    guiAPI.Main(player);
                    break;
            }
        })
    },

    /**
     * 给玩家对象player发送选择地皮类型的菜单
     * @param {object} player
     * @param {object} LandHistory
     */
    ChoseLandType(player,LandHistory) {
        let ChoseLandTypeMenu = mc.newSimpleForm();
            ChoseLandTypeMenu.setTitle("选择圈地类型");
            ChoseLandTypeMenu.addButton("2D类型地皮\n§9直上直下的地皮，最安全");
            ChoseLandTypeMenu.addButton("3D类型地皮\n§9按照提供的坐标，最实惠");
        player.sendForm(ChoseLandTypeMenu, function(player, id) {
            if (id == null) {
                player.tell("§c>> 你取消了本次圈地！")
            } else {
                switch (id) {
                    case 0:
                        LandHistory[player.xuid].type = "2D";
                        break;
                    case 1:
                        LandHistory[player.xuid].type = "3D";
                        break;
                }
                File.writeTo(LandHistory_path,JSON.stringify(LandHistory, null, 2));
                //然后选择地皮类型（私人 公会）这里landhis还要加东西
                guiAPI.IsPrivateType(player,LandHistory);
            }
        });
    },

    /**
     * 给玩家对象player发送选择是否为公会地皮的表单
     * @param {object} player
     * @param {object} LandHistory
     */
     IsPrivateType(player,LandHistory) {
        let IsPrivateTypeMenu = mc.newSimpleForm();
            IsPrivateTypeMenu.setTitle("选择地皮类型");
            IsPrivateTypeMenu.addButton("私人地皮\n§9自己的地皮，可以添加共享玩家");
            IsPrivateTypeMenu.addButton("公会地皮\n§9公会共享地皮，整个公会共享");
        player.sendForm(IsPrivateTypeMenu, function(player, id) {
            if (id == null) {
                player.tell("§c>> 你取消了本次圈地！")
            } else {
                switch (id) {
                    case 0:
                        LandHistory[player.xuid].is_private = true;
                        break;
                    case 1:
                        LandHistory[player.xuid].is_private = false;
                        break;
                }
                //文件重载
                File.writeTo(LandHistory_path,JSON.stringify(LandHistory, null, 2));
                LandHistory = JSON.parse(File.readFrom(LandHistory_path));
                LandDate = JSON.parse(File.readFrom(LandDate_path) || "{}");
                let xuid = player.xuid;
                let type = LandHistory[xuid].type;
                let is_private = LandHistory[xuid].is_private;
                if (type != "" && is_private != "") {
                    switch (type) {
                        case "2D":
                            POS1 = LandHistory[xuid].pos1;
                            POS2 = LandHistory[xuid].pos2;
                            DIMID = LandHistory[xuid].dimid;
                            POS1[1] = -64;
                            POS2[1] = 320;
                            break;
                        case "3D":
                            POS1 = LandHistory[xuid].pos1;
                            POS2 = LandHistory[xuid].pos2;
                            DIMID = LandHistory[xuid].dimid;
                            break;
                    }
                    //开始计算地皮数据是否重叠
                    if (HaveLand(POS1, POS2, DIMID)) {
                        player.tell("§c>> 新建地皮与已有的地皮重合，请重新框选！");
                    } else {
                        //还有个体积计算，不符合大小的无法圈地
                        //根据地皮类型的不同计算不同的价格
                        switch (type) {
                            case "2D":
                                LandPrice = Math.abs(POS1[0] - POS2[0]) * Math.abs(POS1[2] - POS2[2]) * config.get("price").type2D;
                                break;
                            case "3D":
                                LandPrice = Math.abs(POS1[0] - POS2[0]) * Math.abs(POS1[1] - POS2[1]) * Math.abs(POS1[2] - POS2[2]) * config.get("price").type3D.XZ;
                                break;
                        }
                        //然后选择地皮类型(私人/公会)，然后扣钱
                        if(moneyAPI.Get(player) >= LandPrice) {
                            player.sendModalForm(`购买确定`,`§e您即将使用 ${LandPrice} 金币,购买一块地皮\n您当前余额：${moneyAPI.Get(player)} \n请选择是否购买！`,`确定`,`取消`,function(player,result) {
                                if (result == null || result == false) {
                                    player.tell("§c>> 你取消了本次操作！")
                                } else {
                                    //然后扣钱
                                    moneyAPI.Reduce(player,LandPrice);
                                    //开始写入文件
                                    if(LandHistory[xuid].is_private) {
                                        //私人领地的文件写入
                                        let NewLandDate = {};
                                        NewLandDate.type = LandHistory[xuid].type;
                                        NewLandDate.pos1 = LandHistory[xuid].pos1;
                                        NewLandDate.pos2 = LandHistory[xuid].pos2;
                                        NewLandDate.dimid = LandHistory[xuid].dimid;
                                        NewLandDate.LandName = `${player.realName}的私人领地`;
                                        NewLandDate.owner = player.xuid;
                                        NewLandDate.ownerName = player.realName;
                                        NewLandDate.private = true;
                                        NewLandDate.allowList = [];
                                        NewLandDate.banList = [];
                                        NewLandDate.teleport = [];
                                        //开始写入开始的事件配置
                                        let events = {};
                                        //是否可以摧毁方块
                                        events.DestroyBlock = false;
                                        //操作物品展示框
                                        events.UseFrameBlock = false;
                                        //放置方块
                                        events.PlaceBlock = false;
                                        //打开箱子等GUI容器
                                        events.OpenContainer = false;
                                        //攻击实体
                                        events.AttackEntity = false;
                                        //使用部分工具/开关门
                                        events.UseItemOn = false;
                                        //耕地退化
                                        events.FarmLandDecay = false;
                                        //操作盔甲架
                                        events.ChangeArmorStand = false;
                                        //捡起物品
                                        events.TakeItem = true;
                                        //扔出物品
                                        events.DropItem = true;
                                        //外界流体流入领地内
                                        events.LiquidFlow = false;
                                        NewLandDate.events = events;
                                        PrivateID = config.get("PrivateLandID");
                                        LandDate[PrivateID] = NewLandDate;
                                        //更新内存中的索引值
                                        calculateIndex(LandHistory[xuid].pos1, LandHistory[xuid].pos2, LandHistory[xuid].dimid, PrivateID, LandIndex);
                                        config.set("PrivateLandID", config.get("PrivateLandID") + 1);
                                    } else {
                                        //公会领地的文件写入
                                        let NewLandDate = {};
                                        NewLandDate.type = LandHistory[xuid].type;
                                        NewLandDate.pos1 = LandHistory[xuid].pos1;
                                        NewLandDate.pos2 = LandHistory[xuid].pos2;
                                        NewLandDate.dimid = LandHistory[xuid].dimid;
                                        NewLandDate.LandName = `${player.realName}的公会领地`;
                                        NewLandDate.owner = player.xuid;
                                        NewLandDate.ownerName = player.realName;
                                        NewLandDate.private = false;
                                        NewLandDate.allowList = [];
                                        NewLandDate.banList = [];
                                        NewLandDate.teleport = [];
                                        //开始写入开始的事件配置
                                        let events = {};
                                        //是否可以摧毁方块
                                        events.DestroyBlock = false;
                                        //操作物品展示框
                                        events.UseFrameBlock = false;
                                        //放置方块
                                        events.PlaceBlock = false;
                                        //打开箱子等GUI容器
                                        events.OpenContainer = false;
                                        //攻击实体
                                        events.AttackEntity = false;
                                        //使用部分工具/开关门
                                        events.UseItemOn = false;
                                        //耕地退化
                                        events.FarmLandDecay = false;
                                        //操作盔甲架
                                        events.ChangeArmorStand = false;
                                        //捡起物品
                                        events.TakeItem = true;
                                        //扔出物品
                                        events.DropItem = true;
                                        //外界流体流入领地内
                                        events.LiquidFlow = false;
                                        NewLandDate.events = events;
                                        OrganizationLandID = config.get("OrganizationLandID");
                                        LandDate[OrganizationLandID] = NewLandDate;
                                        //更新内存中的索引值
                                        calculateIndex(LandHistory[xuid].pos1, LandHistory[xuid].pos2, LandHistory[xuid].dimid, OrganizationLandID, LandIndex);
                                        config.set("OrganizationLandID", config.get("OrganizationLandID") + 1);
                                    }
                                    //写入文件
                                    File.writeTo(LandDate_path,JSON.stringify(LandDate, null, 2));
                                    player.sendToast("§e系统提示","领地购买成功，期待您的下次购买！");
                                }
                            })
                        }
                    }
                }
            }
        });
    }
}


//自定义函数

/**
 * 检查xuid为playerXuid的玩家是否在线
 * @param {number} playerXuid
 * @returns {boolean} 玩家是否在线
 */
function PlayerIsOnline (playerXuid) {
    let OnlinePlayers = mc.getOnlinePlayers();
    for (let i = 0; i < OnlinePlayers.length; i++) {
        if (OnlinePlayers[i].xuid == playerXuid) {
            return true;
        }
    };
    return false;
}

/**
 * 判断对象obj是否为空
 * @param {object}
 * @returns {boolean} 对象obj是否为空
 */
function isEmptyObject(obj){
    for (let key in obj) {
        return false;
    };
    return true;
};

/**
 * 判断坐标对应的区块是否有地皮数据
 * @param {Array} pos
 * @param {number} dimid
 * @returns {boolean} 如果不在返回false，如果在则返回所在的地皮数据
 */
function PosInIndex(pos,dimid) {
    //首先读取所有的地皮数据
    //LandIndex = JSON.parse(File.readFrom(LandIndex_path) || "{}");
    //根据传入的坐标计算出相应的区块编号
    let posX = parseInt(pos[0]);
    let posY = parseInt(pos[1]);
    let posZ = parseInt(pos[2]);
    let posDimid = dimid;
    XIndex = parseInt(posX / 16);
    ZIndex = parseInt(posZ / 16);
    //判断该区块内是否有地皮数据，根据数据层层判断
    if(!LandIndex[posDimid] || !LandIndex[posDimid][XIndex] || !LandIndex[posDimid][XIndex][ZIndex]) {
        return false;
    }
    //如果走到了这里说明，该区块编号下有相应的地皮数据存在，然后遍历该区块存在的地皮即可
    let LandDate = JSON.parse(File.readFrom(LandDate_path));
    let ThisIndexDate = LandIndex[posDimid][XIndex][ZIndex]
    for (let key = 0;key < ThisIndexDate.length;key++) {
        //根据相应的地皮类型进行计算
        switch (LandDate[ThisIndexDate[key]].type) {
            //这里判断的就是相应的坐标是否真在该区块所在的地皮之中
            case "3D":
                //就是一个简简单单的数据判断
                resultX = ((posX >= LandDate[ThisIndexDate[key]].pos1[0] && posX <= LandDate[ThisIndexDate[key]].pos2[0]) || (posX <= LandDate[ThisIndexDate[key]].pos1[0] && posX >= LandDate[ThisIndexDate[key]].pos2[0]));
                resultY = ((posY >= LandDate[ThisIndexDate[key]].pos1[1] && posY <= LandDate[ThisIndexDate[key]].pos2[1]) || (posY <= LandDate[ThisIndexDate[key]].pos1[1] && posY >= LandDate[ThisIndexDate[key]].pos2[1]));
                resultZ = ((posZ >= LandDate[ThisIndexDate[key]].pos1[2] && posZ <= LandDate[ThisIndexDate[key]].pos2[2]) || (posZ <= LandDate[ThisIndexDate[key]].pos1[2] && posZ >= LandDate[ThisIndexDate[key]].pos2[2]));
                // log(`${posX} ${posY} ${posZ} + ${resultX} ${resultY} ${resultZ}`);
                if (posDimid == LandDate[ThisIndexDate[key]].dimid && resultX && resultY && resultZ) {
                    return LandDate[ThisIndexDate[key]];
                }
            case "2D":
                resultX = ((posX >= LandDate[ThisIndexDate[key]].pos1[0] && posX <= LandDate[ThisIndexDate[key]].pos2[0]) || (posX <= LandDate[ThisIndexDate[key]].pos1[0] && posX >= LandDate[ThisIndexDate[key]].pos2[0]));
                resultZ = ((posZ >= LandDate[ThisIndexDate[key]].pos1[2] && posZ <= LandDate[ThisIndexDate[key]].pos2[2]) || (posZ <= LandDate[ThisIndexDate[key]].pos1[2] && posZ >= LandDate[ThisIndexDate[key]].pos2[2]));
                if (posDimid == LandDate[ThisIndexDate[key]].dimid && resultX && resultZ) {
                    return LandDate[ThisIndexDate[key]];
                }
            case "cylinder":
                //根据两点间的距离进行相应的判断操作
                let distance = Math.pow(posX - LandDate[ThisIndexDate[key]].pos1[0],2) + Math.pow(posZ - LandDate[ThisIndexDate[key]].pos1[2],2);
                if (Math.pow(ThisIndexDate[key].R,2) >= distance) {
                    return LandDate[ThisIndexDate[key]];
                }
        }
    }
    return false;
}

/**
 * 判断坐标对应的区块是否有地皮数据PLUS版本--将判断范围扩大一圈来解决放置方块，使用物品等范围不够的
 * @param {Array} pos
 * @param {number} dimid
 * @returns {boolean} 如果不在返回false，如果在则返回所在的地皮数据
 */
 function PosInIndexPLUS(pos,dimid) {
    //首先读取所有的地皮数据
    //LandIndex = JSON.parse(File.readFrom(LandIndex_path) || "{}");
    //根据传入的坐标计算出相应的区块编号
    let posX = parseInt(pos[0]);
    let posY = parseInt(pos[1]);
    let posZ = parseInt(pos[2]);
    let posDimid = dimid;
    XIndex = parseInt(posX / 16);
    ZIndex = parseInt(posZ / 16);
    //判断该区块内是否有地皮数据，根据数据层层判断
    if(!LandIndex[posDimid] || !LandIndex[posDimid][XIndex] || !LandIndex[posDimid][XIndex][ZIndex]) {
        return false;
    }
    //如果走到了这里说明，该区块编号下有相应的地皮数据存在，然后遍历该区块存在的地皮即可
    let LandDate = JSON.parse(File.readFrom(LandDate_path));
    let ThisIndexDate = LandIndex[posDimid][XIndex][ZIndex]
    for (let key = 0;key < ThisIndexDate.length;key++) {
        //根据地皮数据返回相关最大最小数据
        LandIndex[ThisIndexDate[key]]
        //根据相应的地皮类型进行计算
        switch (LandDate[ThisIndexDate[key]].type) {
            //这里判断的就是相应的坐标是否真在该区块所在的地皮之中
            case "3D":
                //就是一个简简单单的数据判断
                resultX = ((posX >= LandDate[ThisIndexDate[key]].pos1[0] && posX <= LandDate[ThisIndexDate[key]].pos2[0]) || (posX <= LandDate[ThisIndexDate[key]].pos1[0] && posX >= LandDate[ThisIndexDate[key]].pos2[0]));
                resultY = ((posY >= LandDate[ThisIndexDate[key]].pos1[1] && posY <= LandDate[ThisIndexDate[key]].pos2[1]) || (posY <= LandDate[ThisIndexDate[key]].pos1[1] && posY >= LandDate[ThisIndexDate[key]].pos2[1]));
                resultZ = ((posZ >= LandDate[ThisIndexDate[key]].pos1[2] && posZ <= LandDate[ThisIndexDate[key]].pos2[2]) || (posZ <= LandDate[ThisIndexDate[key]].pos1[2] && posZ >= LandDate[ThisIndexDate[key]].pos2[2]));
                // log(`${posX} ${posY} ${posZ} + ${resultX} ${resultY} ${resultZ}`);
                if (posDimid == LandDate[ThisIndexDate[key]].dimid && resultX && resultY && resultZ) {
                    return LandDate[ThisIndexDate[key]];
                }
            case "2D":
                resultX = ((posX >= LandDate[ThisIndexDate[key]].pos1[0] && posX <= LandDate[ThisIndexDate[key]].pos2[0]) || (posX <= LandDate[ThisIndexDate[key]].pos1[0] && posX >= LandDate[ThisIndexDate[key]].pos2[0]));
                resultZ = ((posZ >= LandDate[ThisIndexDate[key]].pos1[2] && posZ <= LandDate[ThisIndexDate[key]].pos2[2]) || (posZ <= LandDate[ThisIndexDate[key]].pos1[2] && posZ >= LandDate[ThisIndexDate[key]].pos2[2]));
                if (posDimid == LandDate[ThisIndexDate[key]].dimid && resultX && resultZ) {
                    return LandDate[ThisIndexDate[key]];
                }
            case "cylinder":
                //根据两点间的距离进行相应的判断操作
                let distance = Math.pow(posX - LandDate[ThisIndexDate[key]].pos1[0],2) + Math.pow(posZ - LandDate[ThisIndexDate[key]].pos1[2],2);
                if (Math.pow(ThisIndexDate[key].R,2) >= distance) {
                    return LandDate[ThisIndexDate[key]];
                }
        }
    }
    return false;
}

/**
 * 判断玩家坐标对应的区块是否有地皮数据
 * @param {object} player
 * @returns {boolean}
 */
function PlayerInIndex(player) {
    // player.tell(`${player.pos.x} ${player.pos.y} ${player.pos.z}`, 5)
    let LandDate = PosInIndex([player.pos.x, player.pos.y,player.pos.z],player.pos.dimid)
    if(LandDate) {
        player.tell("§b您正在 " + LandDate.LandName + " 中",4);
    }
}


/**
 * 输入坐标范围信息，以及当前的索引值数据，添加索引值,并返回新的索引值
 * @param {Array} pos1
 * @param {Array} pos2
 * @param {number} dimid
 * @param {number} LandUUID
 * @param {object} LandIndex
 */
function calculateIndex(pos1, pos2, dimid, LandUUID, LandIndex) {
    //let LandIndex = JSON.parse(File.readFrom(LandIndex_path) || "{}");
    X1Index = parseInt(pos1[0] / 16);
    Z1Index = parseInt(pos1[2] / 16);
    X2Index = parseInt(pos2[0] / 16);
    Z2Index = parseInt(pos2[2] / 16);
    //将最小的转化为相应索引值
    if (X1Index > X2Index) {
        IndexXMIN = X1Index;
        X1Index = X2Index;
        X2Index = IndexXMIN;
    }
    if (Z1Index > Z2Index) {
        IndexZMIN = Z1Index;
        Z1Index = Z2Index;
        Z2Index = IndexZMIN;
    }
    for (XIndex = X1Index; XIndex <= X2Index; XIndex++) {
        for (ZIndex = Z1Index; ZIndex <= Z2Index; ZIndex++) {
            if (!LandIndex[String(dimid)]) {
                LandIndex[String(dimid)] = {};
            }
            if (!LandIndex[String(dimid)][String(XIndex)]) {
                LandIndex[String(dimid)][String(XIndex)] = {}
            }
            if (!LandIndex[String(dimid)][String(XIndex)][String(ZIndex)]) {
                LandIndex[String(dimid)][String(XIndex)][String(ZIndex)] = [];
            }
            LandIndex[String(dimid)][String(XIndex)][String(ZIndex)].push(LandUUID);
        }
    }
    return LandIndex;
    //File.writeTo(LandIndex_path,JSON.stringify(LandIndex, null, 4));
}

/**
 * 输入坐标范围信息，以及当前的索引值数据，判断地皮有没有重合
 * @param {Array} pos1
 * @param {Array} pos2
 * @param {number} dimid
 */
 function HaveLand(pos1, pos2, dimid) {
    //首先根据输入的地皮坐标构建最大/最小的坐标
    //这里规定最小的坐标为pos1，最大的坐标为pos2
    if (pos1[0] > pos2[0]) {
        posXMin = pos1[0];
        pos1[0] = pos2[0];
        pos2[0] = posXMin;
    }
    if (pos1[1] > pos2[1]) {
        posYMin = pos1[1];
        pos1[1] = pos2[1];
        pos2[1] = posYMin;
    }
    if (pos1[2] > pos2[2]) {
        posZMin = pos1[2];
        pos1[2] = pos2[2];
        pos2[2] = posZMin;
    }
    //
    //根据传入的最小值坐标输出最小
    XIndexMIN = parseInt(pos1[0] / 16);
    ZIndexMIN = parseInt(pos1[2] / 16);
    //
    XIndexMAX = parseInt(pos2[0] / 16);
    ZIndexMAX = parseInt(pos2[2] / 16);
    //判断该区块内是否有地皮数据，根据数据层层判断
    for (let XIndex = XIndexMIN; XIndex <= XIndexMAX; XIndex++) {
        for (let ZIndex = ZIndexMIN; ZIndex <= ZIndexMAX; ZIndex++) {
            //判断该索引值下地皮是否有地皮数据
            if(LandIndex[dimid] && LandIndex[dimid][XIndex] && LandIndex[dimid][XIndex][ZIndex]) {
                //如果走到了这里说明，该区块编号下有相应的地皮数据存在，然后遍历该区块存在的地皮即可
                let LandDate = JSON.parse(File.readFrom(LandDate_path));
                let ThisIndexDate = LandIndex[dimid][XIndex][ZIndex];
                // log("有地皮数据");
                for (let key = 0;key < ThisIndexDate.length;key++) {
                    //根据相应的地皮类型进行计算
                    // log(`haveDate Index: ${XIndex} ${ZIndex}`)
                    switch (LandDate[ThisIndexDate[key]].type) {
                        case "3D":
                            //首先根据输入的地皮坐标构建最大/最小的坐标
                            //这里规定最小的坐标为pos3，最大的坐标为pos4
                            pos3 = LandDate[ThisIndexDate[key]].pos1
                            pos4 = LandDate[ThisIndexDate[key]].pos2
                            if (pos3[0] > pos4[0]) {
                                posXMin = pos3[0];
                                pos3[0] = pos4[0];
                                pos4[0] = posXMin;
                            }
                            if (pos3[1] > pos4[1]) {
                                posYMin = pos3[1];
                                pos3[1] = pos4[1];
                                pos3[1] = posYMin;
                            }
                            if (pos3[2] > pos4[2]) {
                                posZMin = pos3[2];
                                pos3[2] = pos4[2];
                                pos3[2] = posZMin;
                            }
                            // log(`pos1 ${pos1[0]} ${pos1[1]} ${pos1[2]}`);
                            // log(`pos2 ${pos2[0]} ${pos2[1]} ${pos2[2]}`);
                            // log(`pos3 ${pos3[0]} ${pos3[1]} ${pos3[2]}`);
                            // log(`pos4 ${pos4[0]} ${pos4[1]} ${pos4[2]}`);
                            //A B结果是XZ轴判断
                            resultA = ((pos3[0] <= pos1[0]) && (pos4[0] >= pos1[0])) && ((pos3[2] <= pos1[2]) && (pos4[2] >= pos1[2]));
                            resultB = ((pos3[0] <= pos2[0]) && (pos4[0] >= pos2[0])) && ((pos3[2] <= pos2[2]) && (pos4[2] >= pos2[2]));
                            //C D结果是Y轴判断
                            resultC = (pos3[2] <= pos1[2]) && (pos4[2] >= pos1[2]);
                            resultD = (pos3[2] <= pos2[2]) && (pos4[2] >= pos2[2]);
                            // log(`RESULT ${resultA} ${resultB}`)
                            //要是重合那一定满足维度相同，xz轴有重合，y轴有重合，缺一不可
                            if (dimid == LandDate[ThisIndexDate[key]].dimid && (resultA || resultB) && (resultC || resultD)) {
                                return true;
                            }
                            break;
                        case "2D":
                            //首先根据输入的地皮坐标构建最大/最小的坐标
                            //这里规定最小的坐标为pos1，最大的坐标为pos2
                            pos3 = LandDate[ThisIndexDate[key]].pos1
                            pos4 = LandDate[ThisIndexDate[key]].pos2
                            if (pos3[0] > pos4[0]) {
                                posXMin = pos3[0];
                                pos3[0] = pos4[0];
                                pos4[0] = posXMin;
                            }
                            if (pos3[2] > pos4[2]) {
                                posZMin = pos3[2];
                                pos3[2] = pos4[2];
                                pos3[2] = posZMin;
                            }
                            //就是一个简简单单的数据判断
                            resultA = ((pos3[0] <= pos1[0]) && (pos4[0] >= pos1[0])) && ((pos3[2] <= pos1[2]) && (pos4[2] >= pos1[2]))
                            resultB = ((pos3[0] <= pos2[0]) && (pos4[0] >= pos2[0])) && ((pos3[2] <= pos2[2]) && (pos4[2] >= pos2[2]))
                            if (dimid == LandDate[ThisIndexDate[key]].dimid && (resultA || resultB)) {
                                return true;
                            }
                            break;
                        case "cylinder":
                            //根据两点间的距离进行相应的判断操作
                    }
                }
            }
        }
    }
    return false;
}

/**
 * 根据输入的地皮数据，判断玩家是否在白名单中
 * @param {object} LandDate
 * @param {object} player
 * @returns {boolean}
 */
function isInAllowlist(LandDate,player) {
    if (LandDate.owner == player.xuid) {
        return true;
    }
    if(LandDate.allowList.indexOf(player.xuid,0) != -1) {
        return true;
    }
    return false;
}

// mc.listen("onJump",function(player) {
//     LandIndex = JSON.parse(File.readFrom(LandIndex_path) || "{}");
//     // calculateIndex([100,50,100], [150,80,150], 0);
// })

//监听玩家破坏，放置等动作的交互

//方块破坏
//后续可设定是否可以外部人破坏方块
mc.listen("onDestroyBlock",function(player,block) {
    let BlockPos = block.pos
    let LandDate = PosInIndex([BlockPos.x, BlockPos.y, BlockPos.z],BlockPos.dimid)
    if(LandDate && !LandDate.events.DestroyBlock && !isInAllowlist(LandDate,player)) {
        // player.tell("§c>> 你没有权限破坏 §r" + LandDate.LandName + " §r§c内的方块");
        return false;
    }
})

//操作物品展示框
mc.listen("onUseFrameBlock",function(player,block) {
    let BlockPos = block.pos
    let LandDate = PosInIndex([BlockPos.x, BlockPos.y, BlockPos.z],BlockPos.dimid)
    if(LandDate && !LandDate.events.UseFrameBlock && !isInAllowlist(LandDate,player)) {
        // player.tell("§c>> 你没有权限在 §r" + LandDate.LandName + " §r§c内操作物品展示框");
        return false;
    }
})

//方块放置
mc.listen("onPlaceBlock",function(player,block) {
    let BlockPos = block.pos
    let LandDate = PosInIndex([BlockPos.x, BlockPos.y, BlockPos.z],BlockPos.dimid)
    if(LandDate && !LandDate.events.PlaceBlock && !isInAllowlist(LandDate,player)) {
        // player.tell("§c>> 你没有权限在 §r" + LandDate.LandName + " §r§c内放置方块");
        return false;
    }
})

// mc.listen("afterPlaceBlock",function(player,block) {
//     let BlockPos = block.pos
//     let LandDate = PosInIndex([BlockPos.x, BlockPos.y, BlockPos.z],BlockPos.dimid)
//     if(LandDate && !LandDate.events.PlaceBlock && !isInAllowlist(LandDate,player)) {
//         // player.tell("§c>> 你没有权限在 §r" + LandDate.LandName + " §r§c内放置方块");
//         block.destroy(true)
//     }
// })

//方块互动
// mc.listen("onBlockInteracted",function(player,block) {
//     let BlockPos = block.pos
//     let LandDate = PosInIndex([BlockPos.x, BlockPos.y, BlockPos.z],BlockPos.dimid)
//     if(LandDate && !isInAllowlist(LandDate,player)) {
//         return false;
//     }
// })

//打开箱子
mc.listen("onOpenContainer",function(player,block) {
    let BlockPos = block.pos
    let LandDate = PosInIndex([BlockPos.x, BlockPos.y, BlockPos.z],BlockPos.dimid)
    if(LandDate && !LandDate.events.OpenContainer && !isInAllowlist(LandDate,player)) {
        // player.tell("§c>> 你没有权限打开 §r" + LandDate.LandName + " §r§c内的容器类方块");
        return false;
    }
})

//攻击实体
mc.listen("onAttackEntity",function(player,entity) {
    let EntityPos = entity.pos;
    let LandDate = PosInIndex([EntityPos.x, EntityPos.y, EntityPos.z],EntityPos.dimid);
    if(LandDate && !LandDate.events.AttackEntity && !isInAllowlist(LandDate,player)) {
        // player.tell("§c>> 你没有权限攻击 §r" + LandDate.LandName + " §r§c内的实体");
        return false;
    }
})

//防止使用部分工具
mc.listen("onUseItemOn",function(player,item,block,side) {
    //定义一些可以改变物品地形的工具
    const tool = {
        "hoe":["minecraft:wooden_hoe","minecraft:stone_hoe","minecraft:iron_hoe","minecraft:golden_hoe","minecraft:diamond_hoe","minecraft:netherite_hoe"],
        "shovel":["minecraft:wooden_shovel","minecraft:stone_shovel","minecraft:iron_shovel","minecraft:golden_shovel","minecraft:diamond_shovel","minecraft:netherite_shovel"],
        "bucket":["minecraft:water_bucket","minecraft:lava_bucket","minecraft:cod_bucket","minecraft:salmon_bucket","minecraft:tropical_fish_bucket","minecraft:pufferfish_bucket","minecraft:powder_snow_bucket","minecraft:axolotl_bucket","minecraft:tadpole_bucket"],
        "others":["minecraft:flint_and_steel","minecraft:shears","minecraft:hopper"]
    }
    //定义一些可以被改变状态的方块
    const blocks = {
        "doors": ["minecraft:wooden_door","minecraft:spruce_door","minecraft:mangrove_door","minecraft:birch_door","minecraft:jungle_door","minecraft:acacia_door","minecraft:dark_oak_door","minecraft:crimson_door","minecraft:iron_door","minecraft:warped_door"],
        "trapdoors": ["minecraft:trapdoor","minecraft:spruce_trapdoor","minecraft:birch_trapdoor","minecraft:jungle_trapdoor","minecraft:acacia_trapdoor","minecraft:dark_oak_trapdoor","minecraft:mangrove_trapdoor","minecraft:iron_trapdoor","minecraft:crimson_trapdoor","minecraft:warped_trapdoor"],
        "gate": ["minecraft:fence_gate","minecraft:spruce_fence_gate","minecraft:birch_fence_gate","minecraft:jungle_fence_gate","minecraft:acacia_fence_gate","minecraft:dark_oak_fence_gate","minecraft:mangrove_fence_gate","minecraft:crimson_fence_gate","minecraft:warped_fence_gate"],
        "others": ["minecraft:lever","minecraft:unpowered_repeater","minecraft:unpowered_comparator","minecraft:wooden_button"]
    }
    let BlockPos = block.pos
    let LandDate = PosInIndex([BlockPos.x, BlockPos.y, BlockPos.z],BlockPos.dimid)
    // log(item.type + "& &" + block.type)
    if (LandDate && !LandDate.events.UseItemOn) {
        let InAllowList = isInAllowlist(LandDate,player);
        if (!InAllowList &&(tool.hoe.indexOf(item.type,0) != -1 || tool.shovel.indexOf(item.type,0) != -1 || tool.bucket.indexOf(item.type,0) != -1 || tool.others.indexOf(item.type,0) != -1)) {
            return false;
        }
        if (!InAllowList && (blocks.doors.indexOf(block.type,0) != -1 || blocks.trapdoors.indexOf(block.type,0) != -1 || blocks.gate.indexOf(block.type,0) != -1 || blocks.others.indexOf(block.type,0) != -1)) {
            return false;
        }
    }
})

//实体生成
// mc.listen("onMobSpawn",function(typeName,entity) {
//     let EntityPos = entity.pos
//     let LandDate = PosInIndex([EntityPos.x, EntityPos.y, EntityPos.z],EntityPos.dimid)
//     if(LandDate) {
//         return false;
//     }
// })



//耕地退化
mc.listen("onFarmLandDecay",function(Pos,entity) {
    let LandDate = PosInIndex([Pos.x, Pos.y, Pos.z],Pos.dimid)
    if(LandDate && !LandDate.events.FarmLandDecay) {
        if(entity.type == "minecraft:player" && isInAllowlist(LandDate,entity.toPlayer())) {
            return true;
        } else {
            // entity.toPlayer().tell("§c>> 你没有权限破坏 §r" + LandDate.LandName + " §r§c内的耕地")
        }
        return false;
    }
})

//凋零破坏方块
mc.listen("onWitherBossDestroy",function(witherBoss,AAbb,aaBB) {
    let EntityPos = witherBoss.pos
    let LandDate = PosInIndex([EntityPos.x, EntityPos.y, EntityPos.z],EntityPos.dimid)
    if(LandDate) {
        return false;
    }
})

//操作盔甲架
mc.listen("onChangeArmorStand",function(entity,player,slot) {
    let EntityPos = entity.pos
    let LandDate = PosInIndex([EntityPos.x, EntityPos.y, EntityPos.z],EntityPos.dimid)
    if(LandDate && !LandDate.events.ChangeArmorStand && !isInAllowlist(LandDate,player)) {
        // player.tell("§c>> 你没有权限攻击 §r" + LandDate.LandName + " §r§c内的实体");
        return false;
    }
})


//捡起物品
mc.listen("onTakeItem",function(player,entity,item) {
    let EntityPos = entity.pos
    let LandDate = PosInIndex([EntityPos.x, EntityPos.y, EntityPos.z],EntityPos.dimid)
    if(LandDate && !LandDate.events.TakeItem && !isInAllowlist(LandDate,player)) {
        // player.tell("§c你没有权限捡起 §r§f" + LandDate.LandName + " §r§c内的掉落物",5);;
        return false;
    }
})

//丢弃物品
mc.listen("onDropItem",function(player,item) {
    let playerPos = player.pos
    let LandDate = PosInIndex([playerPos.x, playerPos.y, playerPos.z],playerPos.dimid)
    if(LandDate && !LandDate.events.DropItem && !isInAllowlist(LandDate,player)) {
        // player.tell("§c>> 你没有权限在 §r" + LandDate.LandName + " §r§c内扔出物品");
        return false;
    }
})

//防止外界流体方块进入领地
mc.listen("onLiquidFlow",function(from,to) {
    let BlockPos = from.pos
    let LandDate = PosInIndex([to.x, to.y, to.z],to.dimid)
    if(LandDate && !LandDate.events.LiquidFlow &&!PosInIndex([BlockPos.x, BlockPos.y, BlockPos.z],BlockPos.dimid)) {
        return false;
    }
})

//循环判定
setInterval(function() {
    let OnlinePlayers = mc.getOnlinePlayers();
    for (let i = 0; i < OnlinePlayers.length; i++) {
        PlayerInIndex(OnlinePlayers[i])
    }
},1000)


mc.listen("onServerStarted",function () {

    //首先读取地皮数据
    let LandDate = JSON.parse(File.readFrom(LandDate_path));
    //首先定义一个地皮数量
    let LandNum = 0;
    //遍历地皮数据，将索引值写入内存
    for (let Land in LandDate) {
        LandIndex = calculateIndex(LandDate[Land].pos1, LandDate[Land].pos2, LandDate[Land].dimid, Land, LandIndex);
        LandNum++;
    }
    log(LandNum + " 块地皮数据已成功载入...");

    //相关指令的注册
    let cmdLand = mc.newCommand("nland","圈地指令",PermType.Any);
    cmdLand.setEnum("singleAction", ["gui","setup"]);
    cmdLand.mandatory("action", ParamType.Enum, "singleAction", 1);
    cmdLand.overload(["singleAction"]);
    //cmdLand指令回传
    cmdLand.setCallback((cmdLand, origin, out, res) => {
        switch (res.action) {
            case "gui":
                guiAPI.Main(origin.player);
                break;
            case "setup":
                break;
        }
    })
    cmdLand.setup();
})



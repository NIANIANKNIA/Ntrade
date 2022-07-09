# Ntrade - A new generation of player trading market plugins
Ntrade is a LLSE-based Minecraft server player trading market plug-in, based on JavaScript to bring players an efficient and convenient experience.

## Plugin features
- **Multilingual** Currently supports Simplified Chinese and English, more languages will be supported in subsequent updates

- **Full GUI** All functions have corresponding GUI interface

- **Custom** Server owners can modify the corresponding language pack according to their own needs to achieve custom effects

- **Support player's independent listing/de-listing** The whole process is operated by the player, and the item name/price can be set without the intervention of the administrator

- **Support players listing items with NBT** Not only limited to ordinary items, items with NBT can be listed

- **Support setting the time limit for removing the shelf** Items that have been on the shelf for too long will be automatically removed from the shelf

- **Support the administrator to remove the shelf** Items listed in violation of regulations can be removed by the administrator in time

- **Can set prohibited items** Make corresponding settings in the configuration file to achieve the function of prohibiting certain items from being listed

- **Support players to view historical transaction records** Check historical transaction trends at any time

## Installation tutorial

### Initialize the plugin

1. Configure the corresponding BDS server and install LiteLoader

2. Download the latest version of [Ntrade](https://github.com/NIANIANKNIA/Ntrade/releases)

3. Put Ntrade.lxl.js in the decompressed package under the plugins folder of the BDS root directory

4. Start **bedrock_server_mod.exe**, then the plugin will automatically generate the corresponding configuration file

### Modify the configuration file

Please refer to the following to modify the configuration file

Configuration file location: `plugins/Ntrade/config.json`

````json
{
    "marketID": 1, //market ID, do not change under normal circumstances
    "llmoney": 0, //Whether to enable llmoney economy, 0 (false) is not enabled, 1 (true) is enabled
    "MoneyScoresBoardName": "money", //If it is a scoreboard economy, the corresponding scoreboard name
    "Password": "123456", //Offer authorization code
    "BanItems": [
        {
            "type": "minecraft:clock", //Item id prohibited from listing
            "aux": -1 //The special value of items that are prohibited from being listed (-1 means that the special value is not restricted)
        }
    ],
    "language": "zh_CN", //The main language of the plugin
    "AutoOffShelfTime": 72, //Time of automatic off shelf (unit: hour), if set to -1, it will not automatically off shelf
    "TaxRate": 0 //Transfer tax rate, if it is set to 0, no handling fee will be charged. If necessary, please change it to any number in [0, 1).
}
````

## Contact the author
Email: nianianknia@163.com

## License

You must accept Minecraft's End User License Agreement (EULA).

- It means **Do not commercialize anything that violates the EULA**
- By accepting this **license** you also **accept** the [Minecraft EULA](https://account.mojang.com/terms)
- If you violate the **EULA**, any legal responsibility is **not with the developer **
- **The developer is not responsible for you, and the developer is not obliged to write code for you and be responsible for any consequences caused by your use**

Also, you need to abide by the terms of the `AGPL-3.0` open source license for this project

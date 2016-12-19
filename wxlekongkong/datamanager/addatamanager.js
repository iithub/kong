var config = require("../config.js")
var util = require("../utils/util.js")
var apimanager = require("../utils/apimanager.js")

//获取最新交易的商品
function getLastestTradeAds(params, success, fail, complete) {
    var url = config.getLastestAdListingUrl()
    var that = this;
    apimanager.request({
        url: url,
        method: 'GET',
        success: function(res) {
            if (success) {
                let items = that.handleLoadLastestListingSuccess(res)
                success(items)
            }
        },
        fail: fail,
        complete: complete});
}

function handleLoadLastestListingSuccess(res) {
    if (ret.data.type != "data") {
      return []
    }
    
    var items = ret["data"]["result"];
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        var date = new Date(item.display.content.timeStamp * 1000);
        item.display.content.date = util.adFormatTime(date);
    }

    return items && items.length? itmes: []
}

//获取首页更多ads
function getMorePageLayoutAdItems(params, success, fail, complete) {
    apimanager.request({
      url: config.getAdListUrl(),
      data: params,
      method: 'GET',
      success: function(res) {
        // success
        if (success) {
            let items = resetPageLayoutAdItemsInfo(res.data)
            success(items)
        }
      },
      fail: fail,
      complete: complete
    })
}

function resetPageLayoutAdItemsInfo(res) {
    if (!res || res.type != "data") {
      return []
    }

    var items = []
    var results = res.result
    for (let key in results) {
      var result = results[key].display
      if (result.style == "ad_item") {
        result.content.description = result.content.title + result.content.content
        result.content.city = result.content.region.names.join("|")
        var date = new Date(result.content.createdAt * 1000)
        result.content.date = util.adFormatTime(date)
        result.content.likeCount -= 0
        result.content.applicationCount -= 0
        result.content.commentNum -= 0
        result.style = "adview"
        result.content.user.avatarUrl = result.content.user.avatar.square
        items.push(result)
      }
    }
    return items
}

//通过标签获取ads
function getAdsByTag(params, success, fail, complete) {
    apimanager.request({
        url: config.getTagListingUrl(),
        data: params, 
        method: 'GET',
        success: function(ret) {
            if (success) {
                let items = resetTagAds(ret)
                success(items)
            }
        },
        fail: fail,
        complete: complete
    })
}

function resetTagAds(ret) {
    if (!ret || !ret.data || ret.data.type != "data") {
        return []
    }

    var results = ret.data.result
    var items = []
    for (let key in results) {
      var result = results[key].display
      if (result.style == "HomeRegionListAd") {
        result.content.city = result.content.region
        var date = new Date(result.content.createdAt * 1000)
        result.content.date = util.adFormatTime(date)
        result.content.likeCount -= 0
        result.content.applicationCount -= 0
        result.content.commentNum -= 0
        result.content.user.avatarUrl = result.content.user.avatar
        if(!result.content.commentNum) {
          result.content.commentNum = 0
        }
        result.style = "adview"
        items.push(result)
      }
    }
    return items
}

//获取ad详情
function getAdDetailWithParams(params, success, fail, complete) {
    var url = config.getAdDetailUrl()
    apimanager.request({
        url: url,
        data: params,
        method: 'GET',
        success: function(res) {
            //返回数据是否有效
            let validData = res && res.data && (res.data.type == "data")
            if (validData && success) {
                success(res)
            } else if (fail) {
                fail()
            }
        }, 
        fail: fail,
        complete: complete
    })
}

module.exports = {
    getAdsByTag: getAdsByTag,                               //通过标签获取ad列表
    getLastestTradeAds: getLastestTradeAds,                 //获取最新交易列表
    getAdDetailWithParams: getAdDetailWithParams,           //获取ad详情
    getMorePageLayoutAdItems: getMorePageLayoutAdItems,     //获取首页ad列表
}
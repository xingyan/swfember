/**
 * @file flash渲染模块
 */

'use strict';

var
  /**
   * swfobject
   */
  swfobject = require('./swfobject'),

  /**
   * @desc 工具
   * @type {exports}
   */
  util = require('pc-game-util').util;

/**
 * @desc 判断是否是ie浏览器
 * @returns {boolean}
 */
function isIE() {
  var UA = window.navigator.userAgent.toLowerCase();
  return UA.indexOf('msie') > -1 || (UA.indexOf("trident") > -1 && UA.indexOf("rv") > -1);
}

/**
 * @desc 确定当前浏览器是否支持 Flash
 * @returns {boolean}
 */
function isSupportFlash() {
  if(isIE()) {
    try {
      var swf = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
      if(parseInt(swf.GetVariable("$version").split(" ")[1].split(",")[0]) < 11) {
        return false;
      }
    } catch (e) {
      return false;
    }
  } else {
    if(!navigator.plugins["Shockwave Flash"]) {
      return false;
    }
  }
  return true;
}

/**
 * 给 ID 为 domId 的 DOM 元素嵌入 swfObject 对象
 * @param domId
 * @param params
 */
function embedSWF(domId, params){
  if (!util.trim(domId)) {
    return null;
  }
  var errorHTML = '您的电脑flash版本过低或是异常,请点击'
    + '<a style="color:red" target="_blank" href="https://get.adobe.com/cn/flashplayer/update/osx/">'
    + '安装</a>';
  if(!isSupportFlash()){
    util.g(domId).innerHTML = errorHTML;
    return null;
  }
  if(!params['resource'] || !params['height'] || !params['width']) {
    return null;
  }
  params['flashId'] = domId

  /**
   * 给 uid 一个默认值，-1
   * @type {Number}
   */
  params['uid'] = parseInt(params['uid']) ? parseInt(params['uid']) : -1

  /**
   * https://code.google.com/p/swfobject/wiki/api
   * swfobject.embedSWF(swfUrl, id, width, height, version, expressInstallSwfurl, flashvars, params, attributes)
   */
  var obj = params['wmode'] ? {
    allowFullScreen: 'true',
    wMode: params['wmode'],
    allowScriptAccess: 'always'
  } : {
    allowFullScreen: 'true',
    wMode: 'opaque',
    allowScriptAccess: 'always'
  }
  swfobject.embedSWF(params['resource'], (domId || 'liveSwf'),
    params['width'], params['height'], '10.0.0', '', params,
    obj
  )
}

module.exports = {
  embedSWF: embedSWF
};
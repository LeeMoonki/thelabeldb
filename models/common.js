var mysql = require('mysql');
var dbPoolConfig = require('../config/dbPoolConfig');

var dbPool = mysql.createPool(dbPoolConfig);

var hostAddress = 'https://127.0.0.1:4433';
//var hostAddress = 'https://localhost:4433';
//var hostAddress = 'https://ec2-52-78-137-47.ap-northeast-2.compute.amazonaws.com:4433';




function readRangeHeader(range, totalLength) {
  /*
   * Input: bytes=100-200
   * Output: ["", "100", "200", ""]
   *
   * Input: bytes=100-
   * Output: ["", "100", "", ""]
   *
   * Input: bytes=-200
   * Output: ["", "", "200", ""]
   */

  // 위의 세 경우에서 숫자를 빼야 한다

  if (range == null || range.length == 0)
    return null;

  // () 는 capture 라고 한다 : 괄호 안을 제외한 나머지는 null 문자열이 된다
  // [0-9*] 숫자인것을 뽑아낸다
  // array 는 위의 Output처럼 생겼다
  var array = range.split(/bytes=([0-9]*)-([0-9]*)/);
  var start = parseInt(array[1]);
  var end = parseInt(array[2]);
  var result = {
    start: isNaN(start) ? 0 : start,
    end: isNaN(end) ? (totalLength - 1) : end // 배열 처럼 0바이트 부터 시작하므로 끝도 -1
  };

  if (!isNaN(start) && isNaN(end)) {
    result.start = start;
    result.end = totalLength - 1;
  }

  if (isNaN(start) && !isNaN(end)) {
    result.start = totalLength - end;
    result.end = totalLength - 1;
  }

  return result;
}










module.exports.dbPool = dbPool;
module.exports.hostAddress = hostAddress;
module.exports.readRangeHeader = readRangeHeader;
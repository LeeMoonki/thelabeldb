var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var mime = require('mime');

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

router.get('/:filename', function(req, res, next) {
  var filename = req.params.filename ? req.params.filename.trim() : '';
  if (filename) {
    var filepath = path.join(__dirname, '../uploads/postFiles/', filename);
    // 파일 존재여부 체크하고 정보 가져온다
    fs.stat(filepath, function(err, stats) {
      // stats 는 파일 정보를 갖는다
      if (err) {
        // 파일이 없다면 에러
        return next(err);
      }
      var fileSize = stats.size;
      
      // 일반 파일이면
      if (stats.isFile()) {
        // req.headers 에 있는 Range정보를 가져온다
        var rangeRequest = readRangeHeader(req.headers['range'], fileSize);
        // range header 가 없다면 (최초요청)
        if (rangeRequest == null) {
          res.set({
            'Content-Type': mime.lookup(filename),
            'Content-Length': fileSize,
            'Accept-Ranges': 'bytes'
          });
          res.status(200);
          var readable = fs.createReadStream(filepath);
          readable.on('open', function() {
            readable.pipe(res);
          });
        } else {
          // range header 가 있다면
          var start = rangeRequest.start;
          var end = rangeRequest.end;

          if (start >= fileSize || end >= fileSize) {
            // 만약 요청범위가 잘못 되었다면
            res.set('Content-Range', 'bytes */' + fileSize);
            res.status(416).end();  // Range Not Satisfiable
          } else {
            res.set({
              'Content-Range': 'bytes ' + start + '-' + end + '/' + fileSize,
              'Content-Length': start == end ? 0 : (end - start + 1),
              'Content-Type': mime.lookup(filename),
              'Accept-Ranges': 'bytes',
              'Cache-Control': 'no-cache'
            });
            // 스트리밍 서비스이기 때문에 no-cache 
            res.status(206); // Partial Content
            // start하고 end를 주는 중간부분을 읽는 stream
            var readable = fs.createReadStream(filepath, {start: start, end: end});
            readable.on('open', function() {
              readable.pipe(res);
            });
          }
        }
      } else {
        next();
      }
    });
  }

});

module.exports = router;

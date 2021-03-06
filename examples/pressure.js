// Generated by ToffeeScript 1.3.3
(function() {
  var Curl, assert, i, j, next, _fn, _i;

  Curl = require('../index');

  assert = require('assert');

  j = 0;

  (next = function() {
    console.info("curl instances: ", Curl.get_count());
    return setTimeout(next, 1000);
  })();

  _fn = function() {
    var curl, once;
    curl = Curl.create();
    return (once = function() {
      var _this = this;
      return curl('localhost/test.html', function(_$$_err, _$$_res) {
        var err, res;
        err = _$$_err;
        res = _$$_res;
        assert.equal(res.body.length, 1468);
        if (++j % 100 === 0) {
          console.info(j);
        }
        if (j < 5000) {
          return once();
        }
      });
    })();
  };
  for (i = _i = 1; _i <= 100; i = ++_i) {
    _fn();
  }

}).call(this);

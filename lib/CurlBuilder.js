// Generated by ToffeeScript 1.3.3
(function() {
  var Curl, CurlBuilder,
    __hasProp = {}.hasOwnProperty,
    __slice = [].slice;

  try {
    Curl = require(__dirname + '/../build/Release/node-curl').Curl;
  } catch (e) {
    Curl = require(__dirname + '/../build/default/node-curl').Curl;
  }

  CurlBuilder = (function() {

    function CurlBuilder() {}

    CurlBuilder.curls = {};

    CurlBuilder.id = 0;

    CurlBuilder.close_all = function() {
      var curl, id, _ref;
      _ref = CurlBuilder.curls;
      for (id in _ref) {
        if (!__hasProp.call(_ref, id)) continue;
        curl = _ref[id];
        curl.end();
        delete CurlBuilder.curls[id];
      }
      return CurlBuilder;
    };

    CurlBuilder.create = function(defaultOptions) {
      var curl;
      curl = function() {
        return curl.perform.apply(curl, arguments);
      };
      curl.perform = function() {
        var args, c, cb, length, options, url;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (this.running) {
          throw new Error('the cURL session is busy, use CurlBuilder.create to create another cURL Session');
        }
        if (!this.curl_) {
          throw new Error('the cURL is closed.');
        }
        this.running = true;
        cb = args.pop();
        url = args[0], options = args[1];
        if (options == null) {
          options = {};
        }
        c = this.curl_;
        options['URL'] = url;
        c.chunks = [];
        length = 0;
        this.setOptions(options);
        c.on_write = function(chunk) {
          curl.log("receive " + chunk.length + " bytes");
          c.chunks.push(chunk);
          return length += chunk.length;
        };
        c.on_end = function() {
          var chunk, data, position, _i, _len, _ref,
            _this = this;
          curl.log("receive succeeded.");
          curl.running = false;
          data = new Buffer(length);
          position = 0;
          _ref = c.chunks;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            chunk = _ref[_i];
            chunk.copy(data, position);
            position += chunk.length;
          }
          c.chunks = [];
          if (c.options.RAW) {
            curl.body = data;
          } else {
            curl.body = data.toString();
          }
          curl.status = curl.code = c.getinfo('RESPONSE_CODE');
          return process.nextTick(function() {
            return cb.call(curl, null, curl);
          });
        };
        c.on_error = function(err) {
          var _this = this;
          curl.log("receive failed: " + err.message);
          curl.running = false;
          return process.nextTick(function() {
            return cb.call(curl, err, null);
          });
        };
        this.log('perform');
        return c.perform();
      };
      curl.setDefaultOptions = function(options, reset) {
        if (options == null) {
          options = {};
        }
        if (reset == null) {
          reset = true;
        }
        defaultOptions = options;
        if (reset) {
          this.log('Set default options and reset cURL');
          return this.reset();
        }
      };
      curl.log = function(text) {
        if (this.debug) {
          return console.info(("[cURL " + this.id + "] ") + text);
        }
      };
      curl.setOptions = function(options) {
        var k, v;
        if (options == null) {
          options = {};
        }
        for (k in options) {
          if (!__hasProp.call(options, k)) continue;
          v = options[k];
          this.log("Set option '" + k + "' to '" + v + "'");
          this.curl_.setopt(k, v);
        }
        return this;
      };
      curl.setopts = function(options) {
        if (options == null) {
          options = {};
        }
        return this.setOptions(options);
      };
      curl.info = function(info) {
        if (this.curl_ == null) {
          throw new Error('curl is closed');
        }
        return this.curl_.getinfo(info);
      };
      curl.end = function() {
        if (this.curl_ != null) {
          this.curl_.close();
        }
        this.curl_ = null;
        this.body = null;
        delete CurlBuilder.curls[this.id];
        return this.log("closed.");
      };
      curl.close = function() {
        return this.end();
      };
      curl.open = function() {
        if (curl.id == null) {
          curl.id = ++CurlBuilder.id;
        }
        this.log("opening.");
        this.curl_ = new Curl();
        this.curl_.options = {};
        this.setOptions(defaultOptions);
        CurlBuilder.curls[curl.id] = curl;
        return this.log("opened.");
      };
      curl.reset = function() {
        this.log('reset');
        if (this.curl_) {
          this.end();
        }
        return this.open();
      };
      curl.Curl = Curl;
      curl.Builder = CurlBuilder;
      curl.create = function(defaultOptions) {
        return CurlBuilder.create(defaultOptions);
      };
      curl.get_count = function() {
        return Curl.get_count();
      };
      curl.open();
      return curl;
    };

    return CurlBuilder;

  }).call(this);

  process.on('exit', function() {
    return CurlBuilder.close_all();
  });

  module.exports = CurlBuilder;

}).call(this);

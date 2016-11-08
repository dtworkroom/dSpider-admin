(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

require("./../js/lib/jquery.lettering-0.6.1.min.js");

require("./../js/lib/jquery.textillate.js");

/**
 * Created by du on 16/10/14.
 */
$(function () {
    function loadimg(src) {
        return $.Deferred(function (dtd) {
            var img = new Image();
            img.src = src;
            img.onload = function () {
                dtd.resolve();
            };
        }).promise();
    }
    $.when(loadimg("dist/img/cloud_1.png"), loadimg("dist/img/cloud_2.png"), loadimg("dist/img/cloud_3.png")).done(function () {
        $(".sky div").each(function (i) {
            $(this).addClass("clouds_" + (i + 1));
        });
    });

    $('.text1').textillate({ in: { initialDelay: 2000, effect: 'rollIn' } });
    $('.text2').textillate({
        initialDelay: 3000, //设置动画开始时间
        in: {
            effect: 'flipInX' //设置动画名称
        }
    });
    $('.text3').textillate({
        initialDelay: 5000, //设置动画开始时间
        in: {
            effect: 'flipInX' //设置动画名称
        }
    });
    $('.text4').textillate({
        initialDelay: 7000,
        in: { effect: 'bounceInDown' }
    });
});
String.prototype.format = function () {
    var args = Array.prototype.slice.call(arguments);
    var count = 0;
    return this.replace(/%s/g, function (s, i) {
        return args[count++];
    });
};

window.requestAnimFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
}();

var step = 0;
//定义三条不同波浪的颜色
var lines = ["rgba(19, 94, 148, .8)", "rgba(19, 94, 148, .8)", "rgba(19, 94, 148, .8)"];
var text1 = $(".text1");
function loop() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var height = canvas.parentNode.offsetHeight;
    canvas.width = canvas.parentNode.offsetWidth;
    canvas.height = height;
    text1.css("paddingTop", height * .2);
    ctx.clearRect(0, 0, canvas.width, height);
    // 波浪大小
    var boHeight = height / 18;
    var posHeight = height / 1.2;
    //初始角度为0
    step++;
    for (var j = lines.length - 1; j >= 0; j--) {
        ctx.fillStyle = lines[j];
        //每个矩形的角度都不同，每个之间相差45度
        var angle = (step + j * 50) * Math.PI / 180;
        var deltaHeight = Math.sin(angle) * boHeight;
        var deltaHeightRight = Math.cos(angle) * boHeight;
        ctx.beginPath();
        ctx.moveTo(0, posHeight + deltaHeight);
        ctx.bezierCurveTo(canvas.width / 2, posHeight + deltaHeight - boHeight, canvas.width / 2, posHeight + deltaHeightRight - boHeight, canvas.width, posHeight + deltaHeightRight);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.lineTo(0, posHeight + deltaHeight);
        ctx.closePath();
        ctx.fill();
    }
    requestAnimFrame(loop);
}
loop();
},{"./../js/lib/jquery.lettering-0.6.1.min.js":2,"./../js/lib/jquery.textillate.js":3}],2:[function(require,module,exports){
(function ($) {
    function injector(t, splitter, klass, after) {
        var a = t.text().split(splitter), inject = '';
        if (a.length) {
            $(a).each(function (i, item) {
                inject += '<span class="' + klass + (i + 1) + '">' + item + '</span>' + after
            });
            t.empty().append(inject)
        }
    }

    var methods = {
        init: function () {
            return this.each(function () {
                injector($(this), '', 'char', '')
            })
        }, words: function () {
            return this.each(function () {
                injector($(this), ' ', 'word', ' ')
            })
        }, lines: function () {
            return this.each(function () {
                var r = "eefec303079ad17405c889e092e105b0";
                injector($(this).children("br").replaceWith(r).end(), r, 'line', '')
            })
        }
    };
    $.fn.lettering = function (method) {
        if (method && methods[method]) {
            return methods[method].apply(this, [].slice.call(arguments, 1))
        } else if (method === 'letters' || !method) {
            return methods.init.apply(this, [].slice.call(arguments, 0))
        }
        $.error('Method ' + method + ' does not exist on jQuery.lettering');
        return this
    }
})(jQuery);
},{}],3:[function(require,module,exports){
(function ($) {
  "use strict"; 

  function isInEffect (effect) {
    return /In/.test(effect) || $.inArray(effect, $.fn.textillate.defaults.inEffects) >= 0;
  };

  function isOutEffect (effect) {
    return /Out/.test(effect) || $.inArray(effect, $.fn.textillate.defaults.outEffects) >= 0;
  };

  // custom get data api method
  function getData (node) {
    var attrs = node.attributes || []
      , data = {};

    if (!attrs.length) return data;

    $.each(attrs, function (i, attr) {
      if (/^data-in-*/.test(attr.nodeName)) {
        data.in = data.in || {};
        data.in[attr.nodeName.replace(/data-in-/, '')] = attr.nodeValue;
      } else if (/^data-out-*/.test(attr.nodeName)) {
        data.out = data.out || {};
        data.out[attr.nodeName.replace(/data-out-/, '')] = attr.nodeValue;
      } else if (/^data-*/.test(attr.nodeName)) {
        data[attr.nodeName] = attr.nodeValue;
      }
    })

    return data;
  }

  function shuffle (o) {
      for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
  }

  function animate ($c, effect, cb) {
    $c.addClass('animated ' + effect)
      .css('visibility', 'visible')
      .show();

    $c.one('animationend webkitAnimationEnd oAnimationEnd', function () {
        $c.removeClass('animated ' + effect);
        cb && cb();
    });
  }

  function animateChars ($chars, options, cb) {
    var count = $chars.length;

    if (!count) {
      cb && cb();
      return;
    } 

    if (options.shuffle) shuffle($chars);

    $chars.each(function (i) {
      var $this = $(this);
      
      function complete () {
        if (isInEffect(options.effect)) {
          $this.css('visibility', 'visible');
        } else if (isOutEffect(options.effect)) {
          $this.css('visibility', 'hidden');
        }
        count -= 1;
        if (!count && cb) cb();
      }

      var delay = options.sync ? options.delay : options.delay * i * options.delayScale;

      $this.text() ? 
        setTimeout(function () { animate($this, options.effect, complete) }, delay) :
        complete();
    })
  };

  var Textillate = function (element, options) {
    var base = this
      , $element = $(element);

    base.init = function () {
      base.$texts = $element.find(options.selector);
      
      if (!base.$texts.length) {
        base.$texts = $('<ul class="texts"><li>' + $element.text() + '</li></ul>');
        $element.html(base.$texts);
      }

      base.$texts.hide();

      base.$current = $('<span>')
        .text(base.$texts.find(':first-child').text())
        .prependTo($element);

      if (isInEffect(options.effect)) {
        base.$current.css('visibility', 'hidden');
      } else if (isOutEffect(options.effect)) {
        base.$current.css('visibility', 'visible');
      }

      base.setOptions(options);

      setTimeout(function () {
        base.options.autoStart && base.start();
      }, base.options.initialDelay)
    };

    base.setOptions = function (options) {
      base.options = options;
    };

    base.start = function (index) {
      var $next = base.$texts.find(':nth-child(' + (index || 1) + ')');

      (function run ($elem) {
        var options = $.extend({}, base.options, getData($elem));

        base.$current
          .text($elem.text())
          .lettering('words');

        base.$current.find('[class^="word"]')
            .css({ 
              'display': 'inline-block',
              // fix for poor ios performance
              '-webkit-transform': 'translate3d(0,0,0)',
                 '-moz-transform': 'translate3d(0,0,0)',
                   '-o-transform': 'translate3d(0,0,0)',
                      'transform': 'translate3d(0,0,0)'
            })
            .each(function () { $(this).lettering() });

        var $chars = base.$current.find('[class^="char"]')
          .css('display', 'inline-block');

        if (isInEffect(options.in.effect)) {
          $chars.css('visibility', 'hidden');
        } else if (isOutEffect(options.in.effect)) {
          $chars.css('visibility', 'visible');
        }

        animateChars($chars, options.in, function () {
          setTimeout(function () {
            // in case options have changed 
            var options = $.extend({}, base.options, getData($elem));

            var $next = $elem.next();

            if (base.options.loop && !$next.length) {
              $next = base.$texts.find(':first-child');
            } 

            if (!$next.length) return;

            animateChars($chars, options.out, function () {
              run($next)
            });
          }, base.options.minDisplayTime);
        });

      }($next));
    };

    base.init();
  }

  $.fn.textillate = function (settings, args) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('textillate')
        , options = $.extend(true, {}, $.fn.textillate.defaults, getData(this), typeof settings == 'object' && settings);

      if (!data) { 
        $this.data('textillate', (data = new Textillate(this, options)));
      } else if (typeof settings == 'string') {
        data[settings].apply(data, [].concat(args));
      } else {
        data.setOptions.call(data, options);
      }
    })
  };
  
  $.fn.textillate.defaults = {
    selector: '.texts',
    loop: false,
    minDisplayTime: 2000,
    initialDelay: 0,
    in: {
      effect: 'fadeInLeftBig',
      delayScale: 1.5,
      delay: 50,
      sync: false,
      shuffle: false
    },
    out: {
      effect: 'hinge',
      delayScale: 1.5,
      delay: 50,
      sync: false,
      shuffle: false,
    },
    autoStart: true,
    inEffects: [],
    outEffects: [ 'hinge' ]
  };

}(jQuery));
},{}]},{},[1])
//# sourceMappingURL=sources_maps/index.js.map

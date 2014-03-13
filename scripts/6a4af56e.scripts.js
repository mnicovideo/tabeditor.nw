"use strict";
angular.module("miibootstrapnavtabApp", ["ngCookies", "ngResource", "ngSanitize", "mii.bootstrap.navtab", "ui.ace"]), angular.module("miibootstrapnavtabApp", ["ngSanitize", "mii.bootstrap.navtab", "ui.ace"]).controller("MainCtrl", ["$scope",
  function(a) {
    var b = function(b) {
      var c = (new Date).valueOf();
      a.tabs.push({
        active: b,
        title: "loooong title " + c,
        content: "dynamic content of " + c
      })
    };
    a.addTab = function() {
      angular.forEach(a.tabs, function(a) {
        return a.active ? void(a.active = !1) : void 0
      }), b(!0)
    }, a.tabs = [], a.addTab(!0)
  }
]).filter("optionNameFilter", function() {
  return function(a) {
    return "Ace" + a
  }
}), angular.module("mii.bootstrap.navtab", []).value("NavTabsBaseController", {
  duration: 200,
  resetTime: 500,
  browser: {
    msie: /msie/.test(navigator.userAgent.toLowerCase()),
    firefox: /firefox/.test(navigator.userAgent.toLowerCase()),
    webkit: /webkit/.test(navigator.userAgent.toLowerCase()),
    safari: /safari/.test(navigator.userAgent.toLowerCase()) && /Apple Computer/.test(navigator.vendor),
    chrome: /chrome/.test(navigator.userAgent.toLowerCase()) && /Google Inc/.test(navigator.vendor)
  },
  ngRepeatExpressionObject: function(a) {
    var b, c, d, e, f, g = a.match(/^\s*(.+)\s+in\s+([\r\n\s\S]*?)\s*(\s+track\s+by\s+(.+)\s*)?$/);
    if (!g) throw "no match. expression:" + a;
    if (b = g[1], c = g[2], d = g[4], g = b.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/), !g) throw "no match. lhs:" + b;
    return e = g[3] || g[1], f = g[2], {
      tabName: b,
      tabsName: c,
      trackByExp: d,
      valueIdentifier: e,
      keyIdentifier: f
    }
  },
  activeTabPosition: function(a, b) {
    for (var c = 0, d = 0; a > d; d++) {
      var e = b.eq(d).width();
      console.log("this.browser.firefox ?", this.browser.firefox), c += e - (this.browser.firefox ? .5 : 0)
    }
    return c
  },
  scrollPosition: function(a, b) {
    var c = b.find("li[ng-repeat]"),
      d = this.activeTabPosition(a, c),
      e = b.scrollLeft(),
      f = b.width(),
      g = c.eq(a).width();
    if (d > e) {
      if (f - g > d - e) return;
      d -= f - g
    }
    return d
  },
  showTabAnimate: function(a, b, c) {
    var d = b.indexOf(a),
      e = this.scrollPosition(d, c);
    c.animate({
      scrollLeft: e
    }, this.duration)
  },
  navTabsElements: function(a) {
    var b = a.find("[navtabs-scrollable].nav.nav-tabs");
    return b.length ? b : a.find(".nav.nav-tabs")
  }
}).controller("NavTabsController", ["NavTabsBaseController",
  function(a) {
    return {
      duration: a.duration,
      resetTime: a.resetTime,
      activeTabIndex: function(a) {
        for (var b in a)
          if (a[b].active) return Number(b);
        return -1
      },
      ngRepeatObject: function(b) {
        var c = b.closest("li[ng-repeat]").attr("ng-repeat"),
          d = a.ngRepeatExpressionObject(c);
        return d
      },
      navTabsElement: function(b, c) {
        var d, e = b.closest("[ng-controller]"),
          f = a.navTabsElements(e);
        if (c ? angular.forEach(f, function(b) {
          b = angular.element(b);
          var e = b.find("li[ng-repeat]").eq(0);
          if (0 !== e.length) {
            var f = e.attr("ng-repeat"),
              g = a.ngRepeatExpressionObject(f);
            return g.tabsName === c ? void(d = angular.element(b)) : void 0
          }
        }) : d = f.eq(0), !d) throw "[warning] there is no tabs, array name: " + c;
        return d
      },
      showTabElement: function(a, b, c, d) {
        var e, f = "prevew" === c || "next" === c ? {
            tabsName: b.closest("[navtabs-model]").attr("navtabs-model")
          } : this.ngRepeatObject(b),
          g = a[f.tabsName],
          h = this.activeTabIndex(g),
          i = h,
          j = function() {
            g[i].active = !1, g[e].active = !0
          };
        "prevew" === c && (e = i - 1, e > -1 && a.$apply(function() {
          j()
        })), "next" === c && (e = i + 1, e < g.length && a.$apply(function() {
          j()
        })), "at" === c && (e = d, a.$apply(function() {
          j()
        }))
      },
      removeTabElement: function(b, c, d) {
        var e = this.ngRepeatObject(c),
          f = b[e.tabsName],
          g = d.index(c),
          h = f[g],
          i = this.activeTabIndex(f);
        h.active ? 0 >= g ? i = 0 : g >= f.length - 1 && (i = f.length - 2) : i > g && (i -= 1);
        var j = function() {
          f.splice(g, 1), f.length > 0 && (f[i].active = !0)
        }, k = c.closest("[ng-controller]"),
          l = a.navTabsElements(k),
          m = !0;
        angular.forEach(l, function(c) {
          c = angular.element(c);
          var d = c.find("li[ng-repeat]").eq(g),
            e = c.attr("navtabs-scrollable");
          "string" == typeof e ? d.animate({
            width: "toggle",
            opacity: "toggle"
          }, {
            duration: a.duration,
            start: function() {
              d.find("[navtabs-show]").hide()
            },
            complete: function() {
              m && (b.$apply(function() {
                j()
              }), m = !1)
            }
          }) : b.$apply(function() {
            j()
          })
        })
      },
      navtabsScroll: function(b, c, d) {
        angular.forEach(c, function(c) {
          c = angular.element(c);
          var e = c.find("li[ng-repeat]").eq(0);
          if (e.length) {
            var f = e.attr("ng-repeat"),
              g = a.ngRepeatExpressionObject(f);
            if (b.navtabsModel && g.tabsName === b.navtabsModel) {
              var h;
              "preview" === d ? h = c.scrollLeft() - c.width() : "next" === d ? h = c.scrollLeft() + c.width() : "begin" === d ? h = 0 : "end" === d && (h = c.prop("scrollWidth")), c.animate({
                scrollLeft: h
              }, a.duration)
            }
          }
        })
      },
      watchTabElementClass: function(b, c) {
        var d = c.closest(".nav.nav-tabs"),
          e = d.find("li[ng-repeat]"),
          f = c.closest("li[ng-repeat]"),
          g = e.index(f),
          h = c.closest("li[ng-repeat]").attr("ng-repeat"),
          i = a.ngRepeatExpressionObject(h),
          j = b[i.tabsName],
          k = j[g];
        b.$watch(function() {
          return c.closest("li[ng-repeat]").attr("class")
        }, function(b) {
          b.match(/active\b/) && a.showTabAnimate(k, j, d)
        })
      }
    }
  }
]).directive("navtabsShow", function() {
  return {
    controller: "NavTabsController",
    link: function(a, b, c, d) {
      d.watchTabElementClass(a, b), b.on("click", function(c) {
        c.preventDefault();
        var e = d.ngRepeatObject(b),
          f = a[e.tabName],
          g = a[e.tabsName],
          h = d.activeTabIndex(g);
        a.$apply(function() {
          g[h].active = !1, f.active = !0
        })
      })
    }
  }
}).directive("navtabsRemove", function() {
  return {
    controller: "NavTabsController",
    link: function(a, b, c, d) {
      b.on("click", function(c) {
        c.preventDefault(), c.stopPropagation();
        var e = b.closest("li[ng-repeat]"),
          f = b.closest(".nav.nav-tabs"),
          g = f.find("li[ng-repeat]");
        d.removeTabElement(a, e, g)
      })
    }
  }
}).directive("navtabsPreview", function() {
  return {
    controller: "NavTabsController",
    link: function(a, b, c, d) {
      b.on("click", function(e) {
        e.preventDefault();
        var f = d.navTabsElement(b, c.navtabsModel),
          g = f.find("li.active");
        g.length && d.showTabElement(a, g, "prevew")
      })
    }
  }
}).directive("navtabsNext", function() {
  return {
    controller: "NavTabsController",
    link: function(a, b, c, d) {
      b.on("click", function(e) {
        e.preventDefault();
        var f = d.navTabsElement(b, c.navtabsModel),
          g = f.find("li.active");
        g.length && d.showTabElement(a, g, "next")
      })
    }
  }
}).directive("navtabsShowAt", function() {
  return {
    controller: "NavTabsController",
    link: function(a, b, c, d) {
      b.on("change", function(e) {
        e.preventDefault();
        var f = d.navTabsElement(b, c.navtabsModel),
          g = f.find("li.active"),
          h = b.prop("selectedIndex");
        g.length && d.showTabElement(a, g, "at", h)
      })
    }
  }
}).directive("navtabsScrollBegin", function() {
  return {
    controller: "NavTabsController",
    link: function(a, b, c, d) {
      b.on("click", function(a) {
        a.preventDefault();
        var e = b.closest("[ng-controller]"),
          f = e.find("[navtabs-scrollable].nav.nav-tabs");
        d.navtabsScroll(c, f, "begin")
      })
    }
  }
}).directive("navtabsScrollEnd", function() {
  return {
    controller: "NavTabsController",
    link: function(a, b, c, d) {
      b.on("click", function(a) {
        a.preventDefault();
        var e = b.closest("[ng-controller]"),
          f = e.find("[navtabs-scrollable].nav.nav-tabs");
        d.navtabsScroll(c, f, "end")
      })
    }
  }
}).directive("navtabsScrollPreview", function() {
  return {
    controller: "NavTabsController",
    link: function(a, b, c, d) {
      b.on("click", function(a) {
        a.preventDefault();
        var e = b.closest("[ng-controller]"),
          f = e.find("[navtabs-scrollable].nav.nav-tabs");
        d.navtabsScroll(c, f, "preview")
      })
    }
  }
}).directive("navtabsScrollNext", function() {
  return {
    controller: "NavTabsController",
    link: function(a, b, c, d) {
      b.on("click", function(a) {
        a.preventDefault();
        var e = b.closest("[ng-controller]"),
          f = e.find("[navtabs-scrollable].nav.nav-tabs");
        d.navtabsScroll(c, f, "next")
      })
    }
  }
});

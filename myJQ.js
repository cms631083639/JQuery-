(function (window) {
    // 将一些全局对象，传到框架中的局部变量中。
    // 好处：提高访问性能。
    var iArray = [],
        push = iArray.push,
        document = window.document;
    // myJQ 就相当于$(jQuery)
    // 核心函数
    function myJQ(selector) {
        return new myJQ.fn.init(selector);
    }

    // 由于会经常调用myJQ.prototype,因此为其添加一个简写方式
    myJQ.fn = myJQ.prototype = {
        constructor: myJQ,
        selector: '', // 用来判断是myJQ对象的属性
        length: 0, // 保证myJQ对象在任何情况下都是伪数组对象
        // 创建init对象，`
        // 参数：selector就是选择器，根据其获取dom元素，并且保存在init对象上。
        init: function (selector, context) {
            if (myJQ.isNull(selector)) {
                return this;
            }
            if (myJQ.isString(selector)) {
                if (myJQ.isHtml(selector)) {
                    push.apply(this, myJQ.parseHtml(selector));
                } else {
                    push.apply(this, select(selector));
                    //以下两步可省略，是为了对客户查询之前获取的途径提供原始信息
                    this.selector = selector;
                    this.context = context || document.body;
                }
                return this;
            }
            if (myJQ.isFunction(selector)) {
                var fn = window.onload;
                if (myJQ.isFunction(fn)) {
                    window.onload = function () {
                        fn();
                        selector();
                    };
                } else {
                    window.onload = selector;
                }
            }
            //传入单一dom
            if (myJQ.isDom(selector)) {
                this[0] = selector;
                this.length = 1;
                return this;
            }
            // 易忘点
            // 传入 dom数组
            if (myJQ.isArrayLike(selector)) {
                push.apply(this, selector);
                return this;
            }
            if (myJQ.ismyJQ(selector)) {
                return this;
            }
            if (myJQ.isWindow(selector)) {
                return window;
            }
        },
        each: function (callback) {
            // this就是myJQ对象，即each方法的调用者
            myJQ.each(this, callback);
            // 实现链式编程，将当前调用者返回
            return this;
        }
    }
    // 核心原型
    myJQ.fn.init.prototype = myJQ.fn;

    // 可扩展方法
    myJQ.extend = myJQ.fn.extend = function (source) {
        var k;
        if (source && typeof source === "object") {
            for (k in source) {
                this[k] = source[k];
            }
        }
    }
    // 扩展类型判断方法
    // 所有方法的返回值应为布尔值
    myJQ.extend({
        isNull: function (obj) {
            return !obj;
        },
        isString: function (str) {
            return typeof str === "string";
        },
        isFunction: function (fn) {
            return typeof fn === "function";
        },
        ismyJQ: function (myJQ) {
            return typeof myJQ === "object" && 'selector' in myJQ
        },
        isDom: function (dom) {
            var node = dom.nodeType;
            return !!node;
        },
        isWindow: function (w) {
            return typeof w === "object" && 'window' in w && w.window === window;
        },
        isArrayLike: function (arr) {
            if (myJQ.isWindow(arr) || myJQ.isFunction(arr)) false;
            return typeof arr === "object" && arr.length > 0 && 'length' in arr;
        },
        isHtml: function (html) {
            //由于前面已经判断过是否是string 所以后面无需判断
            var h = myJQ.trim(html);
            return h.charAt(0) === '<'
                && h.charAt(html.length - 1) === '>'
                && html.length >= 3;
        }
    });
    // 扩展工具类方法
    myJQ.extend({
        trim: function (str) {
            if (!str) return '';
            return str.replace(/^\s+|\s+$/g, '');
        },
        each: function (obj, callback) {
            var i = 0, j = obj.length;
            for (; i < j;) {
                callback.call(obj[i], obj[i], i++);
            }
        },
        parseHtml: function (html) {
            var div = document.createElement('div'),
                ret = [];
            div.innerHTML = html;
            myJQ.each(div.childNodes, function () {
                ret.push(this);
            })
            return ret;
        }
    })
    // css module
    myJQ.fn.extend({
        css: function (style, value) {
            if (value === undefined) {
                if (typeof style === 'object') {
                    this.each(function () {
                        myJQ.setCss(this, style);
                    });
                } else {
                    return this.length > 0 ?
                        myJQ.getCss(this[0], style) :
                        undefined;
                }
            } else {
                return this.each(function () {
                    myJQ.setCss(this, style, value);
                })
            }
        },
        hasClass: function (cls) {
            return this.length > 0 ?
                myJQ.hasClass(this[0], cls) :
                false;
        },
        addClass: function (cls) {
            if (this.length > 0) {
                return this.each(function () {
                    myJQ.addClass(this, cls);
                })
            }
        },
        removeClass: function (cls) {
            return this.each(function () {
                if (cls === undefined) {
                    this.className = "";
                } else {
                    myJQ.removeClass(this, cls);
                }
            })
        },
        toggleClass: function (cls) {
            return this.each(function () {
                myJQ.toggleClass(this, cls);
            })
        }
    });
    myJQ.extend({
        getCss: function (dom, style) {
            if (document.defaultView && document.defaultView.getComputedStyle) {
                return dom.defaultView.getComputedStyle
            } else {
                return dom.currentStyle(style);
            }
        },
        setCss: function (dom, style, value) {
            if (value !== undefined) {
                dom.style[style] = value;
            } else if (typeof style === 'object') {
                var k;
                for (k in style) {
                    dom.style[k] = style[k];
                }
            }
        },
        addClass: function (dom, cls) {
            if (!dom.className) dom.className = cls;
            else if (!myJQ.hasClass(dom, cls)) {
                dom.className += " " + cls;
            }
        },
        hasClass: function (dom, cls) {
            return (" " + dom.className + " ").indexOf(" " + myJQ.trim(cls) + " ") !== -1;
        },
        removeClass: function (dom, cls) {
            dom.className = (" " + dom.className + " ").replace(" " + cls + " ", " ");
        },
        toggleClass: function (dom, cls) {
            if (myJQ.hasClass(dom, cls)) {
                myJQ.remove(dom, cls);
            } else {
                myJQ.addClass(dom, cls);
            }
        }
    });
    // attr module
    myJQ.fn.extend({
        attr: function (name, val) {
            if (val === undefined) {
                return this.length > 0 ?
                    myJQ.getAttr(this[0], name) : undefined;
            }
            else return this.each(function () {
                myJQ.setAttr(this[0], name, val);
            })
            return this;
        },
        val: function (val) {
            if (val === undefined)return this.length > 0 ?
                myJQ.getVal(this[0]) :
                undefined;
            else {
                this.each(function () {
                    myJQ.setVal(this, val);
                })
            }
        },
        html: function (html) {
            if (html === undefined)return this.length > 0 ?
                myJQ.getHtml(this[0]) : undefined;
            else {
                this.each(function () {
                    myJQ.setHtml(this, html);
                })
            }
        },
        text: function (txt) {
            if (txt === undefined) {
                return this[0] && myJQ.getText(this[0]);
            } else {
                return this.each(function () {
                    myJQ.setText(this, txt);
                });
            }
        }
    })
    myJQ.extend({
        getAttr: function (dom, val) {
            return dom.getAttribute(val);
        },
        setAttr: function (dom, name, val) {
            dom.setAttribute(name, val);
        },
        getVal: function (dom) {
            return dom.value;
        },
        setVal: function (dom, val) {
            dom.value = val;
        },
        getHtml: function (dom) {
            return dom.innerHTML;
        },
        setHtml: function (dom, html) {
            dom.innerHTML = html;
        },
        getTxt: function (dom) {
            var ret = '',
                nodety = dom.nodeType;
            if (nodety == 1 || nodety == 9 || nodety == 13) {
                if (elem.textContent) {
                    return dom.textContent;
                } else {
                    for (dom = dom.firstChild; dom; dom = dom.nextSibling) {
                        ret += myJQ.getTxt(dom);
                    }
                }
            } else if (nodety === 3) {
                return dom.nodeValue;
            }
            return ret;
        },
        setText: function (dom, txt) {
            if (dom.textContent) {
                dom.textContent = txt
            } else {
                dom.innerHTML = "";
                dom.appendChild(document.createTextNode(txt));
            }
        }
    });
    // dom operation module

    // selector module
    var select = (function () {
        var rnative = /^[^{]+\{\s*\[native \w/,
            rquickExpr = /^(?:#([\w-]+)|\.([\w-]+)|(\w+)|(\*))$/,
            support = {
                getElementsByClassName: rnative.test(document.getElementsByClassName)
            };

        function trim(str) {
            if (!str) return '';
            return str.replace(/^\s+|\s+$/g, '');
        }

        function each(obj, callback) {
            var i = 0, j = obj.length;
            for (; i < j;) {
                callback.call(obj[i], obj[i], i++);
            }
        }

        function getId(id, results) {
            results = results || [];
            var node = document.getElementById(id);
            results.push(node);
            return results;
        }

        function getTag(tag, context, results) {
            context = context || document.body;
            results = results || [];
            results.push.apply(results, context.getElementsByTagName(tag));
            return results;
        }

        function getClass(cls, context, results) {
            context = context || document.body;
            results = results || [];
            // 找预先定义的support能力检测对象
            if (support.getElementsByClassName) {
                results.push.apply(results, context.getElementsByClassName(cls));
            } else {
                var nodes = getTag('*', context);
                each(nodes, function () {
                    if ((" " + this.className + " ").indexOf(" " + cls + " ") !== -1) {
                        results.push(this);
                    }
                })
            }
            return results;
        }

        // 给selector作铺垫
        function get(selector, context, results) {
            context = context || document.body;
            results = results || [];
            var match = rquickExpr.exec(selector);
            if (match) {
                if (match[1]) results = getId(match[1]);
                else {
                    // 易忘点 context可能传 ['div']
                    var nodetp = context.nodeType;
                    if (nodetp) context = [context];
                    if (typeof context === "string") context = get(context);
                    each(context, function () {
                        if (match[2]) results = getClass(match[2], this, results);
                        if (match[3]) results = getTag(match[3], this, results);
                        if (match[4]) results = getTag('*', this, results);
                    })
                }
            }
            return results;
        }

        //后代 selectA(#div div p);
        function selectA(selector, context, results) {
            var subselector = selector.split(" ");
            var res = context;
            // res 切换 context
            each(subselector, function () {
                res = get(this, res);
            })
            return res;
        }

        //并集 selectorz (#div1,.header);
        function selectorz(selector, context, results) {
            context = context || document.body;
            var comselector = selector.split(",");
            each(comselector, function () {
                results = get(this.valueOf(), results);
            })
            return results
        }

        // 合并select选择器
        // (#div1 p,.header div)获取#div下的p以及.header下的所有div
        function select(selector, context, results) {
            results = results || [];

            each(selector.split(","), function () {
                var res = context;
                each(this.split(" "), function () {
                    res = get(this.valueOf(), res);
                });
                results.push.apply(results, res);
            })
            return results;
        }
        return select;
    }());
    window.$ = window.myJQ = myJQ;
}(window));

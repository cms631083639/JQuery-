/**
 * Created by cms on 2016/7/13.
 */
function $ (vArg) {
    return new VQuery (vArg);
}
function myAddEvent (obj, sEv, fn) {
    if (obj.attachEvent) {
        obj.attachEvent ("on" + sEv, function () {
            if (false == fn.call (obj)) {
                event.cancelBubble = true;
                return false;
            }
        });
    }
    else {
        obj.addEventListener (sEv, function (ev) {
            if (false == fn.call (obj)) {
                ev.stopPropagation ();
                ev.preventDefault ();
            }
        }, false);
    }
}
function getStyle (obj, attr) {
    if (obj.currentStyle) {
        return obj.currentStyle[attr];
    } else {
        return getComputedStyle (obj, null)[attr];
    }
}
function arrConcat (arr1, arr2) {
    for (var i = 0 ; i < arr2.length ; i++) {
        arr1.push (arr2[i]);
    }
}
function getIndex (obj) {
    var aParents = obj.parentNode.children;
    for (var i = 0 ; i < aParents.length ; i++) {
        if (aParents[i] == obj) {
            return i;
        }
    }
}
function VQuery (vArg) {
    this.element = [];
    switch (typeof vArg) {
        case "function":
            myAddEvent (window, "load", vArg);
            break;
        case "string":
            switch (vArg.charAt (0)) {
                case "#":
                    var obj = document.getElementById (vArg.substring (1));
                    this.element.push (obj);
                    break;
                case ".":
                    this.element = document.getElementsByClassName (vArg.substring (1));
                    break;
                default :
                    this.element = document.getElementsByTagName (vArg);
            }
            break;
        case "object":
            this.element.push (vArg);
    }
}

VQuery.prototype.click = function (fn) {
    for (var i = 0 ; i < this.element.length ; i++) {
        myAddEvent (this.element[i], "click", fn);
    }
    return this;
}

VQuery.prototype.hide = function () {
    for (var i = 0 ; i < this.element.length ; i++) {
        this.element[i].style.display = "none";
    }
    return this;
}

VQuery.prototype.show = function () {
    for (var i = 0 ; i < this.element.length ; i++) {
        this.element[i].style.display = "block";
    }
    return this;
}

VQuery.prototype.hover = function (fnOver, fnOut) {
    for (var i = 0 ; i < this.element.length ; i++) {
        myAddEvent (this.element[i], "mouseover", fnOver);
        myAddEvent (this.element[i], "mouseout", fnOut);
    }
    return this;
}

VQuery.prototype.css = function (attr, value) {
    if (arguments.length == 2) {
        for (var i = 0 ; i < this.element.length ; i++) {
            this.element[i].style[attr] = value;
        }
    }
    else if (arguments.length == 1) {
        if (typeof attr == "string") {
            return getStyle (this.element[0], attr);
        } else {
            for (var i = 0 ; i < this.element.length ; i++) {
                for (var k in attr) {
                    this.element[i].style[k] = attr[k];
                }
            }
        }
    } else {
        return;
    }
    return this;
}
VQuery.prototype.toggle = function () {
    var _argument = arguments;

    for (var i = 0 ; i < this.element.length ; i++) {
        addCount (this.element[i]);
    }
    function addCount (obj) {
        var count = 0;
        myAddEvent (obj, "click", function () {
            _argument[count % _argument.length].call (obj);
            count++;
        })
    }

    return this;
}
VQuery.prototype.attr = function (attr, value) {
    //alert (arguments.length);
    if (arguments.length == 2) {
        for (var i = 0 ; i < this.element.length ; i++) {
            this.element[i][attr] = value;
        }
    } else {
        return this.element[0][attr];
    }
    return this;
}
VQuery.prototype.eq = function (n) {
    return $ (this.element[n]);
}
VQuery.prototype.find = function (str) {
    var aResult = [];
    for (var i = 0 ; i < this.element.length ; i++) {
        switch (str.charAt (0)) {
            case "." :
                var oEle = this.element[i].getElementsByClassName (str.substring (1));
                arrConcat (aResult, oEle);
                //aResult = aResult.concat (oEle);
                break;
            default :
                var oEle = this.element[i].getElementsByTagName (str);
                arrConcat (aResult, oEle);
                //aResult = aResult.concat (oEle);
                break;
        }
    }
    var newVquery = new VQuery ();
    newVquery.element = aResult;
    return newVquery;
}
VQuery.prototype.index = function () {
    return getIndex (this.element[0]);
};
VQuery.prototype.bind = function (sEv, fn) {
    for (var i = 0 ; i < this.element.length ; i++) {
        myAddEvent (this.element[i], sEv, fn);
    }
};
VQuery.prototype.extend = function (name, fn) {
    VQuery.prototype[name] = fn;
}
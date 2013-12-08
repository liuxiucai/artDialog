/*!
* artDialog v6.0.0 
* Date: 2013-12-06
* https://github.com/aui/artDialog6
* (c) 2009-2013 TangBin, http://www.planeArt.cn
*
* This is licensed under the GNU LGPL, version 2.1 or later.
* For details, see: http://www.gnu.org/licenses/lgpl-2.1.html
*/
define(function (require) {

var $ = require('jquery');
var Popup = require('./popup');
var css = '../css/ui-dialog.css';


// css loader: RequireJS & SeaJS
css = require[require.toUrl ? 'toUrl' : 'resolve'](css);
css = '<link rel="stylesheet" href="' + css + '" />';
$('base')[0] ? $('base').before(css) : $('head').append(css);


var _version = '6.0.0';
var _count = 0;
var _expando = + new Date + '';
var _isIE6 = !('minWidth' in $('html')[0].style);
var _isMobile = 'createTouch' in document && !('onmousemove' in document)
    || /(iPhone|iPad|iPod)/i.test(navigator.userAgent);
var _isFixed = !_isIE6 && !_isMobile;


var artDialog = function (options, ok, cancel) {

    var originalOptions = options = options || {};
    

    if (typeof options === 'string' || options.nodeType === 1) {
    
        options = {content: options, fixed: !_isMobile};
    }
    

    options = $.extend(true, {}, artDialog.defaults, options);


    var id = options.id = options.id || _expando + _count;
    var api = artDialog.get(id);
    
    
    // 如果存在同名的对话框对象，则直接返回
    if (api) {
        return api.focus();
    }
    
    
    // 目前主流移动设备对fixed支持不好，禁用此特性
    if (!_isFixed) {
        options.fixed = false;
    }


    // 快捷关闭支持：点击对话框外快速关闭对话框
    if (options.quickClose) {
        options.modal = true;
        if (!originalOptions.backdropOpacity) {
            options.backdropOpacity = 0;
        }
    }
    

    // 按钮组
    if (!$.isArray(options.button)) {
        options.button = [];
    }


    // 取消按钮
    if (cancel !== undefined) {
        options.cancel = cancel;
    }
    
    if (options.cancel) {
        options.button.push({
            id: 'cancel',
            value: options.cancelValue,
            callback: options.cancel
        });
    }
    
    
    // 确定按钮
    if (ok !== undefined) {
        options.ok = ok;
    }
    
    if (options.ok) {
        options.button.push({
            id: 'ok',
            value: options.okValue,
            callback: options.ok,
            autofocus: true
        });
    }
    

    return artDialog.list[id] = new artDialog.create(options);
};

var popup = function () {};
popup.prototype = Popup.prototype;
var prototype = artDialog.prototype = new popup;

artDialog.version = _version;

artDialog.create = function (options) {
    var that = this;

    $.extend(this, new Popup);

    var $popup = $(this.node).html(options.innerHTML);

    this.options = options;
    this._popup = $popup;

    
    $.each(options, function (name, value) {
        if (typeof that[name] === 'function') {
            that[name](value);
        } else {
            that[name] = value;
        }
    });


    // 更新 zIndex 全局配置
    if (options.zIndex) {
        Popup.zIndex = options.zIndex;
    }


    // 设置 ARIA 信息
    $popup.attr({
        'aria-labelledby': this._$('title')
            .attr('id', 'title:' + this.id).attr('id'),
        'aria-describedby': this._$('content')
            .attr('id', 'content:' + this.id).attr('id')
    });


    // 关闭按钮
    this._$('close')
    .css('display', this.cancel === false ? 'none' : '')
    .attr('title', this.cancelValue)
    .on('click', function (event) {
        that._trigger('cancel');
        event.preventDefault();
    });
    

    // 添加视觉参数
    this._$('dialog').addClass(this.skin);
    this._$('body').css('padding', this.padding);


    // 按钮组点击
    $popup.on('click', '[data-trigger]', function (event) {
        var $this = $(this);
        if (!$this.attr('disabled')) {// IE BUG
            that._trigger($this.data('trigger'));
        }
    
        event.preventDefault();
    });


    // 点击遮罩自动关闭对话框
    if (options.quickClose) {
        $(this.backdrop).on('click', function () {
            that._trigger('cancel');
        });
    }


    // ESC 快捷键关闭对话框
    this._esc = function (event) {
        var target = event.target;
        var nodeName = target.nodeName;
        var rinput = /^input|textarea$/i;
        var isTop = Popup.current === that;
        var keyCode = event.keyCode;

        // 避免输入状态中 ESC 误操作关闭
        if (!isTop || rinput.test(nodeName) && target.type !== 'button') {
            return;
        };
        
        if (keyCode === 27) {
            that._trigger('cancel');
        }
    };

    $(document).on('keydown', this._esc);
    this.addEventListener('remove', function () {
        $(document).off('keydown', this._esc);
        delete artDialog.list[this.id];
    });


    _count ++;
    

    return this;
};


artDialog.create.prototype = prototype;



$.extend(prototype, {

    /**
     * 显示对话框
     * @name artDialog.prototype.show
     * @param   {HTMLElement Object, Event Object}  指定位置（可选）
     */
    
    /**
     * 显示对话框（模态）
     * @name artDialog.prototype.showModal
     * @param   {HTMLElement Object, Event Object}  指定位置（可选）
     */

    /**
     * 关闭对话框
     * @name artDialog.prototype.close
     * @param   {String, Number}    返回值，可被 onclose 事件收取（可选）
     */

    /**
     * 销毁对话框
     * @name artDialog.prototype.remove
     */

    /**
     * 重置对话框位置
     * @name artDialog.prototype.reset
     */

    /**
     * 让对话框聚焦（同时置顶）
     * @name artDialog.prototype.focus
     */

    /**
     * 让对话框失焦（同时置顶）
     * @name artDialog.prototype.blur
     */

    /**
     * 添加事件
     * @param   {String}    事件类型
     * @param   {Function}  监听函数
     * @name artDialog.prototype.addEventListener
     */

    /**
     * 删除事件
     * @param   {String}    事件类型
     * @param   {Function}  监听函数
     * @name artDialog.prototype.removeEventListener
     */

    /**
     * 对话框显示事件，在 show()、showModal() 执行
     * @name artDialog.prototype.onshow
     * @event
     */

    /**
     * 关闭事件，在 close() 执行
     * @name artDialog.prototype.onclose
     * @event
     */

    /**
     * 关闭事件，在 remove() 执行
     * @name artDialog.prototype.onremove
     * @event
     */

    /**
     * 关闭事件，在 reset() 执行
     * @name artDialog.prototype.onreset
     * @event
     */

    /**
     * 焦点事件，在 foucs() 执行
     * @name artDialog.prototype.onfocus
     * @event
     */

    /**
     * 失焦事件，在 blur() 执行
     * @name artDialog.prototype.onblur
     * @event
     */
    
    /**
     * 设置内容
     * @param    {String, HTMLElement}   内容
     */
    content: function (html) {
    
        this._$('content').html('')
        [typeof html === 'object' ? 'append' : 'html'](html);
                
        return this.reset();
    },
    
    
    /**
     * 设置标题
     * @param    {String}   标题内容
     */
    title: function (text) {
        this._$('title').text(text);
        this._$('header')[text ? 'show' : 'hide']();
        return this;
    },


    /** 设置宽度 */
    width: function (value) {
        this._$('content').css('width', value);
        return this.reset();
    },


    /** 设置高度 */
    height: function (value) {
        this._$('content').css('height', value);
        return this.reset();
    },


    /**
     * 设置按钮组
     * @param   {Array, String}
     */
    button: function (args) {
        args = args || [];
        var that = this;
        var html = '';
        this.callbacks = {};

        this._$('footer')[args.length ? 'show' : 'hide']();
           
        if (typeof args === 'string') {
            html = args;
        } else {
            $.each(args, function (i, val) {

                val.id = val.id || val.value;
                that.callbacks[val.id] = val.callback;

                html +=
                  '<button'
                + ' type="button"'
                + ' style="width:' + val.width + '"'
                + ' data-trigger="' + val.id + '"'
                + (val.disabled ? ' disabled' : '')
                + (val.autofocus ? ' autofocus class="ui-dialog-autofocus"' : '')
                + '>'
                +   val.value
                + '</button>';

            });
        }

        this._$('button').html(html);
        
        return this;
    },


    statusbar: function (html) {
        this._$('statusbar').html('')
        [typeof html === 'object' ? 'append' : 'html'](html)
        [html ? 'show' : 'hide']();

        return this;
    },


    _$: function (i) {
        return this._popup.find('[i=' + i + ']');
    },
    
    
    // 触发按钮回调函数
    _trigger: function (id) {
    
        var fn = this.callbacks[id];
            
        return typeof fn !== 'function' || fn.call(this) !== false ?
            this.close().remove() : this;
    }
    
});



/** 最顶层的对话框API */
artDialog.getCurrent = function () {
    return Popup.current;
};



/**
 * 根据 ID 获取某对话框 API
 * @param    {String}    对话框 ID
 * @return   {Object}    对话框 API (实例)
 */
artDialog.get = function (id) {
    return id === undefined
    ? artDialog.list
    : artDialog.list[id];
};

artDialog.list = {};



/**
 * 默认配置
 */
artDialog.defaults = {

    // 消息内容
    content: '<span class="ui-dialog-loading">Loading..</span>',
    
    // 标题
    title: '',

    // 对话框状态栏区域 HTML 代码
    statusbar: '',
    
    // 自定义按钮
    button: null,
    
    // 确定按钮回调函数
    ok: null,
    
    // 取消按钮回调函数
    cancel: null,

    // 确定按钮文本
    okValue: 'ok',
    
    // 取消按钮文本
    cancelValue: 'cancel',
    
    // 内容宽度
    width: '',
    
    // 内容高度
    height: '',
    
    // 内容与边界填充距离
    padding: '',
    
    // 对话框自定义 className
    skin: '',

    /** 是否支持快捷关闭（点击遮罩层自动关闭） */
    quickClose: false,
    
    // 是否固定定位
    //fixed: false,
    
    // 对话框叠加高度值(重要：此值不能超过浏览器最大限制)
    //zIndex: 1987,

    // 设置遮罩背景颜色
    //backdropBackground: '#000',

    // 设置遮罩透明度
    //backdropOpacity: 0.7,

    // 模板（使用 table 解决 IE7 宽度自适应的 BUG）
    innerHTML:
        '<div i="dialog" class="ui-dialog">'
        +       '<div class="ui-dialog-arrow-a"></div>'
        +       '<div class="ui-dialog-arrow-b"></div>'
        +       '<table class="ui-dialog-grid">'
        +           '<tr>'
        +               '<td i="header" class="ui-dialog-header">'
        +                   '<button i="close" class="ui-dialog-close">&times;</button>'
        +                   '<div i="title" class="ui-dialog-title"></div>'
        +               '</td>'
        +           '</tr>'
        +           '<tr>'
        +               '<td i="body" class="ui-dialog-body">'
        +                   '<div i="content" class="ui-dialog-content"></div>'
        +               '</td>'
        +           '</tr>'
        +           '<tr>'
        +               '<td i="footer" class="ui-dialog-footer">'
        +                   '<div i="statusbar" class="ui-dialog-statusbar"></div>'
        +                   '<div i="button" class="ui-dialog-button"></div>'
        +               '</td>'
        +           '</tr>'
        +       '</table>'
        +'</div>'
    
};



return $.dialog = artDialog;

});


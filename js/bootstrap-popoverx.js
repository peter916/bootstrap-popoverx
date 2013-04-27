!function($) {
  "use strict"

  /* class definition */
  var Popoverx = function ( element, options ) {
    // local init
    this.cinit('popover', element, options );
  }

  Popoverx.prototype = $.extend({}, $.fn.popover.Constructor.prototype, {

    constructor: Popoverx

    //初始化
    ,cinit:function(type,element,options){

      this.attr = {};
      this.attr.fireOptions = ['dblclick','click'];
      this.attr.fireEvents =  ['dblclick','click'];

      if (!options) options = {};
      
      options.trigger = 'manual';
      this.attr.fireIdx = $.inArray(options.fire_on, this.attr.fireOptions);
      // invalid fire_on option, set it as 'click'
      if(this.attr.fireIdx==-1)
      {
        options.fire_on = 'click';
        this.attr.fireIdx = 0;
      }
      
      // choose random attrs instead of timestamp ones
      this.attr.me = ((Math.random() * 10) + "").replace(/\D/g, '');
      this.attr.click_event_ns = "click." + this.attr.me + " touchstart." + this.attr.me;
      
      options = $.extend($.fn.popoverx.defaults,options);
      //调用继承的初始化方法
      this.init(type,element,options);
      
      // setup our own handlers
      //绑定事件
      this.$element.on( this.attr.fireEvents[this.attr.fireIdx], this.options.selector, $.proxy(this.clickery, this));
      //初始化即触发
      var event = this.attr.fireEvents[this.attr.fireIdx];
      var fun = this.clickery;
      var obj = this;
      var ele = this.$element;
      setTimeout(function(){
        ele.trigger(event,fun, obj);
      },200);
    }
    //重写父类的方法
    , setContent: function () {
      var $tip = this.tip()
        , title = this.options.title == null ? this.getTitle() : this.options.title
        , content = this.getContent()

     $tip.find('.popover-content').empty();
     //设置大小
      $tip.css('z-index',parseInt($(this.options.ondepend).css('z-index'))+1);
      this.options.width && $tip.css('max-width',this.options.width);
      this.options.width  &&  $tip.width(  this.options.width  );
      this.options.height && $tip.height( this.options.height );
     
      //设置标题+关闭按钮
      $tip.find('.popover-title')['html'](title+'<button type="button" id="_closepopover" class="close">&times;</button>')
      
      //ajax加载内容
      if ( this.options.url == null ){
        $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content);
      }else{
        var url = this.options.url; 
        var onShown = this.options.onShown;
        $tip.find('.popover-content').load(url,function(){
          typeof onShown == 'function' && onShown.call(this);
        });

      }

      $tip.removeClass('fade top bottom left right in')
    }

     , clickery: function(e) {
      // clickery isn't only run by event handlers can be called by timeout or manually
      // only run our click handler and  
      // need to stop progration or body click handler would fire right away
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      // we could override this to provide show and hide hooks 
      this[ this.isShown() ? 'hide' : 'show' ]();

      // if shown add global click closer
      if ( this.isShown() ) {
      
        var that = this;
        //esc键关闭       
        this.options.esc_close && $(document).bind('keyup.clickery', function(e) {
            if (e.keyCode == 27) { that.clickery(); }
            return;
        });
        //设置右上角x可关闭功能
        $('#_closepopover').on('click', this.options.selector, $.proxy(this.clickery, this));
        $(this.options.ondepend).mousedown($.proxy(this.clickery, this));

      }
      else {
      
      $('#_closepopover').off('click');
      $(this.options.ondepend).off('mousedown');
        this.options.esc_close && $(document).unbind('keyup.clickery');
        
        if (this.options.fire_on == 'hover'){
          this.$element.off('mouseleave');
        }

        $('body').off( this.attr.click_event_ns );

      }
    }
    , isShown: function() {
      return this.tip().hasClass('in');
    }
    , show: function () {
      var $tip
          , inside
          , pos
          , actualWidth
          , actualHeight
          , placement
          , tp


      if (this.hasContent() && this.enabled) {
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
            $tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        inside = /in/.test(placement)

        $tip
          .remove()
          .css({ top: 0, left: 0, display: 'block' })
          .appendTo(inside ? this.$element : document.body)

        pos = this.getPosition(inside)

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

      var topHeight = pos.height / 2 - actualHeight / 2;
      
        switch (inside ? placement.split(' ')[1] : placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + (topHeight > 0 ? topHeight : -pos.top/2), left: pos.left - actualWidth}
            $tip.find('.arrow').css('top',tp.top+pos.height/2)
            break
          case 'right':
            tp = {top: pos.top + (topHeight > 0 ? topHeight : -pos.top/2) , left: pos.left + pos.width}
            $tip.find('.arrow').css('top',tp.top+pos.height/2)
            break
        }

        if(this.options.ensure_visiable){
          var bp = { w: $('body').outerWidth(), h:$('body').outerHeight()};
        switch (inside ? placement.split(' ')[1] : placement) {
          case 'bottom':
            if(tp.top+actualHeight > bp.h){
                tp.top = pos.top - actualHeight;
                placement = 'top';
              }
            break;
          case 'top':
            if(tp.top-actualHeight < 0){
              tp.top = pos.top + pos.height;
              placement = 'bottom';
            }
            break;
          case 'left':
            if(tp.left-actualWidth < 0){
              tp.left = pos.left + pos.width;
              placement = 'right';
            }
            break;
          case 'right':
            if(tp.left+actualWidth > bp.w){
              tp.left = pos.left - actualWidth;
              placement = 'left';
              if ( tp.left < 0 ){
                tp.left = tp.left+pos.width;
                placement = 'right';
              }
              
            }
            break;
        }
        }
        $tip
          .css(tp)
          .addClass(placement)
          .addClass('in')
        }
    }
    , hide: function () {
      var that = this
        , $tip = this.tip()
        , e = $.Event('hide')

      if (e.isDefaultPrevented()) return
      //隐藏前调用关闭回调函数
      typeof this.options.onHidden == 'function' && this.options.onHidden.call(this);
      //隐藏popover对话框
      $tip.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).detach()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.detach()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.detach()

      return this
    }

  })


  var old = $.fn.popoverx

  $.fn.popoverx = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('popover')
        , options = typeof option == 'object' && option
      if (!data) $this.data('popover', (data = new Popoverx(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popoverx.Constructor = Popoverx

  // these defaults are passed directly to parent classes
  $.fn.popoverx.defaults = $.extend({}, $.fn.popover.defaults, {
    title:null,
    width:null,
    height:null,
    content:null,
    url:null,
    onHidden:null,
    onShown:null,
    fire_on:null,
    ensure_visiable:true,
    ondepend:'body'
  })

  }( window.jQuery );
var ua = navigator.userAgent;
var RENAISSANCE = window.RENAISSANCE || {};

if((ua.indexOf('Android') > 0 && ua.indexOf('Mobile') == -1) || ua.indexOf('iPad') > 0 || ua.indexOf('Kindle') > 0 || ua.indexOf('Silk') > 0){
    $('head').prepend('<meta name="viewport" content="width=1040">');
} else {
    $('head').prepend('<meta name="viewport" content="width=device-width,initial-scale=1">');
}


function imageModal($selector, object = {}) {
  var opts = {
    background: 'transparent',
    transitionIn: 'fadeInDown',
    width: 980,
    overlayColor: 'rgba(0, 0, 0, 0.8)',
  }
  var new_opts = Object.assign({}, opts, object);
  $($selector).iziModal(new_opts)
              .iziModal('open');
}

function movieModal($selector, object = {}) {
  var opts = {
    background: 'transparent',
    transitionIn: 'fadeInDown',
    width: 1160,
    iframe: true,
    onClosed: function() {
      $($selector).iziModal('destroy');
    }
  }
  var new_opts = Object.assign({}, opts, object);

  $($selector).iziModal(new_opts)
              .iziModal('open');
}

$(function() {
  $('[data-movie-modal-target]').each(function() {
    $(this).on('click', function(e) {
      var w = window.innerWidth;
      var h = w>768?640:240;
      e.preventDefault();
      var openModalTarget = $(this).data('movie-modal-target');
      movieModal($(openModalTarget), {
        iframeHeight: h
      });
    });
  });

  $('[data-image-modal-target]').each(function() {
    $(this).on('click', function(e) {
      e.preventDefault();
      var openModalTarget = $(this).data('image-modal-target');
      imageModal($(openModalTarget));
    });
  });
});


window.addEventListener('DOMContentLoaded',function(){

  $('[data-module="smoothScroll"]').each(function(){
    new RENAISSANCE.SmoothScroll($(this)).init()
  })

  $('[data-module="tab"]').each(function(){
    new RENAISSANCE.Tab($(this)).init()
  })

  $('[data-module="accordion"]').each(function(){
    new RENAISSANCE.Accordion($(this)).init()
  })

  $('[data-module="voiceSlider"]').each(function(){
    new RENAISSANCE.VoiceSlider($(this)).init()
  })

})


/***********************************************
 * smoothScroll
 **********************************************/



RENAISSANCE.SmoothScroll = function ( $base ) {
  this.$base = $base;
}

RENAISSANCE.SmoothScroll.prototype = {
  init : function() {
    this.bindEvents();
  },

  bindEvents : function() {
    var _this = this
    this.$base.on('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      var target = $(e.currentTarget).attr('href');
      _this.scrollTarget(target, false);
    })
  },

  scrollTarget : function(target, threshold){
    var $replaceTarget = $('#' + target.replace( /#/g , '' ));
    var point = $replaceTarget.offset().top;

    $('body, html').animate({ scrollTop: point }, 500, 'swing');
    return false;
  }
}


RENAISSANCE.Tab = function ( $base ) {
  this.$base = $base;
  this.$trigger = $base.find('[data-tab-role="trigger"]')
  this.$content = $base.find('[data-tab-role="content"]')
  this.SHOW = '1'
}


RENAISSANCE.Tab.prototype = {
  init : function() {
    this.bindEvents();
  },

  bindEvents : function() {
    var _this = this;
    this.$trigger.on('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      var target = $(e.currentTarget)[0].dataset.tabTrigger;
      if(_this.SHOW === target) {
        return
      } else {
        _this.$trigger.removeClass('is-active')
        $(e.currentTarget).addClass('is-active')
      }
      _this.showContent(target)

    })
  },

  showContent : function(targetNum) {
    this.$content.removeClass('is-show')
    this.$content.each(function(e, cur){
      var targetContentNum = $(cur).data('tab-content')
      if(targetContentNum == targetNum){
        $(cur).addClass('is-show')
      }
    })
    this.SHOW = targetNum
  },
}



RENAISSANCE.Accordion = function ( $base ) {
  this.$base = $base;
  this.$content = this.$base.find('[data-accordion-role="content"]');
  this.$trigger = this.$base.find('[data-accordion-role="trigger"]');
}

RENAISSANCE.Accordion.prototype = {
  init : function() {
    var _this = this
    setTimeout(function(){
      _this.setParameters();
    }, 200)
    this.bindEvents();
  },

  setParameters : function() {
    this.$content.each(function(i,e){
      var $target = $(e);
      $(e).css({
        'height':'auto'
      });
      var targetHeight = $target.outerHeight();
      $target.data('accordion-height', targetHeight)
      $(e).css({
        'height':'0px'
      });
    })
  },

  bindEvents : function(){
    var _this = this;
    this.$trigger.on('click', function(e){
      e.preventDefault();
      var $trigger = $(e.currentTarget)
      if($trigger.hasClass('is-open')){
        $trigger.removeClass('is-open')
        _this.hideContent()
      } else {
        $trigger.addClass('is-open')
        _this.showContent();
      }
    });
  },

  showContent : function(){
    var targetH = this.$content.data('accordion-height')
    this.$content.css({
      'height': targetH + 'px'
    })
  },

  hideContent : function() {
    this.$content.css({
        'height':'0px'
    });
  }

}


RENAISSANCE.VoiceSlider = function ( $base ) {
  this.$base = $base;
  this.$window = $(window);
  this.device = '';
  this.sliderFlg = '';
}


RENAISSANCE.VoiceSlider.prototype = {
  init : function() {
    this.setParameters();
    // this.bindEvents();
  },

  setParameters : function() {
    this.setDevice();
    this.setSlider();
  },

  // bindEvents : function() {
  //   var _this = this;
  //   this.$window.on('resize', function(e){
  //     _this.setDevice();
  //     if(_this.device == 'PC' & !_this.sliderFlg){
  //       _this.setSlider();
  //       _this.sliderFlg = true
  //     } else if(_this.device == 'SP' & _this.sliderFlg) {
  //       _this.offSlider();
  //       _this.sliderFlg = false
  //     }
  //   })
  // },

  setDevice : function() {
    this.device = this.$window.outerWidth() > 768? 'PC': 'SP';
  },

  setSlider : function() {
    this.$base.slick({
      infinite: true,
      dots:true,
      prevArrow: '<button class="slide-arrow prev-arrow"></button>',
      nextArrow: '<button class="slide-arrow next-arrow"></button>',
      dotsClass: 'slide-dots',
      slidesToShow: 3,
      slidesToScroll: 3,
      responsive: [
        {
          breakpoint:767,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        }
      ]
    });
  },

  // offSlider : function() {
  //   this.$base.slick('unslick')
  // }

}

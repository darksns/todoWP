import './scripts/publicPath'
import 'console-polyfill'
import 'normalize.css/normalize.css'
import './main.scss'
import $ from 'jquery'
import feather from 'feather-icons'

import installCE from 'document-register-element/pony'

import dragula from 'dragula/dist/dragula'
import 'dragula/dist/dragula.min.css'

import 'simplebar';
import 'simplebar/dist/simplebar.css';

window.jQuery = $

window.lazySizesConfig = window.lazySizesConfig || {}
window.lazySizesConfig.preloadAfterLoad = true
require('lazysizes')

$(document).ready(function () {

  $('#newTab_name').keypress(function(e) {
    var key = e.which;
    if (key == 13) // the enter key code
    {
      $('.contentTabs_item--newTab button').click();
      return false;
    }
  });

	/*--------------------------------------------
	DELETE TAB
	--------------------------------------------*/

  $('body').on('click','.contentTabs_item__delete',function() {
    if($(this).hasClass('confirm')) {
      let tab = $(this).parent();
      let termSlug = $(this).parent().find('.contentTabs_item__todo').data('term-slug');
      let siteID = $(this).parent().find('.contentTabs_item__todo').data('site-id');

      $(this).parent().find('.contentTabs_item__todoItem').each(function() {
        let idPost = $(this).data('id');
        $.ajax({
          type: "post",
          url: "/wp-admin/admin-ajax.php",
          data: {
            action:'deletePost',
            idPost: idPost,
            site_id: siteID,
          },
          success: function(result){     
            
          }
        })
      });

      $.ajax({
        type: "post",
        url: "/wp-admin/admin-ajax.php",
        data: {
          action:'deteleTab',
          termSlug: termSlug,
          site_id: siteID,
        },
        success: function(result){     
          tab.remove();
        }
      })
    }else{
      $(this).addClass('confirm');
    }

  });

  $('.contentTabs_item--newTab button').click(function() {
    let name = $(this).parent().find('input').val();
    let siteID = $(this).parent().data('site-id');
    if(name != '') {
      $.ajax({
        type: "post",
        url: "/wp-admin/admin-ajax.php",
        data: {
          action:'newTab',
          tab_name: name,
          site_id: siteID,
        },
        success: function(result){        
          let newTab =$('.contentTabs_item--clone').clone().insertBefore('.contentTabs_item--newTab');
          newTab.find('h3').html(name);
          $('.contentTabs_item--newTab input').val('');
          newTab.find('.contentTabs_item__todo').data('term-slug',result);
          newTab.removeClass('contentTabs_item--clone');
          drake.canMove('.contentTabs_item__todoItem');
        }
      })
    }
  });

  feather.replace({
    'stroke-width': 1
  })

  const containers = [].slice.apply(document.querySelectorAll('.contentTabs_item__todo'));
  var drake = dragula(containers);

  drake.on('drop', function(el, target){

    const changeTab = new Promise((resolve, reject) => {  
      resolve(
        $.ajax({
          type: "post",
          // dataType: "json",
          url: "/wp-admin/admin-ajax.php",
          data: {
            action:'changeTab',
            id: $(el).data('id'),
            term_slug: $(target).data('term-slug'),
            site_id: $(target).data('site-id'),
          },
          success: function(result){
            console.log(result);
          }
        })
      );
    });

    var posts = '';

    $(target).children('.contentTabs_item__todoItem').each(function (i) {
      if ( i === 0) {
        posts = 'post[]='+$(this).data('id');
      }else{
        posts = posts + '&post[]='+$(this).data('id');
      }
      
    });

    changeTab.then( (result, displayError ) => {

      $.ajax({
        type: "post",
        dataType: "json",
        url: "/wp-admin/admin-ajax.php",
        data: {
          action:'update-menu-order',
          order: posts,
          site_id: $(target).data('site-id'),
        },
        success: function(result){
          console.log(result);
        }
      });

    });
  })
})

installCE(window, {
  type: 'force',
  noBuiltIn: true
})

function importAll (r) {
  r.keys().forEach(r)
}

importAll(require.context('../Components/', true, /\/script\.js$/))

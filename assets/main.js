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

import Crud from './scripts/crud';

window.jQuery = $

window.lazySizesConfig = window.lazySizesConfig || {}
window.lazySizesConfig.preloadAfterLoad = true
require('lazysizes')

$(document).ready(function () {

  // let endpoint = FlyntData.root + 'wp/v2/posts';

  // $.ajax({
  //   url: endpoint,
  //   method: 'POST', 
  //   beforeSend: function(xhr){
  //     xhr.setRequestHeader( 'X-WP-Nonce', FlyntData.nonce );
  //   },
  //   data: {
  //     title: 'post ajax',
  //   }
  // }).done(function(response){
  //   alert('OK');
  // }).fail(function(response){
  //   alert( response.responseJSON.message );
  // });

  $('#tab_name').keypress(function(e) {
    var key = e.which;
    if (key == 13) // the enter key code
    {
      $('.tab-add button').click();
      return false;
    }
  });

	/*--------------------------------------------
	DELETE TAB
	--------------------------------------------*/

  $('body').on('click','.tab-delete',function() {
    new Crud.detelteTab($(this));
  });

  $('.tab-add button').click(function() {
    new Crud.addTab($(this));
  });

  feather.replace({
    'stroke-width': 1
  })

  const containers = [].slice.apply(document.querySelectorAll('.todos'));
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

    $(target).children('.todo').each(function (i) {
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

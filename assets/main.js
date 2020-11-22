import './scripts/publicPath'
import 'console-polyfill'
import 'normalize.css/normalize.css'
import './main.scss'
import $ from 'jquery'
import feather from 'feather-icons'

import installCE from 'document-register-element/pony'

import dragula from 'dragula/dist/dragula'
import 'dragula/dist/dragula.min.css'

window.jQuery = $

window.lazySizesConfig = window.lazySizesConfig || {}
window.lazySizesConfig.preloadAfterLoad = true
require('lazysizes')

$(document).ready(function () {
  feather.replace({
    'stroke-width': 1
  })

  const containers = [].slice.apply(document.querySelectorAll('.contentTabs_item__todo'));
  var drake = dragula(containers);

  drake.on('drop', function(el, target){
    $.ajax({
      type: "post",
      dataType: "json",
      url: "/wp-admin/admin-ajax.php",
      data: {
        action:'changeTab',
        id: $(el).data('id'),
        term_id: $(target).data('term-id'),
      },
      success: function(result){
        console.log(result);
      }
    });

    var posts = '';

    $(target).children('.contentTabs_item__todoItem').each(function (i) {
      if ( i === 0) {
        posts = 'post[]='+$(this).data('id');
      }else{
        posts = posts + '&post[]='+$(this).data('id');
      }
      
    });

    $.ajax({
      type: "post",
      dataType: "json",
      url: "/wp-admin/admin-ajax.php",
      data: {
        action:'update-menu-order',
        order: posts,
      },
      success: function(result){
        console.log(result);
      }
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

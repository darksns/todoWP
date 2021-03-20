import $ from 'jquery'

export default class Crud {

    constructor(){

    }

    static request(type, endpoint) {
        $.ajax( {
            url: FlyntData.root + endpoint,
            method: type,
            beforeSend: function ( xhr ) {
                xhr.setRequestHeader( 'X-WP-Nonce', FlyntData.nonce );
            },
            // data: data,
        } ).done( function ( response ) {            
            console.log(response);
            return response;
        } );
    }
    
    static addTab(element) {
        let name = element.parent().find('input').val();
        if (name != '') {
            new Promise((resolve, reject) => {
                resolve(
                    new Crud.request('POST', 'wp/v2/tab?name=' + name)
                );
            }).then((result, displayError) => {
                let newTab = $('.tab--empty').clone().insertBefore('.tab-add');
                newTab.find('h3').html(name);
                $('.tab-add input').val('');
                newTab.find('.todo').data('term-id', '');
                console.log('debug');
                newTab.removeClass('tab--empty');
                //drake.canMove('.todo');
            });
        }
    }

    static detelteTab(element){

        if (element.hasClass('confirm')) {
            let tab = element.parent();
            let termID = element.parent().find('.todos').data('term-id');
            if(element.parent().find('.todos .todo').length){
                element.parent().find('.todos .todo').each(function() {
                    let idPost = $(this).data('id');
                    if (idPost != '') {
                        new Promise((resolve, reject) => { 
                            resolve(new Crud.request('DELETE', 'wp/v2/todo/' + idPost));
                        }).then((result, displayError) => {
                            if(new Crud.request('DELETE', 'wp/v2/tab/' + termID + '?force=true')){
                                tab.remove();
                            }
                        });
                    }
                });            
            }else{
                if(new Crud.request('DELETE', 'wp/v2/tab/' + termID + '?force=true')){
                    tab.remove();
                }
            }
        }else{
            element.addClass('confirm');
        }
    }

}
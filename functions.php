<?php

namespace Flynt;

use Flynt\Utils\FileLoader;

require_once __DIR__ . '/vendor/autoload.php';

if (!defined('WP_ENV')) {
    define('WP_ENV', function_exists('wp_get_environment_type') ? wp_get_environment_type() : 'production');
} elseif (!defined('WP_ENVIRONMENT_TYPE')) {
    define('WP_ENVIRONMENT_TYPE', WP_ENV);
}

// Check if the required plugins are installed and activated.
// If they aren't, this function redirects the template rendering to use
// plugin-inactive.php instead and shows a warning in the admin backend.
if (Init::checkRequiredPlugins()) {
    FileLoader::loadPhpFiles('inc');
    add_action('after_setup_theme', ['Flynt\Init', 'initTheme']);
    add_action('after_setup_theme', ['Flynt\Init', 'loadComponents'], 101);
}

// Remove the admin-bar inline-CSS as it isn't compatible with the sticky footer CSS.
// This prevents unintended scrolling on pages with few content, when logged in.
add_theme_support('admin-bar', array('callback' => '__return_false'));

add_action('after_setup_theme', function () {
    /**
     * Make theme available for translation.
     * Translations can be filed in the /languages/ directory.
     */
    load_theme_textdomain('flynt', get_template_directory() . '/languages');
});

if ( isset($_POST['action']) && $_POST['action'] == 'log-in' ) {
   
    # Submit the user login inputs
    $login = wp_login( $_POST['user-name'], $_POST['password'] );
    $login = wp_signon( array( 'user_login' => $_POST['user-name'], 'user_password' => $_POST['password'], 'remember' => true ), false );
    
}

function changeTab() {        
    //wp_remove_object_terms($_POST['id'],$_POST['term_id'],'progetti');
    switch_to_blog( $_POST['site_id'] );
    $term_taxonomy_ids = wp_set_object_terms( $_POST['id'], array($_POST['term_slug']), 'progetti', false );

    restore_current_blog();
    wp_die();
}

add_action( 'wp_ajax_nopriv_changeTab', __NAMESPACE__ . '\\changeTab' );
add_action( 'wp_ajax_changeTab', __NAMESPACE__ . '\\changeTab' );
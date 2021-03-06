<?php

use Timber\Timber;
use Timber\Post;
use Timber\User;
use Timber\Site;
use Timber\PostQuery;
use Flynt\Utils\Options;
use Timber\Term;

use const Flynt\Archives\POST_TYPES;

$context = Timber::get_context();
$context['post'] = new Post();
$context['posts'] = new PostQuery();
$context['current_user'] = new User();
if ( isset($_POST['action']) && $_POST['action'] == 'log-in' ) {
    $context['action'] = 'log-in';    
}

if (isset($_GET['contentOnly'])) {
    $context['contentOnly'] = true;
}

if( is_main_site() ) {
    $context['mainSite'] = true;
    $sites = get_sites( array(
        'site__not_in' => 1,
    ));

    foreach ($sites as $site) {
        $projects[] = new Site($site->blog_id);
    }

    $context['projects'] = $projects;

    Timber::render('templates/index.twig', $context);
}else{
    $context['media'] = new PostQuery(
        array(
            'post_type' => 'attachment',
            'post_status' => 'inherit',
            'posts_per_page' => -1,
        )
    );

    $args = array(
        'taxonomy' => 'tab',
        'hide_empty' => false,
    );
    $context['tabs'] =  Timber::get_terms($args);
    
    Timber::render('templates/home.twig', $context);
}
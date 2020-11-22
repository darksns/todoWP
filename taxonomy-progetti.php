<?php

use Timber\Timber;
use Timber\Term;
use Timber\Post;

$context = Timber::get_context();
$context['term'] = new Term();
$context['posts'] = new Post();

$args = array(
    'taxonomy' => 'progetti',
    'parent' => $context['term']->term_id,
);
$context['tabs'] =  Timber::get_terms($args);

Timber::render('templates/progetto.twig', $context);

<?php 

function add_theme_scripts() {
  wp_enqueue_style( 'style', get_stylesheet_uri() );
 
   wp_enqueue_style( 'tudo', get_template_directory_uri() . '/dist/css/style.css', array(), '1.1', 'all');



   wp_enqueue_script( 'grupola_3', get_template_directory_uri(). '/dist/js/grupo_la.js', array ( 'jquery' ), 1.1, true);

  
    if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
      wp_enqueue_script( 'comment-reply' );
    }
}
add_action( 'wp_enqueue_scripts', 'add_theme_scripts' );

 ?>
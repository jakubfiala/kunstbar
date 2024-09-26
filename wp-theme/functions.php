<?php
add_action('wp_enqueue_scripts', 'kunstbar_setup');
add_filter('script_loader_tag', 'add_module_to_my_script', 10, 3);
add_action('wp_head', 'kunstbar_head');

function add_module_to_my_script($tag, $handle, $src)
{
    if ('main-script' === $handle) {
        $tag = '<script async type="module" src="' . esc_url($src) . '"></script>';
    }

    return $tag;
}

function kunstbar_setup() {
  wp_enqueue_style(
    'site-nav-styles',
    get_parent_theme_file_uri( 'assets/css/site-nav.css' ),
    array(),
    wp_get_theme()->get( 'Version' ),
    'all'
  );

  wp_enqueue_script(
    'site-nav-script',
    get_parent_theme_file_uri( 'assets/js/site-nav.js' ),
    array(),
    wp_get_theme()->get( 'Version' ),
    array(
      'strategy' => 'defer',
      'in_footer' => false,
    )
  );

  if (is_front_page()) {
    wp_enqueue_script(
      'main-script',
      get_parent_theme_file_uri( 'assets/js/index.js' ),
      array(),
      wp_get_theme()->get( 'Version' ),
      array(
        'strategy' => 'async',
        'in_footer' => false,
      )
    );

    $server_vars = array(
      'theme_base' => get_theme_file_uri() . '/assets',
    );

    wp_localize_script('main-script', 'server', $server_vars);

    wp_enqueue_style(
      'home-styles',
      get_parent_theme_file_uri( 'assets/css/home.css' ),
      array(),
      wp_get_theme()->get( 'Version' ),
      'all'
    );
  } else {
    wp_enqueue_script(
      'pages-script',
      get_parent_theme_file_uri( 'assets/js/pages.js' ),
      array(),
      wp_get_theme()->get( 'Version' ),
      array(
        'strategy' => 'defer',
        'in_footer' => false,
      )
    );

    wp_enqueue_style(
      'pages-styles',
      get_parent_theme_file_uri( 'assets/css/pages.css' ),
      array(),
      wp_get_theme()->get( 'Version' ),
      'all'
    );
  }
}

function kunstbar_head() {
  echo '<meta name="developer" content="https://fiala.space">';
  echo '<meta property="description" content="' . get_bloginfo('description') . '" />';
  echo '<meta property="og:title" content="Kunstbar" />';
  echo '<meta property="og:description" content="' . get_bloginfo('description') . '" />';
  echo '<meta property="og:image" content="./img/social-banner.png" />';
  echo '<script>history.scrollRestoration = "manual";</script>';
}

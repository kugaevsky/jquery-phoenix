(function() {
  $('.phoenix-input').bind('phnx.loaded', function(e) {
    return $('.callout pre code').prepend("Data loaded\n");
  });

  $('.phoenix-input').bind('phnx.saved', function(e) {
    return $('.callout pre code').prepend("Data saved\n");
  });

  $('.phoenix-input').bind('phnx.removed', function(e) {
    return $('.callout pre code').prepend("Data removed\n");
  });

  $('.phoenix-input').bind('phnx.stopped', function(e) {
    return $('.callout pre code').prepend("Save timer stopped\n");
  });

  $('.phoenix-input').bind('phnx.started', function(e) {
    return $('.callout pre code').prepend("Save timer started\n");
  });

  $('.phoenix-input').phoenix();

  $('[data-phoenix-action]').on('click', function(e) {
    $('.phoenix-input').phoenix($(this).data('phoenix-action'));
    e.preventDefault();
    return e.stopPropagation();
  });

}).call(this);

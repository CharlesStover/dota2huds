(function(resize){
  resize();
  window.addEventListener('resize', resize);
})(
  (function(bottom, toptop, z) {
    return function() {
      bottom.style.mozTransform = 'scale(' + z + ')';
      bottom.style.msTransform = 'scale(' + z + ')';
      bottom.style.oTransform = 'scale(' + z + ')';
      bottom.style.transform = 'scale(' + z + ')';
      bottom.style.webkitTransform = 'scale(' + z + ')';
      toptop.style.mozTransform = 'scale(' + z + ')';
      toptop.style.msTransform = 'scale(' + z + ')';
      toptop.style.oTransform = 'scale(' + z + ')';
      toptop.style.transform = 'scale(' + z + ')';
      toptop.style.webkitTransform = 'scale(' + z + ')';
    };
  })(
    document.getElementById('bottom'),
    document.getElementById('top'),
    Math.floor(document.body.clientWidth / (document.body.clientWidth / document.body.clientHeight <= 4/3 ? 2134 : 2560) * 10000) / 10000
  )
);

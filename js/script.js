console.log("Hello world")

function menuToggle() {
  var x = document.getElementById('myNavtoggle');
  if (x.className === 'navtoggle') {
    x.className += ' responsive';
  } else {
    x.className = 'navtoggle';
  }

  var y = document.getElementById('menu-icon');
  if (y.className === 'fas fa-bars') {
    y.className = 'fas fa-times';
    $('.navtoggle li .icon').css("font-size" , "50px");
  } else {
    y.className = 'fas fa-bars';
    $('.navtoggle li .icon').css("font-size" , "40px");
  }
}

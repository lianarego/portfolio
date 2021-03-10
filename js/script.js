console.log("Hello world")

function menuToggle() {
  var myNavToggle = document.getElementById('myNavtoggle');
  if (myNavToggle.className === 'navtoggle') {
    myNavToggle.className += ' responsive';
  } else {
    myNavToggle.className = 'navtoggle';
  }

  var menuIcon = document.getElementById('menu-icon');
  if (menuIcon.className === 'fas fa-bars') {
    menuIcon.className = 'fas fa-times';
    $('.navtoggle li .icon').css("font-size" , "50px");
  } else {
    menuIcon.className = 'fas fa-bars';
    $('.navtoggle li .icon').css("font-size" , "40px");
  }

  var overlay = document.getElementById('overlay');
  if (overlay !== null) {
    if (overlay.style.display === 'none' || overlay.style.display === '') {
      overlay.style.display = 'block';
    } else {
  	overlay.style.display = 'none';
    }
  }

  var projectOverlay = document.getElementById('project-overlay');
  if (projectOverlay !== null) {
    if (projectOverlay.style.display === 'none' || projectOverlay.style.display === '') {
      projectOverlay.style.display = 'block';
    } else {
  	projectOverlay.style.display = 'none';
    }
  }

  var header = document.getElementById('header');
  if (header !== null) {
    if (header.style.backgroundColor === 'transparent' || header.style.backgroundColor === '') {
      header.style.backgroundColor = '#DDF7FB';
    } else {
  	header.style.backgroundColor = 'transparent';
    }
  }

  var projectHeader = document.getElementById('project-header');
  if (projectHeader !== null) {
    if (projectHeader.style.backgroundColor === 'transparent' || projectHeader.style.backgroundColor === '') {
      projectHeader.style.backgroundColor = '#FFFFFF';
    } else {
  	projectHeader.style.backgroundColor = 'transparent';
    }
  }
}

function activateNiceScroll() {
  // Console log
  console.log('activateNiceScroll(): Window width =', window.innerWidth);

  if (window.innerWidth > 414) {
    // Console log
    console.log('  niceScroll(): Window width =', window.innerWidth);

    $("#grid-container").niceScroll({
    cursorcolor: "rgba(255,130, 68,0.8)",
    cursorwidth: "5px",
    cursorborder: "0"})
  } else {
    // Console log
    console.log('  getNiceScroll().remove(): Window width =', window.innerWidth);

    $("#grid-container").getNiceScroll().remove();
  }
}
activateNiceScroll();

// Callback function when window is resized
window.onresize = function() { activateNiceScroll(); resetAnimation(); };

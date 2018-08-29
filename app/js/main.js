$(document).ready(function() {
    $('.about-button').click(function() {
        $('html, body').animate({ scrollTop: $('#about').offset().top }, 800);
    })
    $('.project-button').click(function() {
        $('html, body').animate({ scrollTop: $('#project').offset().top }, 800);
    })
});
 
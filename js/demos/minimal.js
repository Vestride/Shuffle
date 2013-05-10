$(document).ready(function() {

    // Set up button clicks
    $('.filter-options li').on('click', function() {
        var $this = $(this),
            $grid = $('#grid');

        // Hide current label, show current label in title
        $('.filter-options .active').removeClass('active');
        $this.addClass('active');

        // Filter elements
        $grid.shuffle($this.data('group'));
    });

    // instantiate the plugin
    $('#grid').shuffle();


    // Add space button
    $('.js-spacing').on('click', function() {
        var $body = $(document.body);
        $body.toggleClass('spacing');
        if ( $body.hasClass('spacing') ) {
            $(this).text('Remove the spacing');
            $('#grid')
                .shuffle('destroy')
                // you can hide the initial transition if you want
                .shuffle({
                    showInitialTransition: false
                });

        } else {
            $(this).text('Add some space');
            $('#grid')
                .shuffle('destroy')
                .shuffle();
        }
    });

});
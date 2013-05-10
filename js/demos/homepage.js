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

        // Sorting options
        $('.sort-options li').on('click', function() {
            var $this = $(this),
                $grid = $('#grid'),
                sort = $this.data('sort'),
                opts = {};

            // Hide current label, show current label in title
            $('.sort-options .active').removeClass('active');
            $this.addClass('active');

            // We're given the element wrapped in jQuery
            if (sort === 'date-created') {
                opts = {
                    by: function($el) {
                        return $el.data('date-created');
                    }
                }
            } else if (sort === 'title') {
                opts = {
                    by: function($el) {
                        return $el.data('title').toLowerCase();
                    }
                };
            }

            // Filter elements
            $grid.shuffle('sort', opts);
        });

        // Advanced filtering
        $('.filter .search').on('keyup change', function() {
            var val = this.value.toLowerCase();
            $('#grid').shuffle(function($el, shuffle) {

                // Only search elements in the current group
                if (shuffle.group !== 'all' && $.inArray(shuffle.group, $el.data('groups')) === -1) {
                    return false;
                }

                var text = $.trim($el.text()).toLowerCase();
                return text.indexOf(val) != -1;
            });
        });

        // instantiate the plugin
        $('#grid').shuffle();

        // Destroy it! o_O
        // $('#grid').shuffle('destroy');


        // You can subscribe to custom events: shrink, shrunk, filter, filtered, and sorted
        $('#grid').on('shrink.shuffle shrunk.shuffle filter.shuffle filtered.shuffle sorted.shuffle layout.shuffle', function(evt, shuffle) {
            if ( window.console ) {
                console.log(evt.type, shuffle, this);
            }
        });

    });
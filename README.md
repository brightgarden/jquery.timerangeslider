jquery.timerangeslider
===============

A wrapper around jqueryui slider to do time ranges.

Example: 

    <div class="time-range-slider" id="edit-time-slider"></div>
    <input type="text" disabled id="edit-time-range" value="10:00 AM - 10:00 PM">
    <script type="text">
           $(".time-range-slider").timerangeslider({
               offsetHours: 5,
               change: function(e, ui) {
                   var displayText = ui.displayValues[ 0 ] + " - " +  ui.displayValues[ 1 ];
                   $(e.target).next("input").val( displayText );
               },
               slide: function(e, ui) {
                   var displayText = ui.displayValues[ 0 ] + " - " +  ui.displayValues[ 1 ];
                   $(e.target).next("input").val( displayText );
               },
               create: function(e, ui) {
                   var displayText = ui.displayValues[ 0 ] + " - " +  ui.displayValues[ 1 ];
                   $(e.target).next("input").val( displayText );
               }
            });
    </script>

Options (defaults):

    numHours: 24, // number of hours
    stepMinutes: 30, // 30 minute default
    offsetHours: 0, // start at midnight; 6 = start at 6AM (always a positive number)
    canSelectLastMinute: true, // e.g., can select 12:00 midnight
    anteMeridien: " AM",
    postMeridien: " PM",
    noon: " Noon", // text to use to disambiguate 12:00 noon
    midnight: " Midnight", // text to use to disambiguate 12:00 midnight
    initialStartValue: "10:00", // in military time
    initialEndValue: "22:00", // in military time
    useMilitary: false,

	// the following are functions to pass through events to the underlying slider plugin
    slide: function(e, ui){},
	change: function(e, ui){},
	create: function(e, ui){},
	start: function(e, ui){},
	stop: function(e, ui){}
	
Notes on current implementation
--------------

1. My input values are military time in the format hh:mm (this slider isn't supporting seconds at this time).
2. I needed to be able to arbitrarily slide the offset so my time range could be moved easily (e.g., my "day" is from 5am to 5am instead of midnight to midnight).
3. I didn't want to bother with the conversion from military time to display value.

Note on future development:
--------------

This is obviously a hack wrap with no support for globalization other than specifying the values yourself. Considering that you can do this directly with jqueryui slider, I didn't think it was worth getting all fancy.

Might be nice to support an altField the way datepicker does, but this doesn't because I just didn't need it. The disabled input field isn't showing up correctly in all browsers, so I am using a hacked div that looks like an input.
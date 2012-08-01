jquery.timerangeslider
===============

A wrapper around jqueryui slider to do time ranges.

Example: 

    <div class="time-range-slider" id="edit-time-slider"></div>
    <input type="text" disabled id="edit-time-range" value="10:00 AM - 10:00 PM">
    <script type="text">
           $(".time-range-slider").timerangeslider({
               offsetHours: 5,
               onChange: function(e, ui) {
                   var displayText = ui.displayValues[ 0 ] + " - " +  ui.displayValues[ 1 ];
                   $(e.target).next("span").find(".input-impostor").html( displayText );
               },
               slide: function(e, ui) {
                   var displayText = ui.displayValues[ 0 ] + " - " +  ui.displayValues[ 1 ];
                   $(e.target).next("span").find(".input-impostor").html( displayText );
               }
            });
    </script>

Options (defaults):

    numHours: 24, // number of hours
    stepMinutes: 30, // 30 minute default
    offsetHours: 0, // start at midnight; 6 = start at 6AM (always a positive number)
    canSelectLastMinute: true, // e.g., can select 12:00 midnight
    anteMeridien: "AM",
    postMeridien: "PM",
    noon: "Noon", // text to use to disambiguate 12:00 noon
    midnight: "Midnight", // text to use to disambiguate 12:00 midnight
    initialStartValue: "10:00", // in military time
    initialEndValue: "22:00", // in military time
    useMilitary: false,
    slide: function(e, ui){
       // allow passthrough
    }

Note on future development:
--------------

This is obviously a hack wrap with no support for globalization other than specifying the values yourself. Considering that you can do this directly with jqueryui slider, I didn't think it was worth getting all fancy.
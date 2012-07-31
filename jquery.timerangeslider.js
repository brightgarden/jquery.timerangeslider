/**
 * Wrapper to make time-range slider easy to do.
 *
 * Requires jquery ui slider
 */

(function($, undefined){
    $.fn.timerangeslider = function(options){
        var settings = $.extend({
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
            }, options),
            numHours = settings.numHours,
            numPositionsInHour = 60 / settings.stepMinutes,
            numPositions = numHours * numPositionsInHour - ((settings.canSelectLastMinute) ? 0 : 1),
            padNumber = function(number){
                var prePadded = "0" + number;
                return prePadded.substr(prePadded.length - 2);
            },
            getTimeDisplay = function(position){
                var ampm = settings.anteMeridien,
                    positionOfHour = Math.floor((position / numPositions) * numHours),
                    positionOfMinute = position - (positionOfHour *numPositionsInHour),
                    militaryHour = (positionOfHour + settings.offsetHours) % 24,
                    hour = militaryHour % 12,
                    minute = padNumber(positionOfMinute * settings.stepMinutes );

                if (hour === 0){
                    hour = 12;
                }

                if (militaryHour === 0){
                    if (minute === "00") {
                        ampm = settings.midnight;
                    }
                } else if (militaryHour > 11){
                    ampm = settings.postMeridien;
                    if (militaryHour === 12 && minute === "00"){
                        ampm = settings.noon;
                    }
                }

                if (settings.useMilitary){
                    return padNumber(militaryHour) + ":" + minute;
                }
                return hour + ":" + minute + " " + ampm;
            },
            getPositionFromTimeDisplay = function(timeString){
                // timestring is expected to be in military time
                var dataArray = timeString.split(":"),
                    hour = parseInt(dataArray[0]),
                    minutes = parseInt(dataArray[1]),
                    hourAdjustedForOffset = hour - settings.offsetHours,
                    positionInHour = Math.floor(minutes / 60 / numPositionsInHour);

                if (hourAdjustedForOffset < 0){
                    hourAdjustedForOffset += 24;
                }
                return hourAdjustedForOffset * numPositionsInHour + positionInHour;
            },
            initialStartValue = getPositionFromTimeDisplay(settings.initialStartValue),
            initialEndValue = getPositionFromTimeDisplay(settings.initialEndValue);

        settings.offsetHours = Math.abs(settings.offsetHours);
        return this.each(function(){
            $(this).slider({
                range: true,
                values: [initialStartValue,initialEndValue],
                min: 0,
                max: numPositions,
                slide: function(e, ui) {
                    var startTimeString = getTimeDisplay(ui.values[0]),
                        endTimeString = getTimeDisplay(ui.values[1]);
                    ui.timeValues = [startTimeString, endTimeString];
                    if ($.isFunction(settings.slide)){
                        return settings.slide(e, ui);
                    }
                }
            });
        });
    };
})(jQuery);
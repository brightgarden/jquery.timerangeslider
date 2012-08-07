/**
 * Wrapper to make time-range slider easy to do.
 *
 * Requires jquery ui slider
 *
 * Doesn't manage instances separately--all settings apply to all. Not gonna fix this as it would make more sense to rewrite properly
 */

(function($, undefined){

    var methods = {
            destroy : function(){
                return this.each(function(){
                    $(this).slider("destroy");
                });
            },
            disable : function(){
                return this.each(function(){
                    $(this).slider("disable");
                });
            },
            enable : function(){
                return this.each(function(){
                    $(this).slider("enable");
                });
            },
            option : function(optionName, value){
                return this.each(function(){
                    $(this).slider("option", optionName, value);
                });
            },
            widget : function(){
                return this.each(function(){
                    $(this).slider("widget");
                });
            },
            value : function(militarytimedisplay){
                // this is essentially moot for this slider
                var value = undefined;
                if (militarytimedisplay){
                    value = getPositionFromTimeDisplay(militarytimedisplay);
                    return this.each(function(){
                        return $(this).slider("value", value);
                    });
                }
                return $(this).slider("value");
            },
            values : function(index, militarytimedisplay){
                var value = undefined;
                if (militarytimedisplay){
                    value = getPositionFromTimeDisplay(militarytimedisplay);
                    return this.each(function(){
                        return $(this).slider("values", index, value);
                    });
                }
                var positions = $(this).slider("values"),
                    startValueObject = getTimeDisplay(positions[0]),
                    endValueObject = getTimeDisplay(positions[1]);
                return [startValueObject.military, endValueObject.military];
            },
            init : function(options){
                var startPosition, endPosition;
                settings = $.extend({}, settings, options);
                settings.offsetHours = Math.abs(settings.offsetHours);
                numPositionsInHour = 60 / settings.stepMinutes;
                numPositions = numHours * numPositionsInHour - ((settings.canSelectLastMinute) ? 0 : 1);
                startPosition = getPositionFromTimeDisplay(settings.initialStartValue);
                endPosition = getPositionFromTimeDisplay(settings.initialEndValue);
                return this.each(function(){
                    $(this).slider({
                        range: true,
                        values: [
                            startPosition,
                            endPosition
                        ],
                        min: 0,
                        max: numPositions,
                        create: function(e, ui){
                            ui.values = [startPosition, endPosition];
                            updateUiObject(ui);
                            if ($.isFunction(settings.create)){
                                return settings.create(e, ui);
                            }
                        },
                        slide: function(e, ui){
                            updateUiObject(ui);
                            if ($.isFunction(settings.slide)){
                                return settings.slide(e, ui);
                            }
                        },
                        change: function(e, ui) {
                            updateUiObject(ui);
                            if ($.isFunction(settings.change)){
                                return settings.change(e, ui);
                            }
                        },
                        start: function(e, ui){
                            updateUiObject(ui);
                            if ($.isFunction(settings.start)){
                                return settings.start(e, ui);
                            }
                        },
                        stop: function(e, ui){
                            updateUiObject(ui);
                            if ($.isFunction(settings.stop)){
                                return settings.stop(e, ui);
                            }
                        }
                    });
                });
            },
            convert: function(militaryTimeString){
                return convertMilitaryToStandard(militaryTimeString);
            }
        },
        settings = settings || {
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
            create: function(e,ui){},
            slide: function(e, ui){},
            change: function(e, ui){},
            start: function(e,ui){},
            stop: function(e,ui){}
        },
        numHours = settings.numHours,
        numPositionsInHour = 60 / settings.stepMinutes,
        numPositions = numHours * numPositionsInHour - ((settings.canSelectLastMinute) ? 0 : 1),
        padNumber = function(number){
            var prePadded = "0" + number;
            return prePadded.substr(prePadded.length - 2);
        },
        getTimeDisplay = function(position){
            var positionOfHour = Math.floor((position / numPositions) * numHours),
                positionOfMinute = position - (positionOfHour *numPositionsInHour),
                militaryHour = (positionOfHour + settings.offsetHours) % 24,
                minute = padNumber(positionOfMinute * settings.stepMinutes),
                result = {
                    formatted: "",
                    military: padNumber(militaryHour) + ":" + minute
                };

            result.formatted = convertMilitaryToStandard(result.military);
            return result;
        },
        convertMilitaryToStandard = function(militaryTime){
            var ampm = settings.anteMeridien,
                timeParts = militaryTime.split(":"),
                militaryHour = timeParts[0],
                minute = timeParts[1],
                hour = militaryHour % 12;

            if (hour == 0){
                hour = 12;
            }

            if (militaryHour == 0){
                if (minute == "00") {
                    ampm = settings.midnight;
                }
            } else if (militaryHour > 11){
                ampm = settings.postMeridien;
                if (militaryHour == 12 && minute == "00"){
                    ampm = settings.noon;
                }
            }
            return hour + ":" + minute + ampm;
        },
        updateUiObject = function(ui){
            var startTime = getTimeDisplay(ui.values[0]),
                endTime = getTimeDisplay(ui.values[1]);
            ui.timeValues = [startTime.military, endTime.military];
            if (settings.useMilitary){
                ui.displayValues = [startTime.military, endTime.military];
            } else {
                ui.displayValues = [startTime.formatted, endTime.formatted];
            }
        },
        getPositionFromTimeDisplay = function(timeString){
            // timestring is expected to be in military time
            var dataArray = timeString.split(":"),
                hour = parseInt(dataArray[0]),
                minutes = parseInt(dataArray[1]),
                hourAdjustedForOffset = hour - settings.offsetHours,
                positionInHour = Math.floor(numPositionsInHour * (minutes / 60));
            if (hourAdjustedForOffset < 0){
                hourAdjustedForOffset += 24;
            }

            return hourAdjustedForOffset * numPositionsInHour + positionInHour;
        };

    $.fn.timerangeslider = function(method){

        if (methods[method]){
            return methods[method].apply( this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method == 'object' || ! method){
            return methods.init.apply(this, arguments);
        } else {
            $.error( 'Method ' + method + ' is not supported by jquery.timerangeslider');
        }
    };
})(jQuery);
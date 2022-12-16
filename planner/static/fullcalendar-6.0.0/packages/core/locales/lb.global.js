/*!
FullCalendar Core v6.0.0
Docs & License: https://fullcalendar.io
(c) 2022 Adam Shaw
*/
(function (internal_js) {
    'use strict';

    var locale = {
        code: 'lb',
        week: {
            dow: 1,
            doy: 4, // The week that contains Jan 4th is the first week of the year.
        },
        buttonText: {
            prev: 'Zréck',
            next: 'Weider',
            today: 'Haut',
            month: 'Mount',
            week: 'Woch',
            day: 'Dag',
            list: 'Terminiwwersiicht',
        },
        weekText: 'W',
        allDayText: 'Ganzen Dag',
        moreLinkText: 'méi',
        noEventsText: 'Nee Evenementer ze affichéieren',
    };

    internal_js.globalLocales.push(locale);

})(FullCalendar.Internal);

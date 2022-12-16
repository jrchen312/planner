/*!
FullCalendar Core v6.0.0
Docs & License: https://fullcalendar.io
(c) 2022 Adam Shaw
*/
(function (internal_js) {
    'use strict';

    var locale = {
        code: 'ka',
        week: {
            dow: 1,
            doy: 7,
        },
        buttonText: {
            prev: 'წინა',
            next: 'შემდეგი',
            today: 'დღეს',
            month: 'თვე',
            week: 'კვირა',
            day: 'დღე',
            list: 'დღის წესრიგი',
        },
        weekText: 'კვ',
        allDayText: 'მთელი დღე',
        moreLinkText(n) {
            return '+ კიდევ ' + n;
        },
        noEventsText: 'ღონისძიებები არ არის',
    };

    internal_js.globalLocales.push(locale);

})(FullCalendar.Internal);

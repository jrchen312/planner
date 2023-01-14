
var calendar;

document.addEventListener('DOMContentLoaded', function() {
    let calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',  // weekly schedule
        selectable: true,             // can select boxes
        nowIndicator: true,           // indicates what the current time is

        slotMinTime: "06:00:00",
        slotMaxTime: "30:00:00",      // exclusive of the last hour

        allDaySlot: false,            // probably should be off
        selectMirror: true,           // Draw a temporary event on select. 
        // slotLabelInterval: "01:00:00",
        // slotDuration: "00:15:00",     // default is 30

        select: function (asdf) {
            console.log(asdf);
            // calendar.addEvent(asdf);
        },

        eventClick: function(info) {

            console.log('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);

        

        }
    });
    calendar.render();


    updateCalendar();

    // Assign onclicks to these classes..
    $(".fc-next-button").click(updateCalendar);
    $(".fc-prev-button").click(updateCalendar);
    $(".fc-today-button").click(updateCalendar);
});
  
/*

{start: Wed Dec 14 2022 22:00:00 GMT-0500 (Eastern Standard Time), 
end: Thu Dec 15 2022 00:00:00 GMT-0500 (Eastern Standard Time), 
startStr: '2022-12-14T22:00:00-05:00', 
endStr: '2022-12-15T00:00:00-05:00', 
allDay: false}
*/


function updateCalendar() {
    // remove existing events...
    calendar.removeAllEvents();

    let startDate = calendar.view.activeStart;
    let endDate = calendar.view.activeEnd;

    let startStr = (startDate.toISOString().split('T')[0]);
    let endStr = (endDate.toISOString().split('T')[0]);

    $.ajax({
        url: `/planner/get-schedule-items/${startStr}/${endStr}/`,
        success: add_calendar_items,
        failure: ajax_error,
    });
}


function add_calendar_items(items) {
    console.log(items);
    $(items).each(function() {
        calendar.addEvent({
            title: this.title,
            start: this.startTime,
            end: this.endTime,
            backgroundColor: this.color,
        });
    })

}


function ajax_error(error) {
    console.log("some sort of server error or something");

    $("#schedule-errors").html(`
        <div class="alert alert-danger" role="alert">
            Something went wrong... probably a connection problem. Server response: ${error}
        </div>
    `);
}

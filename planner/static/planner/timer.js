
// Variables for stopwatch functionality
var stopwatch_interval;
// var t0;
// var stopwatch_time;


// Initialize the timer if need be on the page load. 
$(document).ready(function () {
    if ($("#event-cards").data("current-block") != 0){
        initialize_timer()
    }
})


function start_timer(event) {
    // Should first send a request to server for the server
    // to gauge if it is a good idea to start a request or not.
    $.ajax({
        url: `/planner/start-timer/${event}/`,
        success: start_timer_success,
        failure: ajax_error,
    });

}

function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
  
    return hrs + ':' + mins + ':' + secs;
  }


function start_timer_success(data) {
    if (!data.ok) {
        // show error, return
        server_error(data.reason);
        return;
    }

    // Remove the start button and show the other stuff. 
    $("#event-cards").data("current-block", data.event);

    initialize_timer();
}


function initialize_timer() {
    let event_id = $("#event-cards").data("current-block")
    let curr_duration = parseFloat($("#event-cards").data("current-length"))


    $(`#start-timer-div-${event_id}`).addClass("hidden");
    $(`#end-timer-div-${event_id}`).removeClass("hidden");

    // Disable other start buttons. 
    $(".start-btn").attr('disabled', true);
    
    var t0 = performance.now();
    var stopwatch_time = `#elapsed-time-${event_id}`;

    stopwatch_interval = setInterval(function () {
        let time_elapsed = (performance.now() - t0) + curr_duration;
        $(stopwatch_time).html(`Time elapsed: ${msToTime(time_elapsed)}`);
    }, 1000);
}


function ajax_error(error) {
    console.log("some sort of server error or something");

    $("#timer-errors").html(`
        <div class="alert alert-danger" role="alert">
            Something went wrong... probably a connection problem. Server response: ${error}
        </div>
    `);
}

function server_error(reason) {
    $("#timer-errors").html(`
        <div class="alert alert-danger" role="alert">
            Something went wrong... Server response: ${reason}
        </div>
    `);
}

function end_timer(event) {

    $.ajax({
        url: `/planner/timer-startend/${event}/`,
        success: timer_startend,
        failure: ajax_error,
    });
}

function timer_startend(data) {
    if (!data.ok) {
        server_error(data.reason);
        return;
    }

    // Initialize the input values...
    $("#modal-start-date").val(data.start_date);
    $("#modal-start-time").val(data.start_time);

    $("#modal-end-date").val(data.end_date);
    $("#modal-end-time").val(data.end_time);

    // Toggle the modal.
    $("#duration-confirmation-modal").modal('toggle');
    // Done !

}


// try implementing this with a post request
// use a csrf_token...
function delete_timer() {
    // delete event.currently_tracking
    // clear event.currently_tracking
}


// try implementing this with a post request
// use a csrf_token...
function save_timer() {
    // submit the form to the server and have it update the 
    // calendar item end date + remove the event.currently_tracking
    
    // pretty simple honestly. 
}

// can reload the page here, can not reload the page as well
// (which is the preference...)
function reset_page() {

}
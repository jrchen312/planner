
// Variables for stopwatch functionality
var stopwatch_interval;
// var t0;
// var stopwatch_time;

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
  
    return hrs + ':' + mins + ':' + secs + '.' + ms;
  }


function start_timer_success(data) {
    if (!data.ok) {
        // show error, return
        $("#timer-errors").html(`
            <div class="alert alert-danger" role="alert">
                Something went wrong... Server response: ${data.reason}
            </div>
        `);
        return;
    }

    // Remove the start button and show the other stuff. 
    let event = data.event;

    $(`#start-timer-div-${event}`).addClass("hidden");
    $(`#end-timer-div-${event}`).removeClass("hidden");


    // Disable other start buttons. 
    $(".start-btn").attr('disabled', true);
    
    var t0 = performance.now();
    var stopwatch_time = `#elapsed-time-${event}`;

    stopwatch_interval = setInterval(function () {
        let time_elapsed = performance.now() - t0;
        $(stopwatch_time).html(`Time elapsed: ${msToTime(time_elapsed)}`);
    }, 1000);

}
v
function ajax_error(error) {
    console.log("some sort of server error or something");

    $("#timer-errors").html(`
        <div class="alert alert-danger" role="alert">
            Something went wrong... Server response: ${error}
        </div>
    `);
}

// Variables for stopwatch functionality
var stopwatch_interval;
// var t0;
// var stopwatch_time;


// Initialize the timer if need be on the page load. 
$(document).ready(function () {
    if ($("#event-cards").data("current-block") != 0){
        initialize_timer()
    }

    $(".todo-list-item").change(function(e, f) {
        // console.log($(this).prop('checked'));

        let todo_id = $(this).data("id");

        $(`#todo-${todo_id}`).attr('disabled', true);

        data = {
            todo_id: todo_id,
        }
    
        request = {
            csrfmiddlewaretoken:$('#modal-response-form input[name=csrfmiddlewaretoken]').val(),
            contents: JSON.stringify(data)
        };
    
        $.ajax({
            type: 'POST',
            url: $("#event-cards").data("check-todolist-url"),
            data: request,
    
            success: check_todo_item,
            error: (function (jqXHR, exception) {
                $(`#todo-${todo_id}`).attr('disabled', false);
                ajax_error(jqXHR, exception);
            }),
        });
    })
})


// serves AJAX request from server when uesr clicks on a checkbox. 
function check_todo_item(result) {

    $(`#todo-${result.todo_id}`).prop('checked', result.contents);
    $(`#todo-${result.todo_id}`).attr('disabled', false);

    if (result.contents) {
        $(`#todo-${result.todo_id}-label`).addClass("checked-item");
    } else {
        $(`#todo-${result.todo_id}-label`).removeClass("checked-item");
    }
}


// When user clicks the start timer button under one of the events. 
function start_timer(event) {
    // Should first send a request to server for the server
    // to gauge if it is a good idea to start a request or not.
    $.ajax({
        url: `/planner/start-timer/${event}/`,
        success: start_timer_success,
        failure: ajax_error,
    });

}


// Converts number of milliseconds to seconds
// formats the result into a string. s
function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
  
    var result = "";
    if (hrs != 0) {
        if (hrs == 1) {
            result += `${hrs} hr, `;
        } else {
            result += `${hrs} hrs, `;
        }
    }
    if (mins != 0) {
        if (mins == 1) {
            result += `${mins} min, `;
        } else {
            result += `${mins} mins, `;
        }
    }
    return result + `${secs} secs`;
    // return hrs + ':' + mins + ':' + secs;
  }


// Success function for starting a timer for an event. 
function start_timer_success(data) {
    if (!data.ok) {
        // show error, return
        server_error(data.reason);
        return;
    }

    // Set Event_ID data value. 
    $("#event-cards").data("current-block", data.event);

    initialize_timer();
}


// Initializes a timer with an interval. 
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
        $(stopwatch_time).html(msToTime(time_elapsed));
    }, 1000);
}


function ajax_error(jqXHR, exception) {
    var msg = '';
    if (jqXHR.status === 0) {
        msg = 'Not connect. Verify Network.';
    } else if (jqXHR.status == 404) {
        msg = 'Requested page not found. [404]';
    } else if (jqXHR.status == 500) {
        msg = 'Internal Server Error [500].';
    } else if (exception === 'parsererror') {
        msg = 'Requested JSON parse failed.';
    } else if (exception === 'timeout') {
        msg = 'Time out error.';
    } else if (exception === 'abort') {
        msg = 'Ajax request aborted.';
    } else {
        msg = 'Uncaught Error. ' + jqXHR.responseText;
    }

    $("#timer-errors").html(`
        <div class="alert alert-danger" role="alert">
            Something went wrong... probably a connection problem. Server response: ${msg}
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

    contents = {
        delete: true,
    };

    stop_timer_request(contents);
}


// try implementing this with a post request
// use a csrf_token...
function save_timer() {
    // submit the form to the server and have it update the 
    // calendar item end date + remove the event.currently_tracking

    contents = {
        delete: false,

        start_date: $("#modal-start-date").val(),
        start_time: $("#modal-start-time").val(),
        
        end_date: $("#modal-end-date").val(),
        end_time: $("#modal-end-time").val(),

        description: $("#modal-description").val(),
    };

    stop_timer_request(contents);
}

// can reload the page here, can not reload the page as well
// (which is the preference...)
function stop_timer_request(contents) {

    contents.event_id = parseInt($("#event-cards").data("current-block"));

    request = {
        csrfmiddlewaretoken:$('#modal-response-form input[name=csrfmiddlewaretoken]').val(),
        contents: JSON.stringify(contents)
    };

    $.ajax({
        type: 'POST',
        url: $("#modal-response-form").prop("action"),
        data: request,

        success: resetPage,
        error: ajax_error,
    });
}

function resetPage(response) {
    $("#duration-confirmation-modal").modal('toggle');

    if (!response.ok) {
        ajax_error(response.reason);
        return;
    }

    let event_id = $("#event-cards").data("current-block");

    // change the button back to normal.
    $(`#start-timer-div-${event_id}`).removeClass("hidden");
    $(`#end-timer-div-${event_id}`).addClass("hidden");
    
    // enable the rest of the buttons again. 
    $(".start-btn").attr('disabled', false);

    // Clear misc. metadata.
    $("#event-cards").data("current-block", 0);
    $("#event-cards").data("current-length", 0);
    clearInterval(stopwatch_interval);
}


/*
    If textarea is not empty...
    submit to server -> if request is ok:
        add the todo item to the list.
        clear text
    -> else:
        alert user.
*/
function addTodo(event_id) {
    let text = $(`#new_todo_${event_id}`).val()
    if (text.length == 0) {
        return;
    }
    $(`#todo-add-btn-${event_id}`).attr('disabled', true);

    data = {
        text: text,
        event_id: event_id,
    }

    request = {
        csrfmiddlewaretoken:$('#modal-response-form input[name=csrfmiddlewaretoken]').val(),
        contents: JSON.stringify(data)
    };

    $.ajax({
        type: 'POST',
        url: $("#event-cards").data("todolist-add-url"),
        data: request,

        success: update_todo,
        error: (function (jqXHR, exception) {
            $(`#todo-add-btn-${event_id}`).attr('disabled', false);
            ajax_error(jqXHR, exception);
        }),
    });
}


function update_todo(data) {
    $(`#todo-list-${data.event_id}`).append(`
    <div class="form-check">
        <input class="form-check-input todo-list-item" type="checkbox" id="todo-${data.todo_id}" data-id="${data.todo_id}">
        <label class="form-check-label" for="todo-${data.todo_id}" id="todo-${data.todo_id}-label">${data.contents}</label>
    </div>
    `);

    $(`#todo-add-btn-${data.event_id}`).attr('disabled', false);

    $(`#new_todo_${data.event_id}`).val("");
}


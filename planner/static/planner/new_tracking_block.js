

/*

Edits: should keep track of the number of indecies.

TODO: custom set of default colors that rotate around.
*/
$( document ).ready(function() {

    // Fill out the hidden form for the timezone. 
    $("#id_timezone").val(Intl.DateTimeFormat().resolvedOptions().timeZone);


    // custom form submission for the tracking form.
    // does the bootstrap validation and custom form submission. 
    let form = document.getElementById("tracking-form");
    form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            submit_form();
        }
        form.classList.add('was-validated');
        
    }, false);

});


function add_event() {
    let event_idx = $("#form-placement").data("index");

    // Increment to update the value.
    $("#form-placement").data("index", event_idx+1);
    
    // template for the new Event. 
    // don't forget about the delete button :p. 
    let new_div = `
        <div id="event-${event_idx}" data-event-index="${event_idx}" data-meeting-index="0" class="card my-4">
            <div class="card-header" style="height:48px;">
                <div class="position-relative">
                    <div class="position-absolute top-50 start-0">
                        <!-- <h4 class="card-title">Event ${event_idx}</h4> -->
                    </div>
                    <div class="position-absolute top-50 end-0">
                        <h4 style="cursor:pointer;" id="delete-event-${event_idx}"><i class="bi bi-x-lg"></i></h4>
                    </div>
                </div>
            </div>
        
            <div class="card-body">
                <div class="row">
                    <div class="col-10 mb-3">
                        <label for="id_name_${event_idx}" class="form-label">Name</label>
                        <input type="text" name="name-${event_idx}" class="form-control" required id="id_name_${event_idx}">
                    
                        <div class="invalid-feedback">Please choose a name.</div>
                    </div>
                    
                    <div class="col mb-3">
                        <div class="position-relative">
                            <div class="position-absolute top-0 end-0">
                                <label for="id_color_${event_idx}" class="form-label">Color</label>
                                <input type="color" class="form-control no-validate-color form-control-color" id="id_color_${event_idx}" name="color_${event_idx}" value="#563d7c" title="Choose a color for the event">
                            </div>
                        </div>
                    </div>
                </div>

                <div id="event-${event_idx}-meetings"></div>
            
            </div> <!-- End of card body -->


            <div class="card-footer" style="height:48px;">
                <button class="btn btn-success btn-sm" onclick="add_meeting(${event_idx}); return false;" title="Add new recurring meeting">
                    <i class="bi bi-calendar-plus"></i> Add
                </button>
            </div>
        
        </div> <!-- end of card -->
        `;

    $("#form-placement").append(new_div);

    $(`#delete-event-${event_idx}`).click(function () {
        $(`#event-${event_idx}`).remove();
    });

}



function add_meeting(event_idx) {
    let meeting_idx = $(`#event-${event_idx}`).data("meeting-index");

    // update the value
    $(`#event-${event_idx}`).data("meeting-index", meeting_idx+1);
    
    let new_div = `
        <div id="event-${event_idx}-meeting-${meeting_idx}" class="card my-5 text-bg-light" data-meeting-index="${meeting_idx}">
            <div class="card-body">

                <div class="row mb-3">
                    <div class="col-6">
                        <label for="id_start_time-${event_idx}-${meeting_idx}" class="form-label">Start time</label>
                        <input type="time" name="start_time-${event_idx}-${meeting_idx}" class="form-control" required id="id_start_time-${event_idx}-${meeting_idx}">
                        
                        <div class="invalid-feedback">Please select a start time.</div>
                    </div>

                    <div class="col-6">
                        <label for="id_end_time-${event_idx}-${meeting_idx}" class="form-label">End time</label>
                        <input type="time" name="end_time-${event_idx}-${meeting_idx}" class="form-control" required id="id_end_time-${event_idx}-${meeting_idx}">
                        
                        <div class="invalid-feedback">Please select an end time.</div>
                    </div>
                </div>

                <div class="col-12 mb-3" id="buttons">
                    <label for="id_mon-${event_idx}-${meeting_idx}" class="form-label">Days</label><br>
            
                    <input type="checkbox" name="mon-${event_idx}-${meeting_idx}" autocomplete="off" class="btn-check" id="id_mon-${event_idx}-${meeting_idx}">
                    <label class="btn btn-outline-secondary" for="id_mon-${event_idx}-${meeting_idx}">M</label>

                    <input type="checkbox" name="tues-${event_idx}-${meeting_idx}" autocomplete="off" class="btn-check" id="id_tues-${event_idx}-${meeting_idx}">
                    <label class="btn btn-outline-secondary" for="id_tues-${event_idx}-${meeting_idx}">T</label>

                    <input type="checkbox" name="wed-${event_idx}-${meeting_idx}" autocomplete="off" class="btn-check" id="id_wed-${event_idx}-${meeting_idx}">
                    <label class="btn btn-outline-secondary" for="id_wed-${event_idx}-${meeting_idx}">W</label>

                    <input type="checkbox" name="thurs-${event_idx}-${meeting_idx}" autocomplete="off" class="btn-check" id="id_thurs-${event_idx}-${meeting_idx}">
                    <label class="btn btn-outline-secondary" for="id_thurs-${event_idx}-${meeting_idx}">Th</label>

                    <input type="checkbox" name="fri-${event_idx}-${meeting_idx}" autocomplete="off" class="btn-check" id="id_fri-${event_idx}-${meeting_idx}">
                    <label class="btn btn-outline-secondary" for="id_fri-${event_idx}-${meeting_idx}">F</label>

                    <input type="checkbox" name="sat-${event_idx}-${meeting_idx}" autocomplete="off" class="btn-check" id="id_sat-${event_idx}-${meeting_idx}">
                    <label class="btn btn-outline-secondary" for="id_sat-${event_idx}-${meeting_idx}">Sa</label>

                    <input type="checkbox" name="sun-${event_idx}-${meeting_idx}" autocomplete="off" class="btn-check" id="id_sun-${event_idx}-${meeting_idx}">
                    <label class="btn btn-outline-secondary" for="id_sun-${event_idx}-${meeting_idx}">Su</label>
                    
                </div>

                <!-- Optional location field -->
                <div class="col-12 mb-3">
                    <label for="id_location-${event_idx}-${meeting_idx}" class="form-label">Location</label>
                    <input type="text" name="location-${event_idx}-${meeting_idx}" class="form-control" id="id_location-${event_idx}-${meeting_idx}">
                </div>

                <div>
                    <span class="remove-meeting-btn" id="remove-meeting-${event_idx}-${meeting_idx}" title="Remove Meeting">
                        Remove
                    </span>
                </div>
            </div>
        </div>
        `
    // add it to the event div placeholder. 
    $(`#event-${event_idx}-meetings`).append(new_div);

    // delete button functionality
    $(`#remove-meeting-${event_idx}-${meeting_idx}`).click(function () {
        $(`#event-${event_idx}-meeting-${meeting_idx}`).remove();
    });
}



// TODO add more validation to this thing. 
function submit_form() {
    let res = {};

    res.name = $("#id_name").val();
    res.start_date = $("#id_start_date").val();
    res.end_date = $("#id_end_date").val();
    res.timezone = $("#id_timezone").val();

    res.number_events = $("#form-placement").children().length;

    // for each children in the div...
    let counter = 0;
    $("#form-placement").children().each(function(index) {

        let event_idx = $(this).data("event-index"); // event index
        let event_data = {};
        
        event_data.name =  $(`#id_name_${event_idx}`).val();
        event_data.color = $(`#id_color_${event_idx}`).val();


        
        // for each meeting in the meetings div..
        event_data.number_meetings = $(`#event-${event_idx}-meetings`).children().length;

        let meeting_counter = 0;
        $(`#event-${event_idx}-meetings`).children().each(function(meeting_index) {

            let meeting_idx = $(this).data("meeting-index"); // meeting index
            let meeting_data = {};

            meeting_data.start_time = $(`#id_start_time-${event_idx}-${meeting_idx}`).val();
            meeting_data.end_time = $(`#id_end_time-${event_idx}-${meeting_idx}`).val();

            meeting_data.mon = $(`#id_mon-${event_idx}-${meeting_idx}`).prop('checked');
            meeting_data.tues = $(`#id_tues-${event_idx}-${meeting_idx}`).prop('checked');
            meeting_data.wed = $(`#id_wed-${event_idx}-${meeting_idx}`).prop('checked');
            meeting_data.thurs = $(`#id_thurs-${event_idx}-${meeting_idx}`).prop('checked');
            meeting_data.fri = $(`#id_fri-${event_idx}-${meeting_idx}`).prop('checked');
            meeting_data.sat = $(`#id_sat-${event_idx}-${meeting_idx}`).prop('checked');
            meeting_data.sun = $(`#id_sun-${event_idx}-${meeting_idx}`).prop('checked');

            meeting_data.location = $(`#id_location-${event_idx}-${meeting_idx}`).val();

            event_data[`meeting_${meeting_counter ++}`] = meeting_data;
        });
        
        // Done compiling the data for the event:
        res[`event_${counter ++}`] = event_data;
    });
    
    // Done compiling all form data. Store the form data into a hidden field.
    $("#id_json_data").val(JSON.stringify(res));

    // The form should submit now...
}


// convert django aware datetime to user time zone
// convert django aware datetime to different time zone
/*


https://docs.djangoproject.com/en/4.1/topics/i18n/timezones/#troubleshooting

*/
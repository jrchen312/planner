
/*

Edits: should probably keep track of the number of 
*/
$( document ).ready(function() {
    
    // "Add recurring meeting" button functionality
    // $("#add-meeting").click(function () {})

    // Fill out the hidden form for the timezone. 
    $("#id_timezone").val(Intl.DateTimeFormat().resolvedOptions().timeZone);
});


function add_event() {
    let current_idx = $("#form-placement").data("index");

    // Increment to update the value.
    $("#form-placement").data("index", current_idx+1);
    
    // template for the new Event. 
    // don't forget about the delete button :p. 
    let new_div = `
        <div id="event-${current_idx}" data-event-index="${current_idx}" data-meeting-index="0" class="card my-4">
            <div class="card-header" style="height:48px;">
                <div class="position-relative">
                    <div class="position-absolute top-50 start-0">
                        <!-- <h4 class="card-title">Event ${current_idx}</h4> -->
                    </div>
                    <div class="position-absolute top-50 end-0">
                        <h4 style="cursor:pointer;" id="delete-event-${current_idx}"><i class="bi bi-x-lg"></i></h4>
                    </div>
                </div>
            </div>
        
            <div class="card-body">
                <div class="row">
                    <div class="col-10 mb-3">
                        <label for="id_name-${current_idx}" class="form-label">Name</label>
                        <input type="text" name="name-${current_idx}" class="form-control" required id="id_name-${current_idx}">
                    
                        <div class="invalid-feedback">Please choose a name.</div>
                    </div>
                    
                    <div class="col mb-3">
                        <div class="position-relative">
                            <div class="position-absolute top-0 end-0">
                                <label for="colorInput-${current_idx}" class="form-label">Color</label>
                                <input type="color" class="form-control no-validate-color form-control-color" id="colorInput-${current_idx}" value="#563d7c" title="Choose a color for the event">
                            </div>
                        </div>
                    </div>
                </div>

                <div id="meetings-${current_idx}"></div>
            
            </div> <!-- End of card body -->


            <div class="card-footer" style="height:48px;">
                <button class="btn btn-success btn-sm" onclick="add_meeting(${current_idx}); return false;" title="Add new recurring meeting">
                    <i class="bi bi-calendar-plus"></i> Add
                </button>
            </div>
        
        </div> <!-- end of card -->
        `;

    $("#form-placement").append(new_div);

    $(`#delete-event-${current_idx}`).click(function () {
        $(`#event-${current_idx}`).remove();
    });

}



function add_meeting(event_id) {
    let meeting_idx = $(`#event-${event_id}`).data("meeting-index");

    // update the value
    $(`#event-${event_id}`).data("meeting-index", meeting_idx+1);
    
    let new_div = `
        <div id="event-${event_id}-meeting-${meeting_idx}" class="card my-5 text-bg-light" data-meeting-index="${meeting_idx}">
            <div class="card-body">

                <div class="row mb-3">
                    <div class="col-6">
                        <label for="id_start_time-${event_id}-${meeting_idx}" class="form-label">Start time</label>
                        <input type="time" name="start_time-${event_id}-${meeting_idx}" class="form-control" required id="id_start_time-${event_id}-${meeting_idx}">
                        
                        <div class="invalid-feedback">Please select a start time.</div>
                    </div>

                    <div class="col-6">
                        <label for="id_end_time-${event_id}-${meeting_idx}" class="form-label">End time</label>
                        <input type="time" name="end_time-${event_id}-${meeting_idx}" class="form-control" required id="id_end_time-${event_id}-${meeting_idx}">
                        
                        <div class="invalid-feedback">Please select an end time.</div>
                    </div>
                </div>

                <div class="col-12 mb-3" id="buttons">
                    <label for="id_mon-${event_id}-${meeting_idx}" class="form-label">Days</label><br>
            
                    <input type="checkbox" name="mon-${event_id}-${meeting_idx}" autocomplete="off" class="btn-check" id="id_mon-${event_id}-${meeting_idx}">
                    <label class="btn btn-outline-secondary" for="id_mon-${event_id}-${meeting_idx}">M</label>

                    <input type="checkbox" name="tues-${event_id}-${meeting_idx}" autocomplete="off" class="btn-check" id="id_tues-${event_id}-${meeting_idx}">
                    <label class="btn btn-outline-secondary" for="id_tues-${event_id}-${meeting_idx}">T</label>

                    <input type="checkbox" name="wed-${event_id}-${meeting_idx}" autocomplete="off" class="btn-check" id="id_wed-${event_id}-${meeting_idx}">
                    <label class="btn btn-outline-secondary" for="id_wed-${event_id}-${meeting_idx}">W</label>

                    <input type="checkbox" name="thurs-${event_id}-${meeting_idx}" autocomplete="off" class="btn-check" id="id_thurs-${event_id}-${meeting_idx}">
                    <label class="btn btn-outline-secondary" for="id_thurs-${event_id}-${meeting_idx}">Th</label>

                    <input type="checkbox" name="fri-${event_id}-${meeting_idx}" autocomplete="off" class="btn-check" id="id_fri-${event_id}-${meeting_idx}">
                    <label class="btn btn-outline-secondary" for="id_fri-${event_id}-${meeting_idx}">F</label>

                    <input type="checkbox" name="sat-${event_id}-${meeting_idx}" autocomplete="off" class="btn-check" id="id_sat-${event_id}-${meeting_idx}">
                    <label class="btn btn-outline-secondary" for="id_sat-${event_id}-${meeting_idx}">Sa</label>

                    <input type="checkbox" name="sun-${event_id}-${meeting_idx}" autocomplete="off" class="btn-check" id="id_sun-${event_id}-${meeting_idx}">
                    <label class="btn btn-outline-secondary" for="id_sun-${event_id}-${meeting_idx}">Su</label>
                    
                </div>

                <!-- Optional location field -->
                <div class="col-12 mb-3">
                    <label for="id_location-${event_id}-${meeting_idx}" class="form-label">Location</label>
                    <input type="text" name="location-${event_id}-${meeting_idx}" class="form-control" id="id_location-${event_id}-${meeting_idx}">
                </div>

                <div>
                    <span class="remove-meeting-btn" id="remove-meeting-${event_id}-${meeting_idx}" title="Remove Meeting">
                        Remove
                    </span>
                </div>
            </div>
        </div>
        `
    // add it to the event div placeholder. 
    $(`#meetings-${event_id}`).append(new_div);

    // delete button functionality
    $(`#remove-meeting-${event_id}-${meeting_idx}`).click(function () {
        $(`#event-${event_id}-meeting-${meeting_idx}`).remove();
    });
}



function submit_form() {
    let res = {};
    
}
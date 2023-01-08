from django.shortcuts import render, redirect
from django.urls import reverse
from django.http import HttpResponse

from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User

from planner.forms import TrackingBlockForm
from planner.models import Profile, TrackingBlock, Event, CalendarItem

from django.utils import timezone
import datetime
import zoneinfo
import json


# Oauth checker thing
# Problems arise if you try to switch a different acount while one account is 
# already logged in. 
def _known_user_check(action_function):
    def my_wrapper_function(request, *args, **kwargs):

        if 'picture' not in request.session:
            try:
                request.session['picture'] = request.user.social_auth.get(provider='google-oauth2').extra_data['picture']
            except:
                request.session['picture'] = "z"

        try:
            User.objects.get(id=request.user.id).profile
        except:
            print("Making a new profile...")
            Profile.objects.create(user = request.user, picture = request.session['picture'])

        return action_function(request, *args, **kwargs)

    return my_wrapper_function



# Process request post data. 
# Data is a dictionary with all of the results necessary. 
def _process_new_block(profile, data):
    name = data["name"]
    start_date = datetime.date.fromisoformat(data["start_date"])
    end_date = datetime.date.fromisoformat(data["end_date"])
    timezone = data["timezone"]

    # Save a new timezone to the profile if need be. 
    if profile.current_timezone == None:
        profile.current_timezone = timezone
        profile.save()

    new_block = TrackingBlock.objects.create(
        profile = profile,
        start = start_date,
        end = end_date,
        name = name,
        timezone = timezone,
    )

    profile.current_tracking_block = new_block
    profile.save()

    meeting_days = [list() for _ in range(7)]

    for event_num in range(data["number_events"]):
        event = data[f"event_{event_num}"]

        event_name = event["name"]
        event_color = event["color"]

        new_event = Event.objects.create(
            block = new_block,
            color = event_color,
            name = event_name,
            currently_tracking = None,
        )

        for meeting_num in range(event["number_meetings"]):
            meeting = event[f"meeting_{meeting_num}"]

            start_time = meeting["start_time"]
            end_time = meeting["end_time"]
            location = meeting["location"]

            mon = (meeting["mon"])
            tues = (meeting["tues"])
            wed = (meeting["wed"])
            thurs = (meeting["thurs"])
            fri = (meeting["fri"])
            sat = (meeting["sat"])
            sun = (meeting["sun"])

            meeting_info = {
                "start_time": start_time,
                "end_time": end_time,
                "location": location,

                "event": new_event,
            }

            if mon: meeting_days[0].append(meeting_info)
            if tues: meeting_days[1].append(meeting_info)
            if wed: meeting_days[2].append(meeting_info)
            if thurs: meeting_days[3].append(meeting_info)
            if fri: meeting_days[4].append(meeting_info)
            if sat: meeting_days[5].append(meeting_info)
            if sun: meeting_days[6].append(meeting_info)

    # Iterate through each day from start_date to end_date.
    # If the day of week is in mon/tues, then create 
    delta = datetime.timedelta(days=1)
    timezone_tz = zoneinfo.ZoneInfo(timezone)

    while start_date <= end_date:
        # do something...
        for meeting in meeting_days[start_date.weekday()]:
            m_s_time = datetime.time.fromisoformat(meeting["start_time"])
            m_e_time = datetime.time.fromisoformat(meeting["end_time"])

            s_datetime = datetime.datetime(start_date.year, start_date.month, 
                                           start_date.day, m_s_time.hour,
                                           m_s_time.minute, tzinfo=timezone_tz)
            
            e_datetime = datetime.datetime(start_date.year, start_date.month, 
                                           start_date.day, m_e_time.hour,
                                           m_e_time.minute, tzinfo=timezone_tz)
            
            # if the e_datetime goes into the next day, increment the day...
            if e_datetime < s_datetime:
                e_datetime += delta

            # Should be good to create the calendar object. 
            CalendarItem.objects.create(
                event = meeting["event"],
                location = meeting["location"],
                startTime = s_datetime,

                endTime = e_datetime)

        # Go to the next date. 
        start_date += delta


# new tracking block page
@login_required
@_known_user_check
def new_tracking_block(request):
    form = TrackingBlockForm()

    if request.method == 'POST':
        data = json.loads(request.POST["json_data"])
        try:
            profile = User.objects.get(id=request.user.id).profile
            _process_new_block(profile, data)
            return redirect(reverse("timer"))

        except Exception as e:
            print(e)

            return render(request, "planner/new_tracking_block.html", 
                          {"form":form, "hacking":True})

    return render(request, "planner/new_tracking_block.html", {"form":form})


@login_required
@_known_user_check
def get_timer_startend(request, event_id):
    profile = request.user.profile

    response = {"ok": True, "reason":"", "start":"", "end":""}

    # get the event, if it exists
    try:
        event = Event.objects.get(id=event_id)
    except:
        response["ok"] = False
        response["reason"] = "Event ID not found, stop hacking"
    
    # Make sure there is something being tracked
    if response["ok"]:
        if event.currently_tracking == None:
            response["ok"] = False
            response["reason"] = "Currently tracked event not found"

    # Get start time, convert it to the user's timezone. 
    # Get the curent time as end time, convert it to the user's timezone. 
    if response["ok"]:
        timezone_tz = zoneinfo.ZoneInfo(profile.current_timezone)

        s = event.currently_tracking.startTime
        s_converted = s.astimezone(timezone_tz)

        # i think this is the right format needed. 
        response["start_time"] = s_converted.strftime("%H:%M:%S")
        response["start_date"] = s_converted.strftime("%Y-%m-%d")

        e = timezone.now()
        e_converted = e.astimezone(timezone_tz)
        response["end_time"]
        response["end_date"]
        


@login_required
@_known_user_check
def start_timer(request, event_id):
    profile = request.user.profile

    response = {"ok": True, "reason": "", "event": event_id}

    event = Event.objects.get(id=event_id)

    # Check that the profile actually made the event. 
    if (profile.id != event.block.profile.id):
        # print("different user, can't do this, stop hacking, ratio. ")
        response["ok"] = False
        response["reason"] = "You didn't make this event, stop hacking."


    # Check that there are no other events currently being tracked in the block.
    if response["ok"]:
        for ev in event.block.events.all():
            if ev.currently_tracking != None:
                response["ok"] = False
                response["reason"] = f"You can only track one event at a time, and {ev.name} still has something ongoing."
    
    # Everything is ok, go ahead, make the element...
    cal = CalendarItem.objects.create(
        event=event,
        startTime=timezone.now()
    )
    event.currently_tracking = cal;
    event.save()

    # Should be good to go
    response_json = json.dumps(response, default=str)
    return HttpResponse(response_json, content_type='application/json')


@login_required
@_known_user_check
def timer(request):
    profile = request.user.profile

    current_block = profile.current_tracking_block
    events = []

    if current_block != None:
        sorted_events = current_block.events.all().order_by('-update_time')
        events = [e for e in sorted_events]

    context = {
        "curr_block": current_block,
        "events": events,
    }

    print(context)
    return render(request, "planner/timer.html", context)

@login_required
@_known_user_check
def schedule(request):
    return render(request, "planner/schedule.html", {})

@login_required
@_known_user_check
def profile(request):
    return render(request, "planner/profile.html", {})

# page that closes the window
def logged_in(request):
    return render(request, "planner/logged_in.html", {})


# useful ajax point. 
def check_logged_in(request):
    # res = {
    #     "in": False if (request.user.id == None) else True
    # }
    res = { "in": request.user.is_authenticated }
    response_json = json.dumps(res, default=str)
    return HttpResponse(response_json, content_type='application/json')


def home(request):
    if not request.session.session_key:
        request.session.create()

    print(request.session.session_key)

    return render(request, "planner/home.html", {})
from django.shortcuts import render, redirect
from django.urls import reverse

from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User

from planner.forms import TrackingBlockForm
from planner.models import Profile, TrackingBlock, Event, CalendarItem

import datetime
import zoneinfo
import json


# Oauth checker thing
# Problems arise if you try to switch a different acount while one account is 
# already logged in. 
def _known_user_check(action_function):
    def my_wrapper_function(request, *args, **kwargs):

        if 'picture' not in request.session:
            request.session['picture'] = request.user.social_auth.get(provider='google-oauth2').extra_data['picture']

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

    new_block = TrackingBlock.objects.create(
        profile = profile, # TODO replace this. 
        start = start_date,
        end = end_date,
        name = name,
        timezone = timezone,
    )

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
def timer(request):
    return render(request, "planner/timer.html", {})

@login_required
@_known_user_check
def schedule(request):
    return render(request, "planner/schedule.html", {})
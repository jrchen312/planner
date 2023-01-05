from django.shortcuts import render
from planner.forms import TrackingBlockForm
from planner.models import Profile, TrackingBlock, Event, CalendarItem
import datetime
import zoneinfo

# Create your views here.

# Process request post data. 
def _process_new_block(data):
    name = data["name"]
    start_date = datetime.date.fromisoformat(data["start_date"])
    end_date = datetime.date.fromisoformat(data["end_date"])
    timezone = data["timezone"]

    new_block = TrackingBlock.objects.create(
        profile = None, # TODO replace this. 
        start = start_date,
        end = end_date,
        name = name,
        timezone = timezone,
    )

    meeting_days = [list() for _ in range(7)]

    number_events = int(data["number_events"])
    for event_num in range(number_events):
        event_key_str = f"event_{event_num}"
        # event = data[f"event_{event_num}"]

        event_name= data[event_key_str + "[name]"]
        event_color = data[event_key_str + "[color]"]

        new_event = Event.objects.create(
            block = new_block,
            color = event_color,
            name = event_name,
            currently_tracking = None,
        )

        number_meetings = int(data[event_key_str + "[number_meetings]"])
        for meeting_num in range(number_meetings):
            meeting_key_str = event_key_str + f"[meeting_{meeting_num}]"

            start_time = data[meeting_key_str + "[start_time]"]
            end_time = data[meeting_key_str + "[end_time]"]
            location = data[meeting_key_str + "[location]"]

            mon = (data[meeting_key_str + "[mon]"]) == "true"
            tues = (data[meeting_key_str + "[tues]"]) == "true"
            wed = (data[meeting_key_str + "[wed]"]) == "true"
            thurs = (data[meeting_key_str + "[thurs]"]) == "true"
            fri = (data[meeting_key_str + "[fri]"]) == "true"
            sat = (data[meeting_key_str + "[sat]"]) == "true"
            sun = (data[meeting_key_str + "[sun]"]) == "true"

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

    print(meeting_days)

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
def new_tracking_block(request):
    if request.method == 'POST':
        print(request.POST.dict())
        print()
        print(request.POST.dict().keys())
        _process_new_block(request.POST)
        print("DONE ! ")

    form = TrackingBlockForm()

    return render(request, "planner/new_tracking_block.html", {"form":form})


def timer(request):
    return render(request, "planner/timer.html", {})

def schedule(request):
    return render(request, "planner/schedule.html", {})

from django.urls import path
from planner.views import *

urlpatterns = [
    # AJAX
    path('check-logged-in/', check_logged_in, name="check-logged-in"),
    path('start-timer/<int:event_id>/', start_timer, name="start-timer"),
    path('timer-startend/<int:event_id>/', get_timer_startend, name="get-timer-startend"),
    path('get-schedule-items/<str:start_date>/<str:end_date>/', get_schedule_items),
    path('stop-timer/', stop_timer, name="stop-timer"),

    # Pages
    path('', home, name="planner-home"),
    path('logged-in/', logged_in), # redirect url for oauth login. 
    path('timer/', timer, name="timer"),
    path('schedule/', schedule, name="schedule"),
    path('new/', new_tracking_block, name="new-tracking-block"),
    path('profile/', profile, name="profile"),
]


from django.urls import path
from planner.views import *

urlpatterns = [
    # 
    path('check-logged-in/', check_logged_in, name="check-logged-in"),

    path('', home, name="planner-home"),
    path('logged-in/', logged_in),
    path('timer/', timer, name="timer"),
    path('schedule/', schedule, name="schedule"),
    path('new/', new_tracking_block, name="new-tracking-block"),
]

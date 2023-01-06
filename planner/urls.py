
from django.urls import path
from planner.views import *

urlpatterns = [
    path('', timer, name="timer"),
    path('schedule/', schedule, name="schedule"),
    path('new/', new_tracking_block, name="new-tracking-block"),
]

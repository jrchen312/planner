from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist

# Create your models here.

class Profile(models.Model):
    user            = models.OneToOneField(User, on_delete=models.PROTECT, related_name="profile")
    picture         = models.CharField(max_length=200) #holds a link to google url. 

    # settings
    current_tracking_block = models.OneToOneField('TrackingBlock', on_delete=models.CASCADE, related_name="+", null=True)
    current_timezone = models.CharField(max_length=100, null=True)

    start_time = models.IntegerField(default=6)
    todolist_duration = models.IntegerField(default=24)


class TrackingBlock(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="tracking_blocks", null=True)

    start = models.DateField()
    end = models.DateField()

    name = models.CharField(max_length=200)
    timezone = models.CharField(max_length=200, null=True)
    
    description = models.CharField(max_length=500, blank=True)


class Event(models.Model):
    block = models.ForeignKey(TrackingBlock, on_delete=models.CASCADE, related_name="events")

    color = models.CharField(max_length=100)
    name = models.CharField(max_length=200)

    currently_tracking = models.OneToOneField('CalendarItem', on_delete=models.SET_NULL, related_name="+", null=True)

    update_time = models.DateTimeField(auto_now=True)
    

class ToDoListElement(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="todo_list")
    contents = models.CharField(max_length=300)

    finished = models.BooleanField(default=False)

    update_time = models.DateTimeField(auto_now=True)


class CalendarItem(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="calendar_items")

    location = models.CharField(blank=True, max_length=200)
    description = models.CharField(blank=True, max_length=200)

    startTime = models.DateTimeField()
    endTime = models.DateTimeField(null=True)



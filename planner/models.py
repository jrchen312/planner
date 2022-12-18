from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist

# Create your models here.

class Profile(models.Model):
    user            = models.OneToOneField(User, on_delete=models.PROTECT, related_name="profile")
    picture         = models.FileField()
    content_type    = models.CharField(max_length=50)


class TrackingBlock(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="tracking_blocks")

    start = models.DateField()
    end = models.DateField()

    name = models.CharField(max_length=200)
    description = models.CharField(max_length=500)


class Event(models.Model):
    block = models.ForeignKey(TrackingBlock, on_delete=models.CASCADE, related_name="events")

    color = models.CharField(max_length=100)
    name = models.CharField(max_length=200)

    currently_tracking = models.OneToOneField('CalendarItem', on_delete=models.CASCADE, related_name="+", null=True)
    

class CalendarItem(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="calendar_items")

    location = models.CharField(blank=True, max_length=200)

    startTime = models.DateField()
    endTime = models.DateField(null=True)



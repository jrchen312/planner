from django.shortcuts import render
from planner.forms import TrackingBlockForm
# Create your views here.

def new_tracking_block(request):
    form = TrackingBlockForm()
    return render(request, "planner/new_tracking_block.html", {"form":form})

def timer(request):
    return render(request, "planner/timer.html", {})

def schedule(request):
    return render(request, "planner/schedule.html", {})
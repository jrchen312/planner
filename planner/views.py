from django.shortcuts import render

# Create your views here.


def timer(request):
    return render(request, "planner/timer.html", {})

def schedule(request):

    return render(request, "planner/schedule.html", {})
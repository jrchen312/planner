from django import forms
from django.forms import Textarea, DateInput, TimeInput, SelectMultiple
 
# from freefood.models import Event

class TrackingBlockForm(forms.Form):
    start_date = forms.DateField()
    end_date = forms.DateField()

    name = forms.CharField()
    
    timezone = forms.CharField()

    


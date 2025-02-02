from django.contrib import admin
from .models import UserProfile

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'free_uploads_remaining', 'total_uploads')
    search_fields = ('user__username', 'email')
    list_filter = ('free_uploads_remaining',)

    # Optional: Customize the form used for editing UserProfile
    fieldsets = (
        (None, {
            'fields': ('user', 'email')
        }),
        ('Uploads', {
            'fields': ('free_uploads_remaining', 'total_uploads')
        }),
    )

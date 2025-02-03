from django.contrib import admin
from .models import UserProfile
from .models import Animal, Upload, Vote, UserProfile

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

@admin.register(Animal)
class AnimalAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'created_at', 'votes', 'user_nickname')

    def user_nickname(self, obj):
        return obj.user.username  # Fetch the username from the user
    user_nickname.short_description = "User Nickname"  # Optional: Label for admin column

@admin.register(Upload)
class UploadAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'name', 'category', 'created_at')
    list_filter = ('category', 'created_at')
    search_fields = ('name', 'user__username')

@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'animal', 'vote_value', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'animal__name')

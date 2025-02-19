from django.urls import path
from .views import (
    create_or_update_user,
    get_user_profile,
    upload_animal,
    approve_upload,
    upload_list,
    leaderboard_view,
    delete_upload,
    delete_animal,
    submit_vote,
    get_random_animals,
    contact,
    admin_reset_free_uploads,
    current_leaderboard_winners
)


urlpatterns = [
    path("create-user/", create_or_update_user, name="create-user"),
    path('userprofile/', get_user_profile, name='userprofile'),
    path('upload/', upload_animal, name='upload-animal'),
    path('approve-upload/<int:upload_id>/', approve_upload, name='approve-upload'),
    path('uploads/', upload_list, name='upload-list'),
    path('leaderboard/<str:category>/', leaderboard_view, name='leaderboard'),
    path('delete-upload/<int:upload_id>/', delete_upload, name='delete_upload'),
    path('delete-animal/<int:animal_id>/', delete_animal, name='delete_animal'),
    path("get-random-animals/<str:category>/", get_random_animals, name="get_random_animals"),
    path("submit-vote/", submit_vote, name="submit_vote"),
    path("contact/", contact, name="contact"),
    path("admin_reset_free_uploads/", admin_reset_free_uploads, name="admin_reset_free_uploads"),
    path("current-leaderboard-winners/", current_leaderboard_winners, name="current-leaderboard-winners")
]

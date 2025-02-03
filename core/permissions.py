from rest_framework.permissions import BasePermission

class IsSuperStaff(BasePermission):
    """
    Allows access only to superstaff users.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_staff

from django.db import models
from custom_auth.models import AppUser
from django.utils.translation import gettext_lazy as _

# Create your models here.


class Friending(models.Model):
    class FriendState(models.TextChoices):
        PENDING = "PE", _("Pending")
        FRIENDED = "FR", _("Friended")

    first = models.ForeignKey(
        AppUser, related_name='first_friending', on_delete=models.CASCADE)
    second = models.ForeignKey(
        AppUser, related_name='second_friending', on_delete=models.CASCADE)
    sent = models.BigIntegerField('request_sent_user')
    state = models.CharField(
        max_length=2,
        choices=FriendState.choices,
        default=FriendState.PENDING,
    )
    friend_datetime = models.DateTimeField(
        'datetime friended', null=True, default=None)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['first', 'second'], name='friend_request')
        ]
        indexes = [
            models.Index(fields=('first', 'second')),
        ]

    @classmethod
    def are_friends(cls, user1, user2):
        smallId = min(user1.id, user2.id)
        bigId = max(user1.id, user2.id)
        return cls.objects.filter(first_id=smallId, second_id=bigId).filter(state=cls.FriendState.FRIENDED).exists()

    class State:
        non_friend = 'NON-FRIEND'
        request_sent = 'REQUEST-SENT'
        request_received = 'REQUEST-RECEIVED'
        friend = 'FRIEND'

    @classmethod
    def get_state(cls, user1, user2):
        smallId = min(user1.id, user2.id)
        bigId = max(user1.id, user2.id)
        q = cls.objects.filter(first_id=smallId, second_id=bigId)
        if not q.exists():
            return cls.State.non_friend
        # q exists
        rec = q.get()
        if rec.state == cls.FriendState.FRIENDED:
            return cls.State.friend
        # FriendState == 'PENDING'
        if rec.sent == user1.id:
            return cls.State.request_sent
        else:
            return cls.State.request_received

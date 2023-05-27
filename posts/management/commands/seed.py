# <project>/<app>/management/commands/seed.py
import time
from django.core.management.base import BaseCommand
import random
import logging
from users.models import AppUser
from posts.models import Post
from friending.models import Friending
import random

logger = logging.getLogger('simple_example')
logger.setLevel(logging.DEBUG)

# python manage.py seed --mode=refresh

""" Clear all data and creates addresses """
MODE_REFRESH = 'refresh'

""" Clear all data and do not create any object """
MODE_GENERATE = 'generate'


class Command(BaseCommand):
    help = "seed database for testing and development."

    def add_arguments(self, parser):
        parser.add_argument('--mode', type=str, help="Mode")

    def handle(self, *args, **options):
        self.stdout.write('seeding data...')
        run_seed(self, options['mode'])
        self.stdout.write('done.')


def clear_data():
    """Deletes all the table data"""
    print('Clearing data!!')


NUM_USERS = 30
NUM_POSTS_MIN = 10
NUM_POSTS_MAX = 50
NUM_FRIENDS_MIN = 5
NUM_FRIENDS_MAX = 25

images = [
    'media/profile_pictures/anne-hathaway_wtefas.jpg',
    'media/profile_pictures//tuong_san_pzuffr.jpg',
    'media/profile_pictures/A-Hau-Tuong-San-2-01_zyvldm.jpg',
    'media/profile_pictures/tang_thanh_ha_rbryku.jpg',
    'media/profile_pictures/chris_e9yeky.jpg',
    'media/profile_pictures/casemiro_xwaave.jpg',
    'media/profile_pictures/elizabeth_olsen_etrm8v.jpg',
    'media/profile_pictures/Cristiano_Ronaldo_2018_llglx2.jpg',
    'media/profile_pictures/scarlett_johansson_p7ctuy.jpg',
    'media/profile_pictures/katheryn_winnick_i00jun.jpg',
]


def generate():
    # make users and posts
    logger.info("Generating {} users.".format(NUM_USERS))
    for i in range(NUM_USERS):
        new_user = AppUser.make_user()
        if not new_user:
            continue
        num_posts = random.randint(NUM_POSTS_MIN, NUM_POSTS_MAX)
        logger.info("Generating {} posts for user {}.".format(
            num_posts, new_user))
        for j in range(num_posts):
            Post.make_post(new_user)

    # make friendings
    all_users = AppUser.objects.all()
    users_count = all_users.count()
    for i in range(users_count):
        current_user = all_users[i]
        current_user_new_friends = random.randint(
            NUM_FRIENDS_MIN, NUM_FRIENDS_MAX)
        logger.info("Generating {} friendings for user {}.".format(
            current_user_new_friends, current_user))
        for j in range(current_user_new_friends):
            new_friend = all_users[random.randint(0, users_count-1)]
            try:
                Friending.make_friends(current_user, new_friend)
            except Exception:
                pass


def generate_likes():
    all_users = AppUser.objects.all()
    users_count = all_users.count()
    for i in range(users_count):
        user = all_users[i]
        all_friends = Friending.get_all_friend_users(user)
        num_friends = int(len(all_friends) / 2)
        for j in range(num_friends):
            friend = all_friends[random.randint(0, len(all_friends)-1)]
            all_posts_qs = friend.post_set.all()
            num_posts = int(all_posts_qs.count() / 2)
            for k in range(num_posts):
                idx = random.randint(0, all_posts_qs.count() - 1)
                post = all_posts_qs[idx]
                post.likes.add(user)


def update_profile_picture():
    all_users = AppUser.objects.all()
    for i in range(all_users.count()):
        user = all_users[i]
        user.profile_picture = images[random.randint(0, len(images)-1)]
        user.save()


def generate_friend_requests():
    all_users = AppUser.objects.all()
    users_count = all_users.count()
    for i in range(users_count):
        current_user = all_users[i]
        for j in range(3):
            other_user = all_users[random.randint(0, users_count-1)]
            try:
                Friending.make_friend_requests(current_user, other_user)
            except Exception:
                pass


def randomize_datetimes():
    from random import randrange
    from datetime import timedelta, datetime
    import pytz

    def random_date(start, end):
        """
        This function will return a random datetime between two datetime 
        objects.
        """
        delta = end - start
        int_delta = (delta.days * 24 * 60 * 60) + delta.seconds
        random_second = randrange(int_delta)
        return (start + timedelta(seconds=random_second)).replace(tzinfo=pytz.utc)

    d1 = datetime.strptime('1/1/2008 1:30 PM', '%m/%d/%Y %I:%M %p')
    d2 = datetime.strptime('5/25/2023 4:50 AM', '%m/%d/%Y %I:%M %p')

    start_time = time.time()

    counter = 0
    posts = Post.objects.all()
    for post in posts:
        post.pub_datetime = random_date(d1, d2)
        # post.save()
    Post.objects.bulk_update(posts, ["pub_datetime"])

    print("--- %.2f seconds ---" % (time.time() - start_time))


def test_bulk():
    ids = [u.id for u in Post.objects.all()]

    start_time = time.time()
    for id in ids:
        n = Post.objects.filter(pk=id).get().post_text
    print("--- %.2f seconds ---" % (time.time() - start_time))

    start_time = time.time()
    for u in Post.objects.filter(pk__in=ids):
        n = u.post_text
    print("--- %.2f seconds ---" % (time.time() - start_time))


def run_seed(self, mode):
    """ Seed database based on mode

    :param mode: generate
    :return:
    """

    match mode:
        case "test":
            # print("Generating datetimes!!")
            test_bulk()


# python manage.py seed --mode=dt

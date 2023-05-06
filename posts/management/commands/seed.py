# <project>/<app>/management/commands/seed.py
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


def run_seed(self, mode):
    """ Seed database based on mode

    :param mode: generate
    :return:
    """
    if mode != MODE_GENERATE:
        return
    # generate()
    generate_friend_requests()

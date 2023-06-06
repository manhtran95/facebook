# <project>/<app>/management/commands/seed.py
import pytz
from datetime import timedelta, datetime
from random import randrange
import time
from django.core.management.base import BaseCommand
import random
import logging
from users.models import AppUser
from posts.models import Post, Photo
from friending.models import Friending

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
        parser.add_argument('--num-users', type=str, help="Mode")

    def handle(self, *args, **options):
        self.stdout.write('seeding data...')
        num_users = int(options['num_users']) if options['num_users'] else 0
        run_seed(self, options['mode'], num_users)
        self.stdout.write('done.')


def clear_data():
    """Deletes all the table data"""
    print('Clearing data!!')


# NUM_USERS = 30
NUM_POSTS_MIN = 10
NUM_POSTS_MAX = 50
NUM_FRIENDS_MIN = 15
NUM_FRIENDS_MAX = 35

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

photo_images = [
    "media/photos/user_20/bangkok_jdqgjn",
    "media/photos/user_20/Pattaya-Thailand_lsooan",
    "media/photos/user_20/manh_hzbtsw",
    "media/photos/user_20/15bbf932f6da298470cb2_clbfee",
    "media/photos/user_20/7c3d10621c8ac3d49a9b9_pkggdv",
    "media/photos/user_20/elizabeth_olsen_ajw2vc",
    "media/photos/user_20/manh_hoxtzd",
    "media/photos/user_20/z4345772190626_07cfe87940832277b38697441f81711f_ugcfkv",
    "media/photos/user_20/Pattaya-Thailand_byfjus",
    "media/photos/user_20/phuket_gizp3m",
    "media/photos/user_20/America_nkju4z",
    "media/photos/user_20/Pattaya-Thailand_zxoahn",
    "media/photos/user_20/bangkok_jucdwv",
    "media/photos/user_20/stonehenge-dawn_mph4dn",
    "media/photos/user_20/Pattaya-Thailand_xdswu5",
    "media/photos/user_20/bangkok_lcypzb",
    "media/photos/user_20/Pattaya-Thailand_tslo8r",
    "media/photos/user_20/phuket_i1r8sr",
    "media/photos/user_20/england-london-big-ben-river-night_irvivs",
]
num_photo_images = len(photo_images)


def random_date(start, end):
    """
    This function will return a random datetime between two datetime
    objects.
    """
    delta = end - start
    int_delta = (delta.days * 24 * 60 * 60) + delta.seconds
    random_second = randrange(int_delta)
    return (start + timedelta(seconds=random_second)).replace(tzinfo=pytz.utc)


def generateTest():
    print("Generate Test User")
    user = AppUser.make_user(True)
    generate_posts(user)


def generateAll(num_users):
    global MAKE_TEST_USER
    start_time = time.time()
    print("Generate Users and Posts")
    # make users and posts
    NUM_USERS = num_users

    for i in range(NUM_USERS):
        new_user = AppUser.make_user()
        if not new_user:
            continue
        print(new_user.id)

        generate_posts(new_user)

    print("--- all users: %.2f seconds ---" % (time.time() - start_time))

    generate_friendings()
    generate_likes()

# each user has 15 - 35 friends


def generate_posts(new_user):
    d1 = datetime.strptime('6/1/2022 1:30 PM', '%m/%d/%Y %I:%M %p')
    d2 = datetime.strptime('5/25/2023 4:50 AM', '%m/%d/%Y %I:%M %p')

    num_posts = random.randint(NUM_POSTS_MIN, NUM_POSTS_MAX)

    new_posts = []
    for j in range(num_posts):
        new_post_object = Post.make_post_object(new_user)
        new_post_object.pub_datetime = random_date(d1, d2)
        new_posts.append(new_post_object)
    Post.objects.bulk_create(new_posts)

    new_photos = []
    for post in new_posts:
        num_photos = random.randint(0, 4)
        for j in range(num_photos):
            new_photo = Photo(author=post.author, post=post,
                              image=photo_images[random.randint(
                                  0, num_photo_images - 1)],
                              pub_datetime=post.pub_datetime)
            new_photos.append(new_photo)
    Photo.objects.bulk_create(new_photos)


def generate_friendings():
    start_time = time.time()
    print("Generate Friendings")
    all_users = AppUser.objects.all()
    users_count = all_users.count()
    friendings = []
    for i in range(users_count):
        user = all_users[i]
        n = random.randint(
            NUM_FRIENDS_MIN, NUM_FRIENDS_MAX)

        for j in range(n):
            second_user = all_users[random.randint(0, users_count - 1)]
            smallId, bigId = min(user.id, second_user.id), max(
                user.id, second_user.id)
            new_fr = Friending(first_id=smallId, second_id=bigId, sent=user.id,
                               state=Friending.FriendState.FRIENDED)
            friendings.append(new_fr)
    Friending.objects.bulk_create(
        friendings, batch_size=1000, ignore_conflicts=True)
    generate_friend_requests()
    print("--- all users: %.2f seconds ---" % (time.time() - start_time))


# num likes = num author's friends / 2
def generate_likes():
    start_time = time.time()
    print("Generate Likes")
    all_users = AppUser.objects.all()
    likes = []
    for user in all_users:
        post_ids = Post.get_friend_post_ids(user)
        random.shuffle(post_ids)
        liked_post_ids = post_ids[:len(post_ids) // 6]
        for post_id in liked_post_ids:
            new_like = Post.likes.through(post_id=post_id, appuser_id=user.id)
            likes.append(new_like)

    Post.likes.through.objects.bulk_create(
        likes, batch_size=7000, ignore_conflicts=True)
    print("--- all users: %.2f seconds ---" % (time.time() - start_time))


def update_profile_picture():
    all_users = AppUser.objects.all()
    for i in range(all_users.count()):
        user = all_users[i]
        user.profile_picture = images[random.randint(0, len(images) - 1)]
        user.save()


def generate_friend_requests():
    all_users = AppUser.objects.all().order_by('pk')
    users_count = len(all_users)
    d = {}
    requests = []
    for i in range(users_count):
        current_user = all_users[i]
        for j in range(4):
            other_user = all_users[random.randint(0, users_count - 1)]
            smallId, bigId = min(current_user.id, other_user.id), max(
                current_user.id, other_user.id)
            if (smallId == bigId or (smallId, bigId) in d):
                continue
            d[(smallId, bigId)] = 1
            r = Friending.make_friend_request(current_user, other_user)
            if r:
                requests.append(r)
    Friending.objects.bulk_create(
        requests,
        update_conflicts=True,
        unique_fields=['first', 'second'],
        update_fields=['state', 'sent'],)


def randomize_datetimes():

    d1 = datetime.strptime('1/1/2008 1:30 PM', '%m/%d/%Y %I:%M %p')
    d2 = datetime.strptime('5/25/2023 4:50 AM', '%m/%d/%Y %I:%M %p')

    start_time = time.time()

    posts = Post.objects.all()
    for post in posts:
        post.pub_datetime = random_date(d1, d2)
        # post.save()
    Post.objects.bulk_update(posts, ["pub_datetime"])

    print("--- %.2f seconds ---" % (time.time() - start_time))


def run_seed(self, mode, num_users):
    """ Seed database based on mode

    :param mode: generate
    :return:
    """

    match mode:
        case "generateTest":
            generateTest()
        case "generate":
            generateAll(num_users)
        case "friending":
            generate_friendings()
        case "like":
            generate_likes()
        case "rq":
            generate_friend_requests()


# python manage.py seed --mode=dt

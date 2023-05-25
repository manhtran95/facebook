import random


class MAIN_MODE_ENUM:
    Profile = 'profile'
    Search = 'search'
    Newsfeed = 'newsfeed'


def get_cloudinary_image(url, h, w):
    if url and 'upload/' in url:
        return url.replace('upload/', f'upload/c_fill,h_{h},w_{w}/')
    else:
        return url


def get_profile_picture(url, h, w):
    if url and 'upload/' in url:
        return url.replace('upload/', f'upload/c_fill,h_{h},w_{w}/')
    else:
        return 'https://res.cloudinary.com/dtgokkyl1/image/upload/v1683470568/media/basic_images/default-profile-picture_me5ztx.jpg'


def get_profile_picture_mini(url):
    return get_cloudinary_image(url, 40, 40)


def get_cover_photo(url):
    if url and 'upload/' in url:
        return url.replace('upload/', f'upload/c_fill,h_463,w_1241/')
    else:
        return 'https://res.cloudinary.com/dtgokkyl1/image/upload/v1683470571/media/basic_images/default-cover-photo_furh0o.jpg'


def generate_sentence():
    wordCount = random.randint(20, 60)
    word_file = "/usr/share/dict/words"
    WORDS = open(word_file).read().splitlines()
    l = len(WORDS)
    s = ''
    for i in range(wordCount):
        i = random.randint(0, l)
        s += WORDS[i] + ' '
    s += '.'
    return s


def compress_image(oimage):
    from pprint import pprint
    from django.core.files.base import ContentFile
    from PIL import Image
    from io import BytesIO
    pprint(vars(oimage))
    original_file_size = oimage.size
    filename = oimage._name
    name, ext = filename.split(".")
    # Open image with PIL
    img = Image.open(oimage)
    print('mode', img.mode)
    reduced_ratio = max(original_file_size / (100 * 1024), 1)
    if img.mode == 'RGB' and reduced_ratio > 1:
        # save image with reduced quality
        path = f"temp_images/image.jpg"
        img.save(path, optimize=True,
                 quality=int(100/reduced_ratio))
        # read image into img_io
        img_io = BytesIO()
        img_io.write(open(path, 'rb').read())
        return ContentFile(img_io.getvalue(), filename)
    else:
        oimage.seek(0)
        return oimage

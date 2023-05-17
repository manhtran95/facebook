import random


class MAIN_MODE_ENUM:
    Profile = 'profile'
    Search = 'search'


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

import random


def generateSentence():
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

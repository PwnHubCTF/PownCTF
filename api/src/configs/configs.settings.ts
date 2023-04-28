export enum CTF_STATES {
    WAITING = 'waiting',
    STARTED = 'started',
    FINISHED = 'finished',
}
const timezones =
    [
        'Europe/Paris',
        'America/New_York',
    ];
export const configs = [

    {
        "key": "challenge.max_points",
        "value": "2600",
        "valueType": "number",
        "description": "Max value for a challenge"
    },
    {
        "key": "challenge.min_points",
        "value": "1600",
        "valueType": "number",
        "description": "Min value for a challenge"
    },
    {
        "key": "challenge.decay",
        "value": "100",
        "valueType": "number",
        "description": "Number of solves before challenge reach it's minimal value"
    },
    {
        "key": "challenge.decay_speed",
        "value": "0.6",
        "valueType": "number",
        "description": "Rapidity for a chall to value his minimum. ex: 0.3 is really fast, 1 is slow, 1.8 is really slow"
    },
    {
        "key": "ctf.event_name",
        "value": "Pwnhub CTF",
        "valueType": "text",
        "description": "Name of the CTF"
    },
    {
        "key": "ctf.players_max_per_team",
        "value": "4",
        "valueType": "number",
        "description": "Max players per team"
    },
    {
        "key": "ctf.timezone",
        "value": "Europe/Paris",
        "valueType": "text",
        "valueChoices": JSON.stringify(timezones),
        "description": "Timezone of the ctf location"
    },
    {
        "key": "ctf.start_at",
        "value": "2042-10-14T12:51",
        "valueType": "datetime-local",
        "description": "Date when CTF start"
    },
    {
        "key": "ctf.end_at",
        "value": "3022-10-14T12:51",
        "valueType": "datetime-local",
        "description": "Date when CTF stop"
    },
    {
        "key": "ctf.team_mode",
        "value": "false",
        "valueType": "boolean",
        "valueChoices": JSON.stringify(['true', 'false']),
        "description": "CTF in team or individual. can be true or false"
    },
    {
        "key": "discord.invite_url",
        "value": "",
        "valueType": "text",
        "description": "Invitation URL of the CTF discord server (ex: https://discord.gg/aBcDeFgHi)"
    },
    {
        "key": "discord.webhook_first_blood",
        "value": "",
        "valueType": "text",
        "description": "Webhook to a discord canal, to send the first bloods (ex: https://discord.com/api/webhooks/xxxx)"
    },
    {
        "key": "github.repo_url",
        "value": "",
        "valueType": "text",
        "description": "URL to Github Repository (without https & .git) (ex: github.com/user/ctf_v3)"
    },
    {
        "key": "github.access_token",
        "value": "",
        "valueType": "text",
        "description": "Token to access repository (if private)"
    },
    {
        "key": "deployer.url",
        "value": "",
        "valueType": "text",
        "description": "URL of the deployer"
    },
    {
        "key": "deployer.token",
        "value": "",
        "valueType": "text",
        "description": "Token to access instance deployer"
    },
    {
        "key": "deployer.max_instances",
        "value": "1",
        "valueType": "number",
        "description": "Number of max deployed instances per team"
    },
    {
        "key": "xss_bot.url",
        "value": "",
        "valueType": "text",
        "description": "URL of the XSS Bot"
    },
    {
        "key": "xss_bot.token",
        "value": "",
        "valueType": "text",
        "description": "Token to access XSS Bot"
    }
]
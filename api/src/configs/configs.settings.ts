export enum CTF_STATES {
    WAITING = 'waiting',
    STARTED = 'started',
    FINISHED = 'finished',
}

export const configs = [
    {
        "key": "ctf.players_max_per_team",
        "value": "4",
        "valueType": "number",
        "description": "Max players per team"
    },
    {
        "key": "ctf.state",
        "value": CTF_STATES.WAITING,
        "valueType": "text",
        "valueChoices": JSON.stringify([CTF_STATES.WAITING, CTF_STATES.STARTED, CTF_STATES.FINISHED]),
        "description": "Current CTF state. Can be waiting, started or finished"
    },
    {
        "key": "ctf.team_mode",
        "value": "false",
        "valueType": "boolean",
        "valueChoices": JSON.stringify([true, false]),
        "description": "CTF in team or individual. can be true or false"
    },
    {
        "key": "config.ctf_time_client",
        "value": "",
        "valueType": "text",
        "description": "CTF Time integration"
    },
    {
        "key": "config.ctf_time_secret",
        "value": "",
        "valueType": "text",
        "description": "CTF Time integration"
    },
    {
        "key": "config.ctf_time_secret",
        "value": "",
        "valueType": "text",
        "description": "CTF Time integration"
    },
    {
        "key": "webhook.discord_first_blood",
        "value": "",
        "valueType": "text",
        "description": "Webhook to a discord canal, to send the first bloods"
    }
]
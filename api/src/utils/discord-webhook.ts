import axios from 'axios'

export interface FirstBloodData {
    user: string,
    challenge: string
}

export async function sendDiscordFirstblood (hook: string, firstBloodData: FirstBloodData) {
    const data = {
        "embeds": [
            {
                "title": `${firstBloodData.challenge} :first_place:`,
                "description": `Félicitations à **${firstBloodData.user}**, qui flag en premier ${firstBloodData.challenge} !`,
                "color": 16755763
            }
        ]
    }

    await axios.post(hook, data)
    return true
}
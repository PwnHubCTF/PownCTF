import { Logger } from '@nestjs/common';
import { mkdir } from 'fs/promises';
import { simpleGit, SimpleGit } from 'simple-git';
import { parse } from 'yaml'
const glob = require('glob')
const fs = require('fs')

require('dotenv').config()

const logger = new Logger("GithubImport");

export default async function (githubUrl: string, githubToken: string) {

    logger.debug('Cloning directory')
    // Download the project from github
    const projectPath = await getFromGithub(githubUrl, githubToken)

    logger.debug('Find challenges')
    // Parse project to find all config.yaml
    const challenges = (await searchFilesInDir(projectPath, 'config.yaml')).map(p => p.replace('/config.yaml', ''))

    let challengeDatas = []


    // Parse config.yaml for each challenges
    for (const challenge of challenges) {
        const pathOnGithub = challenge.split('/').splice(challenge.split('/').findIndex(p => p == 'challenges_repository') + 1).join('/')

        let challengeData: any = { data: { source: 'github', githubUrl: `https://${githubUrl}/tree/main/${pathOnGithub}` }, files: [] }

        const config = `${challenge}/config.yaml`
        const configFile = parse(fs.readFileSync(config, 'utf8'))

        if (configFile.id) challengeData.data.id = configFile.id

        const requiredProperties = ['name', 'category', 'flag', 'author', 'difficulty']
        for (const property of requiredProperties) {
            if (!configFile[property]) throw new Error(`Property '${property}' missing in config.yaml for challenge ${challenge}`)
            challengeData.data[property] = configFile[property]
        }

        if (configFile.files && configFile.files.length > 0)
            for (const file of configFile.files) {
                let filePath = `${challenge}/${file}`
                if (!fs.existsSync(filePath)) throw new Error(`File ${filePath} doesn't exists for challenge ${challenge}`)
                challengeData.files.push(filePath)
            }

        if (!fs.existsSync(`${challenge}/description.md`)) throw new Error(`File 'description.md' doesn't exists for challenge ${challenge}`)
        challengeData.data.description = fs.readFileSync(`${challenge}/description.md`, 'utf8')

        if (configFile.instance && (configFile.instance == 'single' || configFile.instance == 'multiple')) {
            if (!fs.existsSync(`${challenge}/docker-compose.yml`)) throw new Error(`Challenge ${challenge} is an instance, but docker-compose.yml file is not found`)
            challengeData.data.instance = configFile.instance
        }

        challengeDatas.push(challengeData)
    }
    logger.debug('Import challenges')
    return challengeDatas
}

async function getFromGithub (githubUrl: string, token: string) {
    // Get git infos from Github Url

    let path = `${__dirname}/../../challenges_repository/`
    path = path.replace(new RegExp('[\\\\]', 'gm'), '/')
    // Create directory for the project
    let res = await mkdir(path, { recursive: true })

    // Setup github module from infos
    const git: SimpleGit = simpleGit(path);


    // If res, a dir has been created -> project doesn't exists and need to be setup
    if (res) {
        // Set remote
        await git.init()
        await git.addRemote('origin', `https://${token ? `${token}@` : ''}${githubUrl}.git`)
    } else {
        // Else, just fetch the repo to update it
        await git.fetch()
    }

    // Pull branch main. TODO: allow admin to chose the branch ?
    await git.pull('origin', 'main')

    return path
}

function searchFilesInDir (startPath, search): Promise<string[]> {
    return new Promise((resolve, reject) => {
        glob(`${startPath}/**/${search}`, {}, (err, files: string[]) => {
            if (err) reject(err)
            else resolve(files)
        })
    })
};
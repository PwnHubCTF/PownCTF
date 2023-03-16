import { Logger } from '@nestjs/common';
import { mkdir } from 'fs/promises';
import { simpleGit, SimpleGit } from 'simple-git';
import { parse } from 'yaml';
const glob = require('glob')
const fs = require('fs')

require('dotenv').config()

const logger = new Logger("GithubImport");

export default async function (githubUrl: string, githubToken: string) {

    logger.verbose('Cloning directory')
    // Download the project from github
    const projectPath = await getFromGithub(githubUrl, githubToken)

    logger.verbose('Find challenges')
    // Parse project to find all config.yaml
    const challenges = (await searchFilesInDir(projectPath, 'config.yaml')).map(p => p.replace('/config.yaml', ''))

    let challengeDatas = []


    // Parse config.yaml for each challenges
    for (const challenge of challenges) {
        const pathOnGithub = challenge.split('/').splice(challenge.split('/').findIndex(p => p == 'challenges_repository') + 1).join('/')

        let challengeData: any = { data: { source: 'github', githubUrl: `https://${githubUrl}/tree/main/${pathOnGithub}` }, files: [], depends_on: [] }

        const config = `${challenge}/config.yaml`
        const configFile = parse(fs.readFileSync(config, 'utf8'))

        if (configFile.id) challengeData.data.id = configFile.id
        if (configFile.web) challengeData.data.web = true
        if (configFile.tags) challengeData.data.tags = JSON.stringify(configFile.tags)


        if (configFile.xss) {
            if(!configFile.web) {
                challengeDatas.push({ status: 'error', reason: (`Property xss is actived but this is not a web challenge: ${challenge.split('/')[challenge.split('/').length - 1]}`), depends_on: [] });
                continue
            }
            challengeData.data.xss = true
        }


        const requiredProperties = ['name', 'category', 'author', 'difficulty']
        for (const property of requiredProperties) {
            if (configFile[property] == undefined) { challengeDatas.push({ status: 'error', reason: (`Property '${property}' missing in config.yaml for challenge ${challenge.split('/')[challenge.split('/').length - 1]}`), depends_on: [] }); continue }
            challengeData.data[property] = configFile[property]
        }

        if (configFile.flag)
            challengeData.data.flag = configFile.flag

        if (configFile.depends_on && configFile.depends_on.length > 0)
            challengeData.depends_on = configFile.depends_on

        if (configFile.multiplicator != undefined)
            if (configFile.multiplicator >= 0 && configFile.multiplicator <= 1) {
                challengeData.data.pointMultiplicator = parseFloat(configFile.multiplicator)
            } else {
                challengeDatas.push({ status: 'error', reason: (`Property multiplicator is not valid (must be between 0 and 1) for challenge ${challenge.split('/')[challenge.split('/').length - 1]}`), depends_on: [] });
                continue
            }

        if (configFile.sign_flag == true) {
            if (configFile.instance !== 'multiple') {
                challengeDatas.push({ status: 'error', reason: (`Challenge ${challenge.split('/')[challenge.split('/').length - 1]} want to use signed flag, but it's not a multiple instance`), depends_on: [] });
                continue
            }
            challengeData.data.signedFlag = true
        }

        if (configFile.files && configFile.files.length > 0)
            for (const file of configFile.files) {
                let filePath = `${challenge}/${file}`
                if (!fs.existsSync(filePath)) { challengeDatas.push({ status: 'error', reason: (`File ${filePath} doesn't exists for challenge ${challenge.split('/')[challenge.split('/').length - 1]}`), depends_on: [] }); continue }
                challengeData.files.push(filePath)
            }

        if (!fs.existsSync(`${challenge}/description.md`)) { challengeDatas.push({ status: 'error', reason: (`File 'description.md' doesn't exists for challenge ${challenge.split('/')[challenge.split('/').length - 1]}`), depends_on: [] }); continue }
        challengeData.data.description = fs.readFileSync(`${challenge}/description.md`, 'utf8')

        if (configFile.instance && (configFile.instance == 'single' || configFile.instance == 'multiple')) {
            if (!fs.existsSync(`${challenge}/docker-compose.yml`)) { challengeDatas.push({ status: 'error', reason: (`Challenge ${challenge.split('/')[challenge.split('/').length - 1]} is an instance, but docker-compose.yml file is not found`), depends_on: [] }); continue }
            challengeData.data.instance = configFile.instance
        }

        challengeDatas.push(challengeData)
    }
    logger.verbose('Import challenges')
    return challengeDatas
}

async function getFromGithub(githubUrl: string, token: string) {
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
        await git.removeRemote('origin')
        await git.addRemote('origin', `https://${token ? `${token}@` : ''}${githubUrl}.git`)
        // Else, just fetch the repo to update it
        await git.fetch()
    }

    // Pull branch main. TODO: allow admin to chose the branch ?
    await git.pull('origin', 'main', { '--allow-unrelated-histories': null })

    return path
}

function searchFilesInDir(startPath, search): Promise<string[]> {
    return new Promise((resolve, reject) => {
        glob(`${startPath}/**/${search}`, {}, (err, files: string[]) => {
            if (err) reject(err)
            else resolve(files)
        })
    })
};
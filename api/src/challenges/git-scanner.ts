import { Logger } from '@nestjs/common';
import { mkdir } from 'fs/promises';
import { simpleGit, SimpleGit } from 'simple-git';
import { parse } from 'yaml'
import fs from 'fs'
const glob = require('glob')

require('dotenv').config()

const logger = new Logger("GithubImport");

export default async function (githubUrl: string, githubToken: string) {

    logger.debug('Cloning directory')
    // Download the project from github
    const projectPath = await getFromGithub(githubUrl, githubToken)
    logger.debug('Find challenges')
    // Parse project to find all config.yaml
    const configs = await fromDir(projectPath, 'config.yaml')
    console.log(configs);

}

async function getFromGithub (githubUrl: string, token: string) {
    // Get git infos from Github Url

    let path = `${__dirname}/../../challenges_repository/`
    path = path.replace(new RegExp('[\\\\]', 'gm'), '/')
    //   // Create directory for the project
    let res = await mkdir(path, { recursive: true })

    //   // Setup github module from infos
    const git: SimpleGit = simpleGit(path);


    //   // If res, a dir has been created -> project doesn't exists and need to be setup
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

function fromDir (startPath, search) {
    return new Promise((resolve, reject) => {
        glob(`${startPath}/**/${search}`, {}, (err, files) => {
            if (err) reject(err)
            else resolve(files)
        })
    })
};
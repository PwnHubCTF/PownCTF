import { Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { mkdir } from 'fs/promises';
import { fromUrl } from "hosted-git-info"
import { simpleGit, SimpleGit } from 'simple-git';
import { parse } from 'yaml'
var fs = require('fs');

require('dotenv').config()

const logger = new Logger("GithubImport");

export default async function (githubUrl: string, githubToken: string) {


    // Download the project from github
    const projectPath = await getFromGithub(githubUrl, githubToken)
    return 'salut'
    // Parse config file
    //   const requiredFiles = ["config.yaml", "description.md"]
    //   if (!fs.existsSync(`${projectPath}/config.yaml`)) throw new Error("config.yaml not found in project")
    //   if (!fs.existsSync(`${projectPath}/description.md`)) throw new Error("description.md not found in project")
    //   if (!fs.existsSync(`${projectPath}/docker-compose.yml`)) throw new Error("docker-compose.yml not found in project")

    //   const configFile = parse(fs.readFileSync(`${projectPath}/config.yaml`, 'utf8'))

    //   let id = configFile.id
    //   if(job.data.challengeId) id = job.data.challengeId

    //   job.progress('building')
    //   const projectName = `${id}_${job.data.owner}`.toLowerCase()

    //   try {
    //       job.progress('building.upAll')
    //       await compose.upAll({ cwd: projectPath, composeOptions: [["--project-name", projectName]] })
    //       job.progress('building.getContainers')
    //       const res = await compose.ps({ cwd: projectPath, composeOptions: [["--project-name", projectName]] })
    //       const openedPort = res.out.substring(res.out.indexOf('0.0.0.0:') + '0.0.0.0:'.length, res.out.indexOf('->'))


    //   cb(null, {
    //     port: openedPort,
    //     challengeId: id,
    //     composeProjectName: projectName
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
}

interface GithubInfos {
    domain: string,
    treepath: string,
    editpath: string,
    type: string,
    user: string,
    project: string,
    committish: string,
    default: string,
    projectPath: string,
    url: string,
}
/*
  * Infos example:
  {
    domain: 'github.com',
    treepath: 'tree',
    editpath: 'edit',
    type: 'github',
    user: 'PwnHubCTF',
    project: 'challenges',
    committish: 'main',
    default: 'https',
    projectPath: 'prog/nop',
    url: 'https://github.com/PwnHubCTF/challenges'
  }
  */

async function getFromGithub (githubUrl: string, token: string) {
    // Get git infos from Github Url
    let infos = fromUrl(githubUrl)
    console.log(infos);

    let path = `${__dirname}/../../challenges_repository`

    //   // Create directory for the project
    let res = await mkdir(path, { recursive: true })

    //   // Setup github module from infos
    const git: SimpleGit = simpleGit(path);


    //   // If res, a dir has been created -> project doesn't exists and need to be setup
    if (res) {
        // Set remote
        await git.init()
        let url = `https://${githubUrl}.git`
        if (process.env.GITHUB_TOKEN) url = `https://${process.env.GITHUB_TOKEN}@${githubUrl}.git`
        
        await git.addRemote('origin', url)
    } else {
        // Else, just fetch the repo to update it
        await git.fetch()
    }

    // Pull branch main. TODO: allow admin to chose the branch ?
    await git.pull('origin', 'main')

    return path
}

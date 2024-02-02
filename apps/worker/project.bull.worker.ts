import { Job, Worker } from 'bullmq';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

type ProjectData = {
  id: number;
  uuid: string;
  name: string;
  description: string;
  status: string;
  projectType: string;
  extras: string;
  instance_id: null | string;
  contract_address: null | string;
  createdAt: string;
  updatedAt: string;
  path: string;
};

const projectCreateJobName = 'project_create';

const templatePath = (projectType: string) =>
  path.join(process.cwd(), `/apps/rahat/src/projects/templates/${projectType}`);

const originalTemplateEnv = fs.readFileSync(
  path.join(process.cwd(), '.env'),
  'utf-8'
);

const updateDockerComposeFile = (
  filePath: string,
  projectType: string,
  projectName: string,
  uuid: string
) => {
  let fileContent = fs.readFileSync(filePath, 'utf8');

  fileContent = fileContent.replace('projectType', projectType);
  fileContent = fileContent.replace(
    'projectName',
    projectName.replace(/ /g, '_')
  );
  fileContent = fileContent.replace('uuid', uuid);
  fs.writeFileSync(filePath, fileContent);
};

const replaceEnvWithConfig = (original, destination) => {
  const originalEnv = original.split('\n');
  const destinationEnv = destination.split('\n');
  const newEnv = originalEnv.map((env) => {
    const [envKey] = env.split('=');
    const destinationEnvKey = destinationEnv.find((c) => c.startsWith(envKey));
    return destinationEnvKey || env;
  });
  return newEnv.join('\n');
};

const createProjectDirectory = (
  dirPath,
  projectType,
  projectName,
  projectUUID
) => {
  const fullPath = path.join(dirPath, projectUUID);
  const templateFile = templatePath(projectType);
  fs.mkdirSync(fullPath, { recursive: true });
  fs.copyFileSync(
    path.join(templateFile, '.env.template'),
    path.join(fullPath, '.env')
  );
  fs.copyFileSync(
    path.join(templateFile, 'docker-compose.yml'),
    path.join(fullPath, 'docker-compose.yml')
  );
  const newEnv = replaceEnvWithConfig(
    fs.readFileSync(path.join(fullPath, '.env'), 'utf-8'),
    originalTemplateEnv
  );

  updateDockerComposeFile(
    path.join(fullPath, 'docker-compose.yml'),
    projectType,
    projectName,
    projectUUID
  );

  fs.writeFileSync(path.join(fullPath, '.env'), newEnv);
  return fullPath;
};

const readAndExecuteEnvTemplateFile = (
  dirPath,
  projectType,
  projectName,
  projectUUID
) => {
  const newProjectPath = createProjectDirectory(
    dirPath,
    projectType,
    projectName,
    projectUUID
  );
  runDockerCompose(newProjectPath);
};

const runDockerCompose = (dirPath) => {
  exec(
    `cd ${dirPath} && docker-compose --env-file .env up -d`,
    (err, stdOut, stdErr) => {
      if (err) {
        console.error(`exec error: ${err}`);
        return;
      }
      console.log('Docker compose started');
      console.log(`stdout: ${stdOut}`);
      console.log(`stderr: ${stdErr}`);

      return { stdOut, stdErr };
    }
  );
};

const jobProcessor = async (job: Job<ProjectData, ProjectData, string>) => {
  if (job.name !== projectCreateJobName) return;

  console.log('Project Creation Job Started...=====>');

  readAndExecuteEnvTemplateFile(
    job.data.path,
    job.data.projectType,
    job.data.name,
    job.data.uuid
  );
  return job.data;
};

const bullWorker = (queueName, processor, config) => {
  const worker = new Worker(queueName, processor, config);
  worker.on('completed', (job: Job<ProjectData, ProjectData, string>) => {
    console.log(
      `Project Created, Name: `,
      job.data.name,
      'UUID:' + job.data.uuid
    );
    // console.log('Project Creation Job Ended...=====>');
  });
  return { worker };
};

bullWorker('HOST', jobProcessor, {
  connection: {
    host: 'localhost',
    port: 6379,
    password: 'raghav123',
  },
});

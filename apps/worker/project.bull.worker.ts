import { Worker } from 'bullmq';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const templatePath = (projectType: string) =>
  path.join(process.cwd(), `/apps/rahat/src/projects/templates/${projectType}`);

const originalTemplateEnv = fs.readFileSync(
  path.join(process.cwd(), '.env'),
  'utf-8'
);

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

const createProjectDirectory = (dirPath, projectType, projectUUID) => {
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
  fs.writeFileSync(path.join(fullPath, '.env'), newEnv);
  return fullPath;
};

const readAndExecuteEnvTemplateFile = (dirPath, projectType, projectUUID) => {
  const newProjectPath = createProjectDirectory(
    dirPath,
    projectType,
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

const jobProcessor = async (job) => {
  readAndExecuteEnvTemplateFile(
    job.data.path,
    job.data.projectType,
    job.data.uuid
  );
  return job.data;
};

const bullWorker = (queueName, processor, config) => {
  const worker = new Worker(queueName, processor, config);
  worker.on('completed', (job) => {
    console.log(`Job completed with result`, job.returnvalue);
  });
  return { worker };
};

bullWorker('APP_QUEUE', jobProcessor, {
  connection: {
    host: 'localhost',
    port: 6379,
    password: 'raghav123',
  },
});

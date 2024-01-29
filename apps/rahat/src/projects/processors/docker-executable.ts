import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const dirPath = path.join(__dirname);

const envFile = (data: any) => {
  const envFileContent = Object.entries(data)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  // Convert the object to a string before writing it to the file

  fs.mkdirSync(dirPath, { recursive: true });

  const filePath = path.join(dirPath, '.env.docker.project');

  fs.writeFileSync(filePath, envFileContent);
  return true;
};
const executeCompose = () => {
  const envFilePath = path.join(dirPath, '.env.docker.project');
  exec(
    `docker-compose --env-file ${envFilePath} up -d`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Docker Compose: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Docker Compose stderr: ${stderr}`);
        return;
      }
      console.log(`Docker Compose stdout: ${stdout}`);
    }
  );
};

export const createContainer = async (data: any) => {
  const createdEnv = envFile(data);
  console.log('createdEnv', createdEnv);
  const createdContainer = await executeCompose();
  console.log('createdContainer', createdContainer);
};

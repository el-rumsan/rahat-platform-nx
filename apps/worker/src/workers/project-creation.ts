// workers/projectCreator.ts

import { Worker } from '.';

const projectCreator: Worker = {
  async process(data: any) {
    // Here you would put the logic for creating a project
    // This is a placeholder and should be replaced with your actual implementation
    console.log(`Creating project with data: ${JSON.stringify(data)}`);
  },
};

export default projectCreator;

import projectCreator from './project-creation';

export interface Worker {
  process(data: any): Promise<void>;
}

export const workers: { [key: string]: Worker } = {
  'project-create': projectCreator,
  // Add more workers as needed
};

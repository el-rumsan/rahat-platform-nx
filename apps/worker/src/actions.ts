export function processAction(action: string, data: any) {
  switch (action) {
    case 'ACTION_1':
      // Perform action 1
      console.log(`Performing action 1 with data: ${JSON.stringify(data)}`);
      break;
    case 'ACTION_2':
      // Perform action 2
      console.log(`Performing action 2 with data: ${JSON.stringify(data)}`);
      break;
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

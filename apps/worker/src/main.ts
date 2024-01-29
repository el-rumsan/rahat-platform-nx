import amqp, { Channel, Connection, ConsumeMessage } from 'amqplib';
import { Worker, workers } from './workers'; // Import your workers

interface Job {
  name: string;
  data: any;
}

async function start() {
  try {
    const connection: Connection = await amqp.connect('amqp://localhost');
    const channel: Channel = await connection.createChannel();
    const queue: string = 'jobs_queue';

    await channel.assertQueue(queue, { durable: true });
    console.log('Waiting for messages...');

    channel.consume(queue, async (msg: ConsumeMessage | null) => {
      if (msg) {
        const job: Job = JSON.parse(msg.content.toString());
        const worker: Worker | undefined = workers[job.name];

        if (worker) {
          try {
            await worker.process(job.data);
            console.log(`Job "${job.name}" processed successfully`);
            channel.ack(msg);
          } catch (error) {
            console.error(`Error processing job "${job.name}":`, error);
            channel.nack(msg);
          }
        } else {
          console.log(`Ignoring: Unknown job "${job.name}"`);
          channel.ack(msg);
        }
      }
    });
  } catch (error) {
    console.error('Error starting worker:', error);
  }
}

start();

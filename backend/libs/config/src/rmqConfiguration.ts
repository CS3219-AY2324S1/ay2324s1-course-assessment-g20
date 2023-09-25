import { RmqOptions, Transport } from '@nestjs/microservices';
import { RmqQueue } from '@app/types/rmqQueues';

const getRmqOptionsForQueue = (rmqQueue: RmqQueue): RmqOptions => {
  const rmqUrl = process.env.RMQ_URL;
  return {
    transport: Transport.RMQ,
    options: {
      urls: [rmqUrl],
      queue: rmqQueue,
    },
  }
};

export const getRmqOptions = () => ({
  questionServiceOptions: getRmqOptionsForQueue(RmqQueue.QUESTION),
  authServiceOptions: getRmqOptionsForQueue(RmqQueue.AUTH),
  userServiceOptions: getRmqOptionsForQueue(RmqQueue.USER),
});

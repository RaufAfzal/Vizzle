// import express from "express";
// import { ExpressAdapter } from '@bull-board/express';
// import pkg from '@bull-board/api'; // Import the CommonJS package
// import { emailQueue } from "./queueService.js";

// const { setQueues, BullAdapter } = pkg;

// const app = express();
// const serverAdapter = new ExpressAdapter();

// try {
//     setQueues([
//         new BullAdapter(emailQueue) // Wrap your Bull queue with BullAdapter
//     ]);
// } catch (error) {
//     console.error('Error setting up BullAdapter:', error);
//     process.exit(1);
// }

// app.use('/admin/queues', serverAdapter.getRouter());

// const PORT = process.env.PORT || 3001;

// app.listen(PORT, () => {
//     console.log(`Queue monitoring running on http://localhost:${PORT}/admin/queues`);
// });

import agenda from './agenda.js';
import { Contest } from '../models/Contest.js';

agenda.define('start contest', async (job, done) => {
    const { contestId } = job.attrs.data;
    await Contest.findByIdAndUpdate(contestId, { status: 'ongoing' });
    done();
});

agenda.define('end contest', async (job, done) => {
    const { contestId } = job.attrs.data;
    await Contest.findByIdAndUpdate(contestId, { status: 'ended' });
    done();
});

agenda.on('complete:start contest', async (job) => {
    await job.remove();
});

agenda.on('complete:end contest', async (job) => {
    await job.remove();
});

export default agenda;
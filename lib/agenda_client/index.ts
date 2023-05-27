export interface statusRequest {
	overview: [
		{
			displayName: string;
			total: number;
			running: number;
			scheduled: number;
			queued: number;
			completed: number;
			failed: number;
			repeating: number;
		},
		{
			_id: string;
			displayName: string;
			total: number;
			running: number;
			scheduled: number;
			queued: number;
			completed: number;
			failed: number;
			repeating: number;
		}
	];
	jobs: JobStatus[];
	totalPages: number;
	title: string;
	currentRequest: {
		title: string;
		job: string;
	};
}

interface Job {
	_id: string;
	name: string;
	data: any;
	priority: number;
	shouldSaveResult: boolean;
	type: string;
	nextRunAt: Date;
	lastModifiedBy?: any;
};

interface JobStatus {
	job: Job;
	_id: string;
	running: boolean;
	scheduled: boolean;
	queued: boolean;
	completed: boolean;
	failed: boolean;
	repeating: boolean;
}

export async function fetchAgendaTasks() {
	const req = await fetch("/scheduler/api")
	return await req.json() as statusRequest
}

export async function createTask() {

}
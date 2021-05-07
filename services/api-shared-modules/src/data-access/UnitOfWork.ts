import {
	UserRepository,
	SubscriptionRepository,
	SnapsRepository,
} from './repositories';
import {
	IUserRepository,
	ISubscriptionRepository, ISnapsRepository,
} from './interfaces';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import { DynamoDB } from 'aws-sdk';

export class UnitOfWork {

	public Users: IUserRepository;
	public Subscriptions: ISubscriptionRepository;
	public Snaps: ISnapsRepository;

	public constructor() {
		const db: DataMapper = new DataMapper({ client: new DynamoDB({ region: 'eu-west-1' }) });

		this.Users = new UserRepository(db);
		this.Subscriptions = new SubscriptionRepository(db);
		this.Snaps = new SnapsRepository(db);
	}

}

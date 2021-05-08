import { QueryIterator, QueryOptions } from '@aws/dynamodb-data-mapper';
import { Repository } from './Repository';
import { QueryKey } from '../interfaces';
import { Snap } from '../../types';
import { SnapItem } from '../../models/core/Snap';
import { v4 as uuid } from 'uuid';

export class SnapsRepository extends Repository {

	public async get(snapId: string, creatorUsername: string): Promise<Snap> {
		try {
			return await this.db.get(Object.assign(new SnapItem(), {
				pk: `snap#${snapId}`,
				sk: `username#${creatorUsername}`
			}));
		} catch (err) {
			return undefined;
		}
	}

	public async getAll(): Promise<Snap[]> {
		const keyCondition: QueryKey = {
			entity: 'snap'
		};

		const queryOptions: QueryOptions = {
			indexName: 'entity-sk2-index',
			scanIndexForward: false
		};

		const queryIterator: QueryIterator<SnapItem> = this.db.query(SnapItem, keyCondition, queryOptions);
		const snaps: Snap[] = [];

		for await (const snap of queryIterator) snaps.push(snap);

		return snaps;
	}

	public async create(snap: Partial<Snap>): Promise<Snap> {
		const id: string = uuid();
		const date: string = new Date().toISOString();

		return this.db.put(Object.assign(new SnapItem(), {
			entity: 'snap',
			time: date,
			snapId: id,
			seenBy: [],
			pk: `snap#${id}`,
			sk: `username#${snap.username}`,
			sk2: `createdAt#${date}`,
			...snap
		}));
	}

	public async update(snap: Snap): Promise<Snap> {
		delete snap.sk2;
		return this.db.update(Object.assign(new SnapItem(), {
			pk: `snap#${snap.snapId}`,
			sk: `username#${snap.username}`,
			...snap
		}), {
			onMissing: 'skip'
		});
	}

}

import { Snap } from '../..';

export interface ISnapsRepository {
	get(snapId: string, creatorUsername: string): Promise<Snap>;
	getAll(): Promise<Snap[]>;
	create(snap: Partial<Snap>): Promise<Snap>;
	update(snap: Snap): Promise<Snap>;
}

import { Snap } from '../..';

export interface ISnapsRepository {
	getAll(): Promise<Snap[]>;
	create(snap: Partial<Snap>): Promise<Snap>;
}

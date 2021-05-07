import { Snap } from '../..';

export interface ISnapsRepository {
	getAll(): Promise<Snap[]>;
}

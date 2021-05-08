import { ApiHandler, UnitOfWork } from '../../api-shared-modules/src';
import { SnapsController } from './snaps.controller';

const unitOfWork: UnitOfWork = new UnitOfWork();
const controller: SnapsController = new SnapsController(unitOfWork);

export const getAllSnaps: ApiHandler = controller.getAllSnaps;
export const createSnap: ApiHandler = controller.createSnap;
export const viewSnap: ApiHandler = controller.viewSnap;

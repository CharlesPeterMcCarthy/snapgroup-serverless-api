import { ApiHandler, UnitOfWork } from '../../api-shared-modules/src';
import { SnapsController } from './snaps.controller';
import { SNSPublish } from './sns-publish';

const unitOfWork: UnitOfWork = new UnitOfWork();
const snsPublish: SNSPublish = new SNSPublish();
const controller: SnapsController = new SnapsController(unitOfWork, snsPublish);

export const getAllSnaps: ApiHandler = controller.getAllSnaps;
export const createSnap: ApiHandler = controller.createSnap;
export const viewSnap: ApiHandler = controller.viewSnap;

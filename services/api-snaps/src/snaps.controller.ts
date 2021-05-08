import {
	ResponseBuilder,
	ErrorCode,
	ApiResponse,
	ApiHandler,
	ApiEvent,
	ApiContext,
	UnitOfWork,
	Snap
} from '../../api-shared-modules/src';

export class SnapsController {

	public constructor(private unitOfWork: UnitOfWork) { }

	public getAllSnaps: ApiHandler = async (event: ApiEvent, context: ApiContext): Promise<ApiResponse> => {
		try {
			console.log('test ****');
			const snaps: Snap[] = await this.unitOfWork.Snaps.getAll();
			if (!snaps) return ResponseBuilder.notFound(ErrorCode.GeneralError, 'Failed to retrieve Snaps');

			return ResponseBuilder.ok({ snaps });
		} catch (err) {
			console.log(err);
			return ResponseBuilder.internalServerError(err, err.message);
		}
	}

	public createSnap: ApiHandler = async (event: ApiEvent, context: ApiContext): Promise<ApiResponse> => {
		try {
			const snap: Partial<Snap> = JSON.parse(event.body);

			if (!snap) return ResponseBuilder.badRequest(ErrorCode.BadRequest, 'Invalid request parameters');

			console.log(snap);

			const res: Snap = await this.unitOfWork.Snaps.create(snap);
			if (!res) return ResponseBuilder.notFound(ErrorCode.GeneralError, 'Failed to save Snap');

			return ResponseBuilder.ok({ snap: res });
		} catch (err) {
			console.log(err);
			return ResponseBuilder.internalServerError(err, err.message);
		}
	}

	public viewSnap: ApiHandler = async (event: ApiEvent, context: ApiContext): Promise<ApiResponse> => {
		try {
			const details: { username: string; creatorUsername: string; snapId: string } = JSON.parse(event.body);

			if (!details || !details.username || !details.creatorUsername || !details.snapId)
				return ResponseBuilder.badRequest(ErrorCode.BadRequest, 'Invalid request parameters');

			console.log(details);

			const snap: Snap = await this.unitOfWork.Snaps.get(details.snapId, details.creatorUsername);
			if (!snap) return ResponseBuilder.notFound(ErrorCode.GeneralError, 'Failed to find Snap');

			snap.seenBy.push(details.username);

			const res: Snap = await this.unitOfWork.Snaps.update(snap);

			return ResponseBuilder.ok({ });
		} catch (err) {
			console.log(err);
			return ResponseBuilder.internalServerError(err, err.message);
		}
	}

}

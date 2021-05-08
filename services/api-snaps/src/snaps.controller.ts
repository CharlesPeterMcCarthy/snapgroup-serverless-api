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
import { SNSPublish } from './sns-publish';

export class SnapsController {

	public constructor(
		private unitOfWork: UnitOfWork,
		private snsPublish: SNSPublish
	) { }

	public getAllSnaps: ApiHandler = async (event: ApiEvent, context: ApiContext): Promise<ApiResponse> => {
		if (!event.pathParameters || !event.pathParameters.username)
			return ResponseBuilder.badRequest(ErrorCode.BadRequest, 'Invalid request parameters');

		try {
			const snaps: Snap[] = await this.unitOfWork.Snaps.getAll();
			if (!snaps) return ResponseBuilder.notFound(ErrorCode.GeneralError, 'Failed to retrieve Snaps');

			console.log(event.pathParameters.username);

			const filteredSnaps: Snap[] = snaps
				// .filter((s: Snap) => s.username !== event.pathParameters.username)
				.map((s: Snap) => { // Remove URL from snaps that have been viewed
					if (s.seenBy.indexOf(event.pathParameters.username) > -1) delete s.imageUrl;
					return s;
				});

			return ResponseBuilder.ok({ snaps: filteredSnaps });
		} catch (err) {
			console.log(err);
			return ResponseBuilder.internalServerError(err, err.message);
		}
	}

	public createSnap: ApiHandler = async (event: any, context: ApiContext): Promise<ApiResponse> => {
		try {
			const snap: Partial<Snap> = event;

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

	public viewSnap: ApiHandler = async (event: any, context: ApiContext): Promise<ApiResponse> => {
		try {
			const details: { username: string; creatorUsername: string; snapId: string } = event;

			if (!details || !details.username || !details.creatorUsername || !details.snapId)
				return ResponseBuilder.badRequest(ErrorCode.BadRequest, 'Invalid request parameters');

			const snap: Snap = await this.unitOfWork.Snaps.get(details.snapId, details.creatorUsername);
			if (!snap) return ResponseBuilder.notFound(ErrorCode.GeneralError, 'Failed to find Snap');

			if (snap.seenBy.indexOf(details.username) === -1) snap.seenBy.push(details.username);

			const res: Snap = await this.unitOfWork.Snaps.update(snap);

			return ResponseBuilder.ok({ snap: res });
		} catch (err) {
			console.log(err);
			return ResponseBuilder.internalServerError(err, err.message);
		}
	}

	public publishSnap: ApiHandler = async (event: ApiEvent, context: ApiContext): Promise<ApiResponse> => {
		const body: any = JSON.parse(event.body);
		const snap: Snap = body.snap;

		try {
			await this.snsPublish.publishSnap(snap);

			return ResponseBuilder.ok({ snap });
		} catch (err) {
			console.log(err);
			return ResponseBuilder.internalServerError(err, err.message);
		}
	}

}

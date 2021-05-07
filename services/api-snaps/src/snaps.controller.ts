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
			const snaps: Snap[] = await this.unitOfWork.Snaps.getAll();
			if (!snaps) return ResponseBuilder.notFound(ErrorCode.GeneralError, 'Failed to retrieve Snaps');

			return ResponseBuilder.ok({ snaps });
		} catch (err) {
			return ResponseBuilder.internalServerError(err, err.message);
		}
	}

}

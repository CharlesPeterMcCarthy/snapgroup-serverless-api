import * as AWS from 'aws-sdk';
import { Snap } from '../../api-shared-modules/src/types';

const sns: AWS.SNS = new AWS.SNS({ apiVersion: '2010-03-31' });

export class SNSPublish {

	public publishSnap = async (snap: Snap): Promise<void> => {
		if (!snap) return;

		const params: AWS.SNS.PublishInput = {
			Message: JSON.stringify(snap),
			TopicArn: `arn:aws:sns:eu-west-1:068475715603:snapgroup-snaps`
		};

		await sns.publish(params, async (err: any, data: any) => {
			if (err) {
				console.log(err.stack);
				return;
			}
			console.log('Message sent');
			console.log(data);
		}).promise();
	}

}

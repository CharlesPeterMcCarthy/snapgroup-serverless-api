import { DynamoDbItem } from '../DynamoDBItem';
import { attribute } from '@aws/dynamodb-data-mapper-annotations';
import { Snap } from '../../types';

export class SnapItem extends DynamoDbItem implements Snap {

	@attribute()
	public snapId!: string;

	@attribute()
	public imageUrl!: string;

	@attribute()
	public username!: string;

	@attribute()
	public time!: string;

	@attribute()
	public seenBy!: string[];

}

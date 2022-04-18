export function hasSize(obj: any): asserts obj is RPSSize {
	if (!obj.size) {
		throw new Error('Missing size property');
	}
}

export type RPSSize = { size: number };

export function hasState(obj: any): asserts obj is RPSPosition {
	if (
		!obj.p1xcurrent ||
		!obj.p2xcurrent ||
		!obj.p1ycurrent ||
		!obj.p2ycurrent ||
		!obj.p1zcurrent ||
		!obj.p2zcurrent
	) {
		throw new Error('Missing position property');
	}
}

type RPSPosition = {
	p1xcurrent: number;
	p1ycurrent: number;
	p1zcurrent: number;
	p2xcurrent: number;
	p2ycurrent: number;
	p2zcurrent: number;
};

/**
 * Created by xueyingchen.
 */
	
class Node {
	constructor(value) {
		this.prev = null;
		this.next = null;
		this.value = value;
	}
}

class LRUCache {

	constructor(cap) {
		this.head = new Node(-1),
			this.tail = new Node(-1);
		this.mem = new Map();
		this.miss = 0;
		this.cap = cap;

		this.head.next = this.tail;
		this.tail.prev = this.head;
	}

	/**
	 * get value from the memory
	 * @param key
	 * @return {number}
	 */
	get(key) {
		if (this.mem.has(key)) {
			const node = this.mem.get(key);
			node.prev.next = node.next;
			node.next.prev = node.prev;

			this._moveNodeToTail(node);
			this._print(node);

			return node.value;
		}
		this.miss += 1;
		return -1;
	}

	/**
	 * set key-value to memory
	 * @param key
	 * @param value
	 */
	set(key, value) {
		if (this.get(key) !== -1) {
			this.mem.get(key).value = value;
			return;
		}

		if (this.mem.SIZE === this.cap) {
			this.mem.delete(this.head.next.key);
			this.head.next = this.head.next.next;
			this.head.next.prev = this.head;
		}

		const node = new Node(value);
		this.mem.set(key, node);

		this._moveNodeToTail(node);

	}

	/**
	 * move the node of param to the list tail for updating
	 * @param node
	 * @private
	 */
	_moveNodeToTail(node) {
		node.prev = this.tail.prev;
		node.next = this.tail;
		node.prev.next = node;
		this.tail.prev = node;
	}

	/**
	 * get the count of missing page 
	 * @return {number}
	 */
	getMissCount() {
		return this.miss;
	}

	/**
	 * print the address of node
	 * @param node
	 * @private
	 */
	_print(node) {
		console.log(`The address of instruction is ${node.value}`);
	}
}

const SIZE = 320; // the size of directive pool

/**
 * generate a random value by given a seed
 * @param seed
 * @return {number}
 */
function getRandomValue(seed) {
	const prop = 4 * Math.random() | 0;

	switch (prop) {
		case 0:
		case 1:
			seed += 1;
			break;
		case 2:
			seed = seed * Math.random();
			break;
		case 3:
			seed = seed + (SIZE - seed) * Math.random();
			break;
		default:
			break;
	}

	return seed |= 0;
}

/**
 * the main function
 */
function main() {

	let lru = new LRUCache(40);
	let seed = SIZE * Math.random();

	for (let end = SIZE; end > 0; end--) {
		seed = getRandomValue(seed);
		lru.set(seed, seed);
	}
	
	const missRate = ((lru.getMissCount() / SIZE) * 100).toFixed(2);
	console.log(`The miss rate is ${missRate}%`);
}

main();
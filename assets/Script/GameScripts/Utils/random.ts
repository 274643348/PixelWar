/**
 * 返回min和max之间（不包括max）的随机浮点数
 *
 * @export
 * @param {number} min
 * @param {number} max
 * @returns
 */
export function getRandomFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

/**
 * 返回min和max之间（不包括max）的随机整数
 *
 * @export
 * @param {number} min
 * @param {number} max
 * @returns
 */
export function getRandomInt(min: number, max: number) {
  const minCeil = Math.ceil(min);
  const maxFloor = Math.floor(max);
  return Math.floor(Math.random() * (maxFloor - minCeil)) + minCeil;
}

/**
 * 随机一个布尔值
 */
export function getRandomBoolean() {
  return Math.random() >= 0.5;
}

/**
 * 返回数组中随机一个元素
 *
 * @export
 * @template T
 * @param {T[]} arr
 * @returns {T}
 */
export function getRandomArrayItem<T>(arr: T[]): T {
  return arr[getRandomInt(0, arr.length)];
}

/**
 * 返回一个打乱的数组
 *
 * @param {T[]} arr
 * @returns {T[]}
 */
export function shuffle<T>(arr: T[]): T[] {
  const output = arr.slice();
  for (let i = output.length - 1; i >= 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    const itemAtIndex = output[randomIndex];
    output[randomIndex] = output[i];
    output[i] = itemAtIndex;
  }
  return output;
}

export function getNewUuid() {
  const s: any[] = [];
  const hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i += 1) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  const uuid = s.join("");
  return uuid;
}
/**
 * 随机不重负随机数
 * @param min 最小
 * @param max 最大 不包括（max）
 * @param size 数量
 */
export function getRandomArrayInt(min: number, max: number, size: number) {
  const allNums: number[] = [];
  while (allNums.length < size) {
    const num = getRandomInt(min, max);
    if (!allNums.includes(num)) {
      allNums.push(num);
    }
  }
  return allNums;
}
/**
 * 随机一个数组中不存在的元素
 * @param min 最小
 * @param max 最大 不包括（max）
 * @param arrInt 数组
 */
export function getRandomArratIntNull(
  min: number,
  max: number,
  arrInt: number[]
) {
  let num = 0;
  while (true) {
    num = getRandomInt(min, max);
    if (!arrInt.includes(num)) {
      return num;
    }
  }
}
/**
 * 随机一个数中不存在的元素
 * @param min 最小
 * @param max 最大 不包括（max）
 * @param arrInt 数
 */
export function getRandomIntNull(min: number, max: number, arrInt: number) {
  let num = 0;
  while (true) {
    num = getRandomInt(min, max);
    if (arrInt !== num) {
      return num;
    }
  }
}

/**
 * 延时做业务
 * @param target
 * @param delaTime
 * @param callback
 */
export function delayCallFunc(
  target: cc.Node,
  delaTime: number,
  callback: Function
) {
  target.runAction(cc.sequence(cc.delayTime(5), cc.callFunc(callback)));
}

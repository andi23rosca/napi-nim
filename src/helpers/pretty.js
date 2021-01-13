/**
 * Prettifies json object
 * @param {any} data
 */
export const pretty = (data) => JSON.stringify(data, null, 2);
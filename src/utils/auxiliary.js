/*
* Get the current local time.
* @param {String} locale - The locale string for formatting (default is 'fi-FI').
*/
export const getCurrentLocalTime = (locale = 'fi-FI') => {
    return new Date().toLocaleString(locale);
}

/*
* Get the relative path from a meta URL
* @param {String} metaUrl - The import.meta.url of the module.
*/
export const getRelativePath = (metaUrl) => new URL(metaUrl).pathname;
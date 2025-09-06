/*
* Get the current local time.
* @param {String} locale - The locale string for formatting (default is 'fi-FI').
*/
export const getCurrentLocalTime = (locale = 'fi-FI') => {
    return new Date().toLocaleString(locale);
}

/*
* Get the relative path of a module from its import.meta.url
* @param {String} metaUrl - The import.meta.url of the module.
*/
import path from "path";
import { fileURLToPath } from "url";

export const getRelativePath = (metaUrl) => {
    const absPath = fileURLToPath(metaUrl);
    return path.relative(process.cwd(), absPath);
};
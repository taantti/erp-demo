

/*
* Utility functions
*/



/*
* Get the current local time
*/
export const getCurrentLocalTime = (locale = 'fi-FI') => {
    return new Date().toLocaleString(locale);
}
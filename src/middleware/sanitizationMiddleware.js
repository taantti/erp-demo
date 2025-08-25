import sanitizeHtml from "sanitize-html";
import aux from "./../utils/auxiliary.js";

const sanitizeValue = (value) => {
    if (typeof value === 'string') {
        value = sanitizeHtml(value, { // Sanitize HTML
            allowedTags: [], // No HTML tags allowed
            allowedAttributes: {} // No attributes allowed
        }).trim();
    }
    return value;
}

const sanitizeNestedJson = (data) => {
    if (!data) return data;

    if (Array.isArray(data)) return data.map(item => sanitizeNestedJson(item));


    if (typeof data === 'object') {
        const sanitizedData = {};
        for (const key in data) {
            let value = sanitizeNestedJson(data[key]);
            sanitizedData[key] = sanitizeValue(value);
        }

        return sanitizedData;
    }

    return data;
}

const sanitizeRequest = (req, res, next) => {

    aux.cLog("sanitizeRequest: PRE SANITATION: req.body = " + JSON.stringify(req.body, null, 2));
    
    if(req.method != "GET" && req.method != "DELETE") {
        aux.cLog("sanitizeRequest: req.method = " + req.method);
        if (!req.body) return res.status(400).json({ error: 'Missing request body' });
    }


    //if (!req.body) return res.status(400).json({ error: 'Missing request body' });
    //if (req.body !== 'object') return res.status(400).json({ error: 'Invalid request body' });

    req.body = sanitizeNestedJson(req.body);
    aux.cLog("POST SANITATION: req.body = " + JSON.stringify(req.body, null, 2));

    // Auth headeri sanitation.
    if (req.headers && req.headers.authorization) {
        req.headers.authorization = sanitizeHtml(req.headers.authorization, {
            allowedTags: [],
            allowedAttributes: {}
        }).trim();
    }

    // http query sanitation
    if (req.query) {
        for (const key in req.query) {
            let value = req.query[key];
            if (typeof value === 'string') {
                value = value.trim();
                value = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {}
                });
                req.query[key] = value;
            }
        }
    }

    next();
}


export default sanitizeRequest;


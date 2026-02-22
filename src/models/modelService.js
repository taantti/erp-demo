import mongoose from 'mongoose';
import { log } from '../utils/logger.js';
import { getRelativePath } from '../utils/auxiliary.js';

const relativePath = getRelativePath(import.meta.url);

/**
 * Check user's tenant permissions.
 * @param {Object} req - Express request object
 * @param {boolean} allTenants - Is admin access required for all tenants
 * @param {string} context - (Optional) Context description for logging
 * @returns {void}
 * @throws {Error} - Throws "Permission denied" error if permissions are insufficient
 */
export const checkUserTenantPermissions = (req, allTenants, context = "") => {
    log("INFO", `${relativePath}: checkUserTenantPermissions(): allTenants = ${allTenants}`, true, req);

    if (allTenants && !isAdminTenant(req)) {
        log("CRITICAL", `${context}: Admin tenant access required to access all tenants documents. This should not happen!`, true, req);
        throw new Error("Permission denied");
    }

    if (allTenants && !isOverseerRole(req)) {
        log("CRITICAL", `${context}: Overseer role required to access all tenants documents. This should not happen!`, true, req);
        throw new Error("Permission denied");
    }

    if (!allTenants && !checkTenant(req)) {
        log("CRITICAL", `${context}: User must belong to a tenant. This should not happen!`, true, req);
        throw new Error("Permission denied");
    }
};

/**
 * Check if the users tenant is an admin tenant.
 * @param {Object} req - The request object.
 * @returns {boolean} - True if the users tenant is an admin tenant, false otherwise.
 */
export const isAdminTenant = (req) => {
    if (!req?.user?.tenant?.admin) {
        log("ERROR", `${relativePath}: isAdminTenant: User ${req?.user?.username} is not an admin.`, false, req);
        return false;
    }
    return true;
}

/**
 * Check if the user has the OVERSEER role.
 * @param {Object} req - The request object.
 * @returns {boolean} - True if the user has the OVERSEER role, false otherwise.
 */
export const isOverseerRole = (req) => {
    if (req?.user?.role !== 'OVERSEER') {
        log("ERROR", `${relativePath}: isOverseerRole: User ${req?.user?.username} role is not an OVERSEER.`, false, req);
        return false;
    }
    return true;
}

/**
 * Check if the user has a tenant.
 * @param {Object} req - The request object.
 * @returns {boolean} - True if the user has a tenant, false otherwise.
 */
export const checkTenant = (req) => {
    log("INFO", `${relativePath}: checkTenant`, true, req);
    if (!req?.user?.tenant?.id) {
        log("ERROR", `${relativePath}: checkTenant: User ${req?.user?.username} has no tenant.`, false, req);
        return false;
    }
    return true;
}

/**
 * Initialize the tenant condition parameter for queries.
 * Used when querying documents. Example: GET /users.
 * If allTenants is false or params.tenant is not set, set params.tenant to the user's tenantId.
 * @param {Object} req - The request object.
 * @param {Object} params - The query parameters object.
 * @param {boolean} allTenants - Whether to include all tenants or not.
 * @returns {ObjectId} - The tenant ID to use in the query. 
 */
export const getTenantIdForQuery = (req, tenant, allTenants) => {
    log("INFO", `${relativePath}: getTenantIdForQuery(): allTenants = ${allTenants}`, true, req);
    if (!allTenants || !tenant) tenant = req.user.tenant.id;
    return new mongoose.Types.ObjectId(tenant);
}

/**
 * Get the tenant query condition for database queries.
 * Used when querying documents. Example: GET /users or GET /users/:id.
 * @param {string} tenantId - The tenant ID to use in the query.
 * @param {boolean} allTenants - Whether to include all tenants or not.
 * @returns {Object} - The tenant query condition.
 */
export const getTenantQueryCondition = (req, tenantId, allTenants) => {
    log("INFO", `${relativePath}: getTenantQueryCondition(): allTenants = ${allTenants}`, true, req);
    if (allTenants) return {};
    return { tenant: new mongoose.Types.ObjectId(tenantId) };
}

/*
    * Set the tenant field in the data object if allTenants is false.
    * Used when creating or updating documents. Example: POST /users or PUT /users/:id.
    * @param {Object} req - The request object.
    * @param {Object} data - The data object to set the tenant field in.
    * @param {boolean} allTenants - Whether to include all tenants or not.
    * @returns {Object} - The data object with the tenant field set if applicable.
    */
export const setTenantForData = (req, data, allTenants = false) => {
    if (!allTenants) data.tenant = req.user.tenant.id;
    return data;
};

/**
 * Convert a Mongoose document to a plain JavaScript object if the query was executed with the `lean` option.
 * @param {*} document - The Mongoose document to convert. (JSDoc type * means "any type" is accepted)
 * @param {*} lean - Whether the query was executed with the `lean` option. (JSDoc type * means "any type")
 * @returns {*} - The plain JavaScript object or the original document. (JSDoc type * means "any type")
 */
export const toPlainObjectIfLean = (document, lean) => {
    if(!document || lean) return document;
    return document.toObject();
}

/**
 * Rakentaa MongoDB-hakuobjektin annettujen parametrien perusteella.
 * 
 * @param {Object} filters - Hakuehdot objektina
 * @param {Object} options - Lisäasetukset haulle
 * @param {boolean} options.exactMatch - Jos true, tehdään täsmällinen haku (oletus: false)
 * @param {boolean} options.caseInsensitive - Jos true, haku on merkkikokoriippumaton (oletus: true)
 * @param {Object} options.customOperators - Mukautetut operaattorit kentille, esim. { age: "$gt" }
 * @param {Array} options.orFields - Kentät, jotka yhdistetään OR-operaattorilla
 * @returns {Object} MongoDB-hakuobjekti
 */
function queryBuilder(filters, options = {}) {
  // Oletusasetukset
  const {
    exactMatch = false,
    caseInsensitive = true,
    customOperators = {},
    orFields = []
  } = options;
  
  // Alustetaan hakuobjekti
  const query = {};
  const orConditions = [];
  
  // Käsitellään jokainen annettu hakuehto
  Object.entries(filters).forEach(([field, value]) => {
    // Ohitetaan tyhjät arvot
    if (value === undefined || value === null || value === '') {
      return;
    }
    
    // Tarkistetaan onko kenttä OR-ehdoissa
    const isOrField = orFields.includes(field);
    
    // Määritellään hakuoperaattori ja arvo
    let condition;
    
    // Jos kentälle on määritelty mukautettu operaattori
    if (customOperators[field]) {
      condition = { [customOperators[field]]: value };
    } 
    // Jos halutaan täsmällinen haku
    else if (exactMatch) {
      condition = value;
    } 
    // Oletuksena osittainen regex-haku
    else if (typeof value === 'string') {
      const regexOptions = caseInsensitive ? 'i' : '';
      condition = { $regex: value, $options: regexOptions };
    } 
    // Muut tyypit käsitellään suoraan
    else {
      condition = value;
    }
    
    // Lisätään ehto joko OR-listaan tai suoraan kyselyyn
    if (isOrField) {
      orConditions.push({ [field]: condition });
    } else {
      query[field] = condition;
    }
  });
  
  // Jos OR-ehtoja on määritelty, lisätään ne kyselyyn
  if (orConditions.length > 0) {
    query.$or = orConditions;
  }
  
  return query;
}



/*-----------------------------------------------
Käyttöesimerkkejä:
1. Perus tekstihaku
const filters = { name: "Matti", city: "Helsinki" };
const query = queryBuilder(filters);
const users = await User.find(query);

2. Täsmällinen haku
const filters = { status: "active", role: "admin" };
const query = queryBuilder(filters, { exactMatch: true });
const users = await User.find(query);

3. Numerovertailut
const filters = { age: 30, score: 100 };
const options = {
  customOperators: { age: "$gte", score: "$lte" }
};
const query = queryBuilder(filters, options);
const users = await User.find(query);

4. OR-haku
const filters = { name: "Matti", email: "matti", phone: "040" };
const options = {
  orFields: ["email", "phone"] // Hakee käyttäjiä, joilla on name="Matti" JA (email sisältää "matti" TAI phone sisältää "040")
};
const query = queryBuilder(filters, options);
const users = await User.find(query);

5. Monipuolinen haku
const filters = {
  name: "Matti",
  age: 25,
  status: "active",
  email: "example",
  createdAt: new Date("2023-01-01")
};

const options = {
  exactMatch: false,
  caseInsensitive: true,
  customOperators: {
    age: "$gte",
    createdAt: "$gte"
  },
  orFields: ["email", "name"]
};

const query = queryBuilder(filters, options);
const users = await User.find(query);

-------------------------------------------------------------------------------------------------------------
*/
/**
 * MongoDB-hakutyökalut
 */
const QueryBuilder = {
  /**
   * Rakentaa MongoDB-hakuobjektin annettujen parametrien perusteella.
   * @param {Object} filters - Hakuehdot objektina
   * @param {Object} options - Lisäasetukset haulle
   * @returns {Object} MongoDB-hakuobjekti
   */
  build(filters, options = {}) {
    // Alustetaan hakuobjekti
    const query = {};
    const orConditions = [];
    
    // Käsitellään jokainen annettu hakuehto
    Object.entries(filters).forEach(([field, value]) => {
      // Ohitetaan tyhjät arvot
      if (this.isEmpty(value)) {
        return;
      }
      
      // Tarkistetaan onko kenttä OR-ehdoissa
      const isOrField = this.isOrField(field, options.orFields);
      
      // Luo ehto kentälle
      const condition = this.createCondition(field, value, options);
      
      // Lisätään ehto joko OR-listaan tai suoraan kyselyyn
      if (isOrField) {
        orConditions.push({ [field]: condition });
      } else {
        query[field] = condition;
      }
    });
    
    // Jos OR-ehtoja on määritelty, lisätään ne kyselyyn
    if (orConditions.length > 0) {
      query.$or = orConditions;
    }
    
    return query;
  },
  
  /**
   * Tarkistaa onko arvo tyhjä
   * @param {any} value - Tarkistettava arvo
   * @returns {boolean} - Onko arvo tyhjä
   */
  isEmpty(value) {
    return value === undefined || value === null || value === '';
  },
  
  /**
   * Tarkistaa kuuluuko kenttä OR-kenttiin
   * @param {string} field - Kentän nimi
   * @param {Array} orFields - Lista OR-kentistä
   * @returns {boolean} - Kuuluuko kenttä OR-kenttiin
   */
  isOrField(field, orFields = []) {
    return Array.isArray(orFields) && orFields.includes(field);
  },
  
  /**
   * Luo hakuehdon kentälle
   * @param {string} field - Kentän nimi
   * @param {any} value - Kentän arvo
   * @param {Object} options - Hakuasetukset
   * @returns {any} - Hakuehto
   */
  createCondition(field, value, options = {}) {
    const {
      exactMatch = false,
      caseInsensitive = true,
      customOperators = {}
    } = options;
    
    // Jos kentälle on määritelty mukautettu operaattori
    if (customOperators[field]) {
      return { [customOperators[field]]: value };
    } 
    
    // Jos halutaan täsmällinen haku
    if (exactMatch) {
      return value;
    } 
    
    // Tekstikenttien regex-haku
    if (typeof value === 'string') {
      return this.createRegexCondition(value, caseInsensitive);
    } 
    
    // Muut tyypit käsitellään suoraan
    return value;
  },
  
  /**
   * Luo regex-hakuehdon
   * @param {string} value - Hakuarvo
   * @param {boolean} caseInsensitive - Onko haku merkkikokoriippumaton
   * @returns {Object} - Regex-hakuehto
   */
  createRegexCondition(value, caseInsensitive = true) {
    const regexOptions = caseInsensitive ? 'i' : '';
    return { $regex: value, $options: regexOptions };
  },
  
  /**
   * Luo hakuehdon numeerisille vertailuille
   * @param {string} operator - Vertailuoperaattori ($gt, $lt, jne.)
   * @param {number} value - Vertailuarvo
   * @returns {Object} - Vertailuehto
   */
  createNumericCondition(operator, value) {
    return { [operator]: value };
  },
  
  /**
   * Luo hakuehdon päivämäärävertailuille
   * @param {string} operator - Vertailuoperaattori ($gt, $lt, jne.)
   * @param {Date|string} date - Päivämäärä
   * @returns {Object} - Päivämäärävertailuehto
   */
  createDateCondition(operator, date) {
    const dateValue = date instanceof Date ? date : new Date(date);
    return { [operator]: dateValue };
  }
};

export default QueryBuilder;

/*
Käyttöesimerkkejä:
import QueryBuilder from './queryBuilder';

// Perushaku
const basicQuery = QueryBuilder.build({ 
  name: "Matti", 
  city: "Helsinki" 
});

// Monipuolinen haku
const advancedQuery = QueryBuilder.build(
  {
    name: "Matti",
    age: 25,
    email: "example"
  }, 
  {
    exactMatch: false,
    customOperators: { age: "$gte" },
    orFields: ["email", "name"]
  }
);
*/
// Käyttö Mongoose-haun kanssa
//const users = await User.find(advancedQuery);






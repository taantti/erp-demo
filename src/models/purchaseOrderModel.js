import mongoose from 'mongoose';
import { checkUserTenantPermissions, getTenantIdForQuery, getTenantQueryCondition, setTenantForData, setAutoField, AutoField } from './modelService.js';
import { sanitizeObjectFields } from '../utils/sanitization.js';
import { getRelativePath } from '../utils/auxiliary.js';

const relativePath = getRelativePath(import.meta.url);
const protectedModelFields = ['__v'];

export const PurchaseOrderStatuses = {
  DRAFT: 'draft',
  ORDERED: 'ordered',
  PARTIALLY_RECEIVED: 'partially_received',
  RECEIVED: 'received',
  CANCELLED: 'cancelled'
}

const ItemSchema = new mongoose.Schema({
  productName: String,
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  stockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock' },
  shelfId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shelf' },
  quantity: { type: Number, required: true },
  unitNetPrice: { type: Number, required: true },
  unitGrossPrice: { type: Number, required: true },
  vat: { type: Number, required: true },
  receivedQuantity: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const PurchaseOrderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  supplier: String,
  status: { type: String, enum: Object.values(PurchaseOrderStatuses), default: PurchaseOrderStatuses.DRAFT, required: true },
  orderDate: { type: Date },
  expectedDeliveryDate: { type: Date },
  items: [ItemSchema],
  notes: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true }
});

PurchaseOrderSchema.pre('save', async function (next) {
  this.updatedAt = new Date();
  return next();
});

/**
 * Create a new purchase order.
 * @param {Object} req - The request object.
 * @param {Object} purchaseOrderData - The purchase order data to create.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Object>} - The created purchase order object.
 */
export const createPurchaseOrder = async (req, purchaseOrderData, allTenants = false, sanitize = true, lean = true) => {
  checkUserTenantPermissions(req, allTenants, `${relativePath}: createPurchaseOrder()`);
  purchaseOrderData = setTenantForData(req, purchaseOrderData, allTenants);
  purchaseOrderData = setAutoField(req, purchaseOrderData, AutoField.CREATED_BY);
  let newPurchaseOrder = await new PurchaseOrder({ ...purchaseOrderData }).save();
  if (lean) newPurchaseOrder = newPurchaseOrder.toObject();
  if (sanitize) newPurchaseOrder = sanitizeObjectFields(newPurchaseOrder, protectedModelFields);
  return newPurchaseOrder;
};

/**
 * Find purchase order based on query parameters.
 * @param {Object} req - The request object.
 * @param {Object} params - The query parameters to filter purchase order.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Array>} - Returns an array of purchase order objects (possibly empty array).
 */
export const findPurchaseOrders = async (req, params = {}, allTenants = false, sanitize = true, lean = true) => {
  checkUserTenantPermissions(req, allTenants, `${relativePath}: findPurchaseOrders()`);
  params.tenant = getTenantIdForQuery(req, params.tenant, allTenants);
  let purchaseOrders = await PurchaseOrder.find(params).lean(lean).exec();
  if (sanitize) purchaseOrders = purchaseOrders.map(s => sanitizeObjectFields(s, protectedModelFields));
  return purchaseOrders;
};

/**
 * Find a purchase order by ID.
 * @param {Object} req - The request object.
 * @param {string} purchaseOrderId - The ID of the purchase order to find.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Object|null>} - The purchase order object if found, otherwise null.
 */
export const findPurchaseOrderById = async (req, purchaseOrderId, allTenants = false, sanitize = true, lean = true) => {
  checkUserTenantPermissions(req, allTenants, `${relativePath}: findPurchaseOrderById()`);
  const tenantCondition = getTenantQueryCondition(req, req.user.tenant?.id, allTenants);
  let purchaseOrder = await PurchaseOrder.findOne({ _id: purchaseOrderId, ...tenantCondition }).lean(lean).exec();
  if (sanitize) purchaseOrder = sanitizeObjectFields(purchaseOrder, protectedModelFields);
  return purchaseOrder;
};

/**
 * Find a purchase order by ID and update.
 * @param {Object} req - The request object.
 * @param {string} purchaseOrderId - The ID of the purchase order to update.
 * @param {Object} purchaseOrderData - The new data to update the purchase order with.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Object|null>} - The updated purchase order object if found and updated, otherwise null.
 */
export const updatePurchaseOrderById = async (req, purchaseOrderId, purchaseOrderData, allTenants = false, sanitize = true, lean = true) => {
  checkUserTenantPermissions(req, allTenants, `${relativePath}: updatePurchaseOrderById()`);
  purchaseOrderData = setAutoField(req, purchaseOrderData, AutoField.UPDATED_BY);
  const tenantCondition = getTenantQueryCondition(req, req.user.tenant?.id, allTenants);
  let updatedPurchaseOrder = await PurchaseOrder.findOneAndUpdate({ _id: purchaseOrderId, ...tenantCondition }, purchaseOrderData, { new: true }).lean(lean).exec();
  if (sanitize) updatedPurchaseOrder = sanitizeObjectFields(updatedPurchaseOrder, protectedModelFields);
  return updatedPurchaseOrder;
};

/**
 * Delete a purchase order by ID.
 * @param {Object} req - The request object.
 * @param {string} purchaseOrderId - The ID of the purchase order to delete.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @returns {Promise<Object|null>} - The deleted purchase order object if found, otherwise null.
 */
export const deletePurchaseOrderById = async (req, purchaseOrderId, allTenants = false) => {
  checkUserTenantPermissions(req, allTenants, `${relativePath}: deletePurchaseOrderById()`);
  const tenantCondition = getTenantQueryCondition(req, req.user.tenant?.id, allTenants);
  return await PurchaseOrder.findOneAndDelete({ _id: purchaseOrderId, ...tenantCondition });
};

/**
 * Add a new embedded item to a purchase order.
 * @param {Object} req - The request object.
 * @param {string} purchaseOrderId - The ID of the parent purchase order.
 * @param {Object} itemData - The purchase order item data to create.
 * @param {boolean} [allTenants = false] - (Optional) Whether to include all tenants or not.
 * @returns {Promise<Object>} - The created purchase order item object.
 */
export const createItem = async (req, purchaseOrderId, itemData, allTenants = false) => {
  checkUserTenantPermissions(req, allTenants, `${relativePath}: createItem()`);
  const tenantCondition = getTenantQueryCondition(req, req.user.tenant?.id, allTenants);

  let purchaseOrder = await PurchaseOrder.findOne({ _id: purchaseOrderId, ...tenantCondition });
  if (!purchaseOrder) return null;

  itemData = setAutoField(req, itemData, AutoField.CREATED_BY);
  purchaseOrder.items.push(itemData);

  await purchaseOrder.save()
  return purchaseOrder.items[purchaseOrder.items.length - 1];
};

/**
 * Find embedded items of the purchase order
 * @param {Object} req - The request object.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Array>} - Returns an array of purchase order item objects (possibly empty array).
 */
export const findItems = async (req, purchaseOrderId, allTenants = false, sanitize = true, lean = true) => {
  checkUserTenantPermissions(req, allTenants, `${relativePath}: findItems()`);
  const tenantCondition = getTenantQueryCondition(req, req.user.tenant?.id, allTenants);

  const purchaseOrder = await PurchaseOrder.findOne({ _id: purchaseOrderId, ...tenantCondition });
  if (!purchaseOrder) return null;
  return purchaseOrder.items;
};

/**
 * Find a item by ID.
 * @param {Object} req - The request object.
 * @param {string} itemId - The ID of the purchase order item to find.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Object|null>} - The purchase order item object if found, otherwise null.
 */
export const findItemById = async (req, purchaseOrderId, itemId, allTenants = false) => {
  checkUserTenantPermissions(req, allTenants, `${relativePath}: findItemById()`);
  const tenantCondition = getTenantQueryCondition(req, req.user.tenant?.id, allTenants);

  const purchaseOrder = await PurchaseOrder.findOne({ _id: purchaseOrderId, ...tenantCondition });
  if (!purchaseOrder) return null;

  const item = purchaseOrder.items.id(itemId);
  if (!item) return null;
  return item;
};

/**
 * Update a embedde item in a purchase order.
 * @param {Object} req - The request object.
 * @param {string} purchaseOrderId - The ID of the parent purchase order.
 * @param {string} itemId - The _id of the embedde item to update.
 * @param {Object} itemData - The new data to update the purchase order with.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @returns {Promise<Object|null>} - The updated purchase order item object if found and updated, otherwise null.
 */
export const updateItemById = async (req, purchaseOrderId, itemId, itemData, allTenants = false) => {
  checkUserTenantPermissions(req, allTenants, `${relativePath}: updateItemById()`);
  const tenantCondition = getTenantQueryCondition(req, req.user.tenant?.id, allTenants);

  const purchaseOrder = await PurchaseOrder.findOne({ _id: purchaseOrderId, ...tenantCondition });
  if (!purchaseOrder) return null;

  const item = purchaseOrder.items.id(itemId);
  if (!item) return null;

  item.set(itemData);
  await purchaseOrder.save();
  return item;
};

/**
 * Delete a item embedded by ID from purchase order.
 * @param {Object} req - The request object.
 * @param {string} purchaseOrderId - The ID of the parent purchase order.
 * @param {string} itemId - The _id of the embedded item to delete.
 * @param {boolean} allTenants = false - (Optional) Whether to include all tenants or not.
 * @returns {Promise<Object|null>} - The updated purchase order, or null if no order or item was found.
 */
export const deleteItemById = async (req, purchaseOrderId, itemId, allTenants = false) => {
  checkUserTenantPermissions(req, allTenants, `${relativePath}: deleteItemById()`);
  const tenantCondition = getTenantQueryCondition(req, req.user.tenant?.id, allTenants);

  let purchaseOrder = await PurchaseOrder.findOne({ _id: purchaseOrderId, ...tenantCondition });
  if (!purchaseOrder) return null;

  const item = purchaseOrder.items.id(itemId);
  if (!item) return null;

  item.deleteOne();
  return await purchaseOrder.save();

};

export const PurchaseOrder = mongoose.model('PurchaseOrder', PurchaseOrderSchema);

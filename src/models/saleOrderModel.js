import mongoose from 'mongoose';
import { checkUserTenantPermissions, getTenantIdForQuery, getTenantQueryCondition, setTenantForData, setAutoField, AutoField } from './modelService.js';
import { sanitizeObjectFields } from '../utils/sanitization.js';
import { getRelativePath } from '../utils/auxiliary.js';

const relativePath = getRelativePath(import.meta.url);
const protectedModelFields = ['__v'];

export const SaleOrderStatuses = {
  DRAFT: 'draft',
  ORDERED: 'ordered',
  PARTIALLY_SENT: 'partially_sent',
  SEND: 'send',
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
  sendQuantity: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const SaleOrderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  status: { type: String, enum: Object.values(SaleOrderStatuses), default: SaleOrderStatuses.DRAFT, required: true },
  orderDate: { type: Date },
  expectedDeliveryDate: { type: Date },
  items: [ItemSchema],
  notes: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true }
});

SaleOrderSchema.pre('save', async function (next) {
  this.updatedAt = new Date();
  return next();
});

/**
 * Create a new sale order.
 * @param {Object} req - The request object.
 * @param {Object} saleOrderData - The sale order data to create.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Object>} - The created sale order object.
 */
export const createSaleOrder = async (req, saleOrderData, allTenants = false, sanitize = true, lean = true) => {
  checkUserTenantPermissions(req, allTenants, `${relativePath}: createSaleOrder()`);
  saleOrderData = setTenantForData(req, saleOrderData, allTenants);
  saleOrderData = setAutoField(req, saleOrderData, AutoField.CREATED_BY);
  let newSaleOrder = await new SaleOrder({ ...saleOrderData }).save();
  if (lean) newSaleOrder = newSaleOrder.toObject();
  if (sanitize) newSaleOrder = sanitizeObjectFields(newSaleOrder, protectedModelFields);
  return newSaleOrder;
};

/**
 * Find sale order based on query parameters.
 * @param {Object} req - The request object.
 * @param {Object} params - The query parameters to filter sale order.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Array>} - Returns an array of sale order objects (possibly empty array).
 */
export const findSaleOrders = async (req, params = {}, allTenants = false, sanitize = true, lean = true) => {
  checkUserTenantPermissions(req, allTenants, `${relativePath}: findSaleOrders()`);
  params.tenant = getTenantIdForQuery(req, params.tenant, allTenants);
  let saleOrders = await SaleOrder.find(params).lean(lean).exec();
  if (sanitize) saleOrders = saleOrders.map(s => sanitizeObjectFields(s, protectedModelFields));
  return saleOrders;
};

/**
 * Find a sale order by ID.
 * @param {Object} req - The request object.
 * @param {string} saleOrderId - The ID of the sale order to find.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Object|null>} - The sale order object if found, otherwise null.
 */
export const findSaleOrderById = async (req, saleOrderId, allTenants = false, sanitize = true, lean = true) => {
  checkUserTenantPermissions(req, allTenants, `${relativePath}: findSaleOrderById()`);
  const tenantCondition = getTenantQueryCondition(req, req.user.tenant?.id, allTenants);
  let saleOrder = await SaleOrder.findOne({ _id: saleOrderId, ...tenantCondition }).lean(lean).exec();
  if (sanitize) saleOrder = sanitizeObjectFields(saleOrder, protectedModelFields);
  return saleOrder;
};

/**
 * Find a sale order by ID and update.
 * @param {Object} req - The request object.
 * @param {string} saleOrderId - The ID of the sale order to update.
 * @param {Object} saleOrderData - The new data to update the sale order with.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Object|null>} - The updated sale order object if found and updated, otherwise null.
 */
export const updateSaleOrderById = async (req, saleOrderId, saleOrderData, allTenants = false, sanitize = true, lean = true) => {
  checkUserTenantPermissions(req, allTenants, `${relativePath}: updateSaleOrderById()`);
  saleOrderData = setAutoField(req, saleOrderData, AutoField.UPDATED_BY);
  const tenantCondition = getTenantQueryCondition(req, req.user.tenant?.id, allTenants);
  let updatedSaleOrder = await SaleOrder.findOneAndUpdate({ _id: saleOrderId, ...tenantCondition }, saleOrderData, { new: true }).lean(lean).exec();
  if (sanitize) updatedSaleOrder = sanitizeObjectFields(updatedSaleOrder, protectedModelFields);
  return updatedSaleOrder;
};

/**
 * Delete a sale order by ID.
 * @param {Object} req - The request object.
 * @param {string} saleOrderId - The ID of the sale order to delete.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @returns {Promise<Object|null>} - The deleted sale order object if found, otherwise null.
 */
export const deleteSaleOrderById = async (req, saleOrderId, allTenants = false) => {
  checkUserTenantPermissions(req, allTenants, `${relativePath}: deleteSaleOrderById()`);
  const tenantCondition = getTenantQueryCondition(req, req.user.tenant?.id, allTenants);
  return await SaleOrder.findOneAndDelete({ _id: saleOrderId, ...tenantCondition });
};

/**
 * Add a new embedded item to a sale order.
 * @param {Object} req - The request object.
 * @param {string} saleOrderId - The ID of the parent sale order.
 * @param {Object} itemData - The sale order item data to create.
 * @param {boolean} [allTenants = false] - (Optional) Whether to include all tenants or not.
 * @returns {Promise<Object>} - The created sale order item object.
 */
export const createItem = async (req, saleOrderId, itemData, allTenants = false) => {
  checkUserTenantPermissions(req, allTenants, `${relativePath}: createItem()`);
  const tenantCondition = getTenantQueryCondition(req, req.user.tenant?.id, allTenants);

  let saleOrder = await SaleOrder.findOne({ _id: saleOrderId, ...tenantCondition });
  if (!saleOrder) return null;

  itemData = setAutoField(req, itemData, AutoField.CREATED_BY);
  saleOrder.items.push(itemData);

  await saleOrder.save()
  return saleOrder.items[saleOrder.items.length - 1];
};

/**
 * Find embedded items of the sale order
 * @param {Object} req - The request object.
 * @param {string} saleOrderId - The ID of the parent sale order.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Array>} - Returns an array of sale order item objects (possibly empty array).
 */
export const findItems = async (req, saleOrderId, allTenants = false, sanitize = true, lean = true) => {
  checkUserTenantPermissions(req, allTenants, `${relativePath}: findItems()`);
  const tenantCondition = getTenantQueryCondition(req, req.user.tenant?.id, allTenants);

  const saleOrder = await SaleOrder.findOne({ _id: saleOrderId, ...tenantCondition });
  if (!saleOrder) return null;
  return saleOrder.items;
};

/**
 * Find a item by ID.
 * @param {Object} req - The request object.
 * @param {string} saleOrderId - The ID of the parent sale order.
 * @param {string} itemId - The ID of the sale order item to find.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @param {boolean} sanitize - (Optional) Whether to sanitize the output by removing protected fields.
 * @param {boolean} lean - (Optional) Whether to return plain JavaScript objects or Mongoose documents.
 * @returns {Promise<Object|null>} - The sale order item object if found, otherwise null.
 */
export const findItemById = async (req, saleOrderId, itemId, allTenants = false) => {
  checkUserTenantPermissions(req, allTenants, `${relativePath}: findItemById()`);
  const tenantCondition = getTenantQueryCondition(req, req.user.tenant?.id, allTenants);

  const saleOrder = await SaleOrder.findOne({ _id: saleOrderId, ...tenantCondition });
  if (!saleOrder) return null;

  const item = saleOrder.items.id(itemId);
  if (!item) return null;
  return item;
};

/**
 * Update a embedde item in a sale order.
 * @param {Object} req - The request object.
 * @param {string} saleOrderId - The ID of the parent sale order.
 * @param {string} itemId - The _id of the embedde item to update.
 * @param {Object} itemData - The new data to update the sale order with.
 * @param {boolean} allTenants - (Optional) Whether to include all tenants or not.
 * @returns {Promise<Object|null>} - The updated sale order item object if found and updated, otherwise null.
 */
export const updateItemById = async (req, saleOrderId, itemId, itemData, allTenants = false) => {
  checkUserTenantPermissions(req, allTenants, `${relativePath}: updateItemById()`);
  const tenantCondition = getTenantQueryCondition(req, req.user.tenant?.id, allTenants);

  const saleOrder = await SaleOrder.findOne({ _id: saleOrderId, ...tenantCondition });
  if (!saleOrder) return null;

  const item = saleOrder.items.id(itemId);
  if (!item) return null;

  item.set(itemData);
  await saleOrder.save();
  return item;
};

/**
 * Delete a item embedded by ID from sale order.
 * @param {Object} req - The request object.
 * @param {string} saleOrderId - The ID of the parent sale order.
 * @param {string} itemId - The _id of the embedded item to delete.
 * @param {boolean} allTenants = false - (Optional) Whether to include all tenants or not.
 * @returns {Promise<Object|null>} - The updated sale order, or null if no order or item was found.
 */
export const deleteItemById = async (req, saleOrderId, itemId, allTenants = false) => {
  checkUserTenantPermissions(req, allTenants, `${relativePath}: deleteItemById()`);
  const tenantCondition = getTenantQueryCondition(req, req.user.tenant?.id, allTenants);

  let saleOrder = await SaleOrder.findOne({ _id: saleOrderId, ...tenantCondition });
  if (!saleOrder) return null;

  const item = saleOrder.items.id(itemId);
  if (!item) return null;

  item.deleteOne();
  return await saleOrder.save();

};

export const SaleOrder = mongoose.model('SaleOrder', SaleOrderSchema);

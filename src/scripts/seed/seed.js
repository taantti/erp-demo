/*
    seed.js
    Fills the dev database with a large, realistic dataset for reporting/demo use.
    Requires that `npm run init` has already been run (roles, tenants, users).

    Use: npm run seed            - insert seed data (additive)
         npm run seed -- --reset - clear transactional collections of the tenant first
                                   (never touches roles, tenants or users)
*/

import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import config from '../../config.js';
import {
    Tenant, User,
    ProductCategory, Product,
    Stock, Shelf, Inventory,
    Customer, SaleOrder, PurchaseOrder
} from '../../models/index.js';
import { ProductUnits } from '../../models/productModel.js';
import { SaleOrderStatuses } from '../../models/saleOrderModel.js';
import { PurchaseOrderStatuses } from '../../models/purchaseOrderModel.js';
import { log } from '../../utils/logger.js';

// Volumes
const NUM_CATEGORIES = 10;
const NUM_PRODUCTS = 80;
const NUM_STOCKS = 3;
const SHELVES_PER_STOCK = 6;
const NUM_CUSTOMERS = 30;
const NUM_SALE_ORDERS = 600;
const NUM_PURCHASE_ORDERS = 150;
const LOW_STOCK_RATIO = 0.25;   // fraction of products with quantity < 10
const VAT_RATES = [25.5, 14, 10];

// Unique-key suffix so re-running the seed never collides on sku/slug/orderNumber
const runTag = Date.now().toString(36).toUpperCase();

const DAY_MS = 24 * 60 * 60 * 1000;
const now = new Date();
const yearAgo = new Date(now.getTime() - 365 * DAY_MS);

const connectMongoose = async () => {
    try {
        const dbUri = config.DATABASE_URI || `mongodb://${config.DATABASE_HOST}:${config.DATABASE_PORT}/${config.DATABASE_NAME}`;
        await mongoose.connect(dbUri);
        return true;
    } catch (error) {
        log("ERROR", `seed.js: connectMongoose(): ${error.name}: ${error.message}`, true);
        return false;
    }
};

const pick = (array) => array[Math.floor(Math.random() * array.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const round2 = (value) => Math.round(value * 100) / 100;
const grossFromNet = (net, vat) => round2(net * (1 + vat / 100));

/* Random date within the last 12 months. */
const randomPastDate = () => faker.date.between({ from: yearAgo, to: now });

const ageInDays = (date) => (now.getTime() - date.getTime()) / DAY_MS;

/* Older orders are mostly completed, recent ones are still open. */
const saleOrderStatusFor = (orderDate) => {
    const age = ageInDays(orderDate);
    if (age > 60) return Math.random() < 0.92 ? SaleOrderStatuses.SEND : SaleOrderStatuses.CANCELLED;
    if (age > 14) return pick([SaleOrderStatuses.SEND, SaleOrderStatuses.SEND, SaleOrderStatuses.PARTIALLY_SENT, SaleOrderStatuses.ORDERED]);
    return pick([SaleOrderStatuses.DRAFT, SaleOrderStatuses.ORDERED, SaleOrderStatuses.ORDERED, SaleOrderStatuses.PARTIALLY_SENT]);
};

const purchaseOrderStatusFor = (orderDate) => {
    const age = ageInDays(orderDate);
    if (age > 30) return Math.random() < 0.95 ? PurchaseOrderStatuses.RECEIVED : PurchaseOrderStatuses.CANCELLED;
    return pick([PurchaseOrderStatuses.DRAFT, PurchaseOrderStatuses.ORDERED, PurchaseOrderStatuses.ORDERED, PurchaseOrderStatuses.PARTIALLY_RECEIVED]);
};

const slugify = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const resetTransactionalCollections = async (tenantId) => {
    const targets = [
        ['saleorders', SaleOrder], ['purchaseorders', PurchaseOrder],
        ['inventories', Inventory], ['shelves', Shelf], ['stocks', Stock],
        ['products', Product], ['productcategories', ProductCategory], ['customers', Customer]
    ];
    for (const [label, Model] of targets) {
        const { deletedCount } = await Model.deleteMany({ tenant: tenantId });
        console.log(`  reset: removed ${deletedCount} from ${label}`);
    }
};

const seed = async () => {
    const reset = process.argv.includes('--reset');
    const dbUri = config.DATABASE_URI || `mongodb://${config.DATABASE_HOST}:${config.DATABASE_PORT}/${config.DATABASE_NAME}`;

    console.log(`seed.js: target database: ${dbUri}`);
    console.log(`seed.js: connection db name: ${mongoose.connection.name}`);

    // Use the tenant of an existing init-seeded user so the data is visible to that login.
    const user = await User.findOne().lean();
    if (!user) {
        console.error('seed.js: no users found in the database. Run "npm run init" first.');
        return false;
    }
    const tenant = await Tenant.findById(user.tenant).lean();
    if (!tenant) {
        console.error('seed.js: user exists but its tenant was not found. Run "npm run init" first.');
        return false;
    }
    const tenantId = tenant._id;
    const userId = user._id;
    console.log(`seed.js: seeding for tenant "${tenant.name}" (${tenantId}), createdBy user "${user.username}" (${userId})`);

    if (reset) {
        console.log('seed.js: --reset given, clearing transactional collections for this tenant (roles/tenants/users untouched)...');
        await resetTransactionalCollections(tenantId);
    }

    const audit = { createdBy: userId, updatedBy: userId, tenant: tenantId };

    // 1. Product categories
    const categoryDocs = [];
    const usedCategoryNames = new Set();
    while (categoryDocs.length < NUM_CATEGORIES) {
        const name = faker.commerce.department();
        if (usedCategoryNames.has(name)) continue;
        usedCategoryNames.add(name);
        const createdAt = randomPastDate();
        categoryDocs.push({
            name,
            slug: `${slugify(name)}-${runTag.toLowerCase()}`,
            description: faker.commerce.productDescription().slice(0, 200),
            level: 0,
            active: true,
            createdAt,
            updatedAt: createdAt,
            ...audit
        });
    }
    const categories = await ProductCategory.insertMany(categoryDocs);

    // 2. Stocks + shelves
    const stockDocs = Array.from({ length: NUM_STOCKS }, () => {
        const createdAt = randomPastDate();
        return {
            name: `${faker.location.city()} warehouse`,
            location: {
                address: faker.location.streetAddress(),
                city: faker.location.city(),
                postalCode: faker.location.zipCode('#####'),
                country: 'Finland',
                coordinates: { lat: Number(faker.location.latitude()), lng: Number(faker.location.longitude()) }
            },
            active: true,
            manager: faker.person.fullName(),
            contactInfo: { phone: faker.phone.number(), email: faker.internet.email().toLowerCase() },
            createdAt,
            updatedAt: createdAt,
            ...audit
        };
    });
    const stocks = await Stock.insertMany(stockDocs);

    const shelfDocs = [];
    for (const [stockIndex, stock] of stocks.entries()) {
        for (let i = 0; i < SHELVES_PER_STOCK; i++) {
            const createdAt = randomPastDate();
            shelfDocs.push({
                stockId: stock._id,
                name: `Shelf ${String.fromCharCode(65 + i)}`,
                code: `S${stockIndex + 1}-${String.fromCharCode(65 + i)}`,
                location: `Aisle ${i + 1}`,
                capacity: randomInt(100, 1000),
                active: true,
                createdAt,
                updatedAt: createdAt,
                ...audit
            });
        }
    }
    const shelves = await Shelf.insertMany(shelfDocs);
    const shelvesByStock = new Map(stocks.map(s => [s._id.toString(), shelves.filter(sh => sh.stockId.equals(s._id))]));

    // 3. Products
    const productDocs = Array.from({ length: NUM_PRODUCTS }, (unused, i) => {
        const vatRate = pick(VAT_RATES);
        const netPrice = round2(Number(faker.commerce.price({ min: 2, max: 900 })));
        const createdAt = randomPastDate();
        return {
            name: faker.commerce.productName(),
            sku: `SKU-${runTag}-${String(i + 1).padStart(3, '0')}`,
            unit: pick([ProductUnits.PIECE, ProductUnits.PIECE, ProductUnits.PIECE, ProductUnits.BOX, ProductUnits.KILOGRAM, ProductUnits.LITER, ProductUnits.METER]),
            description: faker.commerce.productDescription().slice(0, 300),
            categoryIds: [pick(categories)._id],
            netPrice,
            grossPrice: grossFromNet(netPrice, vatRate),
            vatRate,
            active: Math.random() < 0.95,
            createdAt,
            updatedAt: createdAt,
            ...audit
        };
    });
    const products = await Product.insertMany(productDocs);

    // 4. Inventory: every product gets a home stock + shelf; a controlled fraction is low on stock.
    // productHome remembers each product's stock/shelf so order items reference consistent locations.
    const productHome = new Map();
    const inventoryDocs = products.map((product, i) => {
        const stock = pick(stocks);
        const shelf = pick(shelvesByStock.get(stock._id.toString()));
        productHome.set(product._id.toString(), { stockId: stock._id, shelfId: shelf._id });
        const lowStock = i < Math.floor(NUM_PRODUCTS * LOW_STOCK_RATIO);
        const quantity = lowStock ? randomInt(0, 9) : randomInt(10, 500);
        return {
            stockId: stock._id,
            shelfId: shelf._id,
            productId: product._id,
            quantity,
            reservedQuantity: quantity > 0 ? randomInt(0, Math.min(quantity, 5)) : 0,
            lastStocktakeDate: randomPastDate(),
            updatedAt: now,
            ...audit
        };
    });
    const inventories = await Inventory.insertMany(inventoryDocs);

    // 5. Customers
    const customerDocs = Array.from({ length: NUM_CUSTOMERS }, () => {
        const first_name = faker.person.firstName();
        const last_name = faker.person.lastName();
        const createdAt = randomPastDate();
        const city = faker.location.city();
        const streetAddress = faker.location.streetAddress();
        const postalCode = faker.location.zipCode('#####');
        return {
            first_name,
            last_name,
            email: faker.internet.email({ firstName: first_name, lastName: last_name }).toLowerCase(),
            phone: faker.phone.number(),
            address: {
                billing: { type: 'billing', streetAddress, city, postalCode, country: 'Finland' },
                shipping: { type: 'shipping', streetAddress, city, postalCode, country: 'Finland' }
            },
            active: true,
            createdAt,
            updatedAt: createdAt,
            ...audit
        };
    });
    const customers = await Customer.insertMany(customerDocs);

    // 6. Sale orders, spread over the last 12 months (orderDate AND createdAt backdated)
    const buildOrderItems = (count, orderDate, completed, quantityField) => {
        return Array.from({ length: count }, () => {
            const product = pick(products);
            const home = productHome.get(product._id.toString());
            const quantity = randomInt(1, 20);
            const unitNetPrice = round2(product.netPrice * (0.9 + Math.random() * 0.2));
            return {
                productName: product.name,
                productId: product._id,
                stockId: home.stockId,
                shelfId: home.shelfId,
                quantity,
                unitNetPrice,
                unitGrossPrice: grossFromNet(unitNetPrice, product.vatRate),
                vat: product.vatRate,
                [quantityField]: completed ? quantity : 0,
                createdBy: userId,
                createdAt: orderDate,
                updatedAt: orderDate
            };
        });
    };

    const saleOrderDocs = Array.from({ length: NUM_SALE_ORDERS }, (unused, i) => {
        const orderDate = randomPastDate();
        const status = saleOrderStatusFor(orderDate);
        const completed = status === SaleOrderStatuses.SEND;
        return {
            orderNumber: `SO-${runTag}-${String(i + 1).padStart(4, '0')}`,
            customerId: pick(customers)._id,
            status,
            orderDate,
            expectedDeliveryDate: status === SaleOrderStatuses.DRAFT ? undefined : new Date(orderDate.getTime() + randomInt(3, 14) * DAY_MS),
            items: buildOrderItems(randomInt(1, 5), orderDate, completed, 'sendQuantity'),
            notes: Math.random() < 0.2 ? faker.lorem.sentence() : undefined,
            createdBy: userId,
            createdAt: orderDate,
            updatedAt: orderDate,
            tenant: tenantId
        };
    });
    const saleOrders = await SaleOrder.insertMany(saleOrderDocs);

    // 7. Purchase orders, same temporal spread
    const purchaseOrderDocs = Array.from({ length: NUM_PURCHASE_ORDERS }, (unused, i) => {
        const orderDate = randomPastDate();
        const status = purchaseOrderStatusFor(orderDate);
        const completed = status === PurchaseOrderStatuses.RECEIVED;
        return {
            orderNumber: `PO-${runTag}-${String(i + 1).padStart(4, '0')}`,
            supplier: faker.company.name(),
            status,
            orderDate,
            expectedDeliveryDate: status === PurchaseOrderStatuses.DRAFT ? undefined : new Date(orderDate.getTime() + randomInt(5, 30) * DAY_MS),
            items: buildOrderItems(randomInt(1, 8), orderDate, completed, 'receivedQuantity'),
            notes: Math.random() < 0.2 ? faker.lorem.sentence() : undefined,
            createdBy: userId,
            createdAt: orderDate,
            updatedAt: orderDate,
            tenant: tenantId
        };
    });
    const purchaseOrders = await PurchaseOrder.insertMany(purchaseOrderDocs);

    // Summary
    console.log('\nseed.js: inserted this run:');
    console.log(`  productCategories: ${categories.length}`);
    console.log(`  products:          ${products.length}`);
    console.log(`  stocks:            ${stocks.length}`);
    console.log(`  shelves:           ${shelves.length}`);
    console.log(`  inventories:       ${inventories.length} (low stock <10: ${inventoryDocs.filter(d => d.quantity < 10).length})`);
    console.log(`  customers:         ${customers.length}`);
    console.log(`  saleOrders:        ${saleOrders.length}`);
    console.log(`  purchaseOrders:    ${purchaseOrders.length}`);

    console.log('\nseed.js: total documents in DB for this tenant:');
    const totals = [
        ['productCategories', ProductCategory], ['products', Product], ['stocks', Stock],
        ['shelves', Shelf], ['inventories', Inventory], ['customers', Customer],
        ['saleOrders', SaleOrder], ['purchaseOrders', PurchaseOrder]
    ];
    for (const [label, Model] of totals) {
        console.log(`  ${label}: ${await Model.countDocuments({ tenant: tenantId })}`);
    }

    // Sample sale order with populated refs, as a sanity check
    const sample = await SaleOrder.findOne({ tenant: tenantId, status: SaleOrderStatuses.SEND })
        .populate('customerId', 'first_name last_name email')
        .populate('items.productId', 'name sku')
        .populate('items.stockId', 'name')
        .populate('items.shelfId', 'name code')
        .lean();
    console.log('\nseed.js: sample sale order:');
    console.log(JSON.stringify(sample, null, 2));

    return true;
};

(async () => {
    const connected = await connectMongoose();
    if (!connected) process.exit(1);

    try {
        const ok = await seed();
        await mongoose.disconnect();
        process.exit(ok ? 0 : 1);
    } catch (error) {
        console.error(`seed.js: seeding failed: ${error.name}: ${error.message}`);
        await mongoose.disconnect();
        process.exit(1);
    }
})();

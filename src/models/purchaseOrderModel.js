import mongoose from 'mongoose';

const { Schema } = mongoose;

const PurchaseOrderSchema = new Schema({
  orderNumber: { type: String, required: true, unique: true },
  supplier: {
    id: { type: Schema.Types.ObjectId, ref: 'Supplier' },
    name: String
  },
  stockId: { type: Schema.Types.ObjectId, ref: 'Stock' },
  status: { 
    type: String, 
    enum: ['draft', 'ordered', 'partially_received', 'received', 'cancelled'],
    default: 'draft'
  },
  orderDate: { type: Date },
  expectedDeliveryDate: { type: Date },
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    productName: String,
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    receivedQuantity: { type: Number, default: 0 }
  }],
  totalAmount: { type: Number },
  notes: String,
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('PurchaseOrder', PurchaseOrderSchema);
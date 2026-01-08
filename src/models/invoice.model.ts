import mongoose, { Schema, Model } from 'mongoose';
import { IInvoice} from '../interfaces/invoice.interface';
import { PaymentStatus } from '../utils/constants';

const invoiceSchema = new Schema<IInvoice>(
  {
    user_id: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    application_id: { 
      type: Schema.Types.ObjectId, 
      ref: 'Application', 
      required: true 
    },
    amount: { 
      type: Number, 
      required: true,
      default: 100
    },
    currency: { 
      type: String, 
      default: 'BDT' 
    },
    payment_status: { 
      type: String, 
      enum: Object.values(PaymentStatus), 
      default: PaymentStatus.PENDING 
    },
    transaction_id: { 
      type: String, 
      unique: true, 
      required: true
    },
    payment_method: { 
      type: String 
    },
  },
  { timestamps: true, versionKey: false, }
);

const Invoice: Model<IInvoice> = mongoose.model<IInvoice>('Invoice', invoiceSchema);
export default Invoice;
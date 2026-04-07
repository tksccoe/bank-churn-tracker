import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema(
  {
    institutionName: { type: String, required: true },
    accountType: String,
    apy: Number,
    appliedDate: String,
    approvedDate: String,
    closedDate: String,
    bonusAmount: Number,
    bonusRequirements: String,
    bonusAmountReceived: Number,
    feeFreeRequirement: String,
    notes: String,
    monthlyFeeFreeMet: { type: Map, of: Boolean, default: {} },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Closed', 'Declined'],
      default: 'Pending',
    },
    userId: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

delete (mongoose.models as any).Account;
const Account = mongoose.model('Account', accountSchema);

export default Account;

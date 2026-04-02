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

const Account =
  (mongoose.models.Account as mongoose.Model<typeof accountSchema>) ||
  mongoose.model('Account', accountSchema);

export default Account;

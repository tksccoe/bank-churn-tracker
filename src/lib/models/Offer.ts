import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    institutionName: { type: String, required: true },
    accountType: { type: String, required: true },
    bonusAmount: { type: Number, required: true },
    requirements: { type: String, required: true },
    description: { type: String, required: true },
    referralUrl: { type: String, required: true },
    expirationDate: String,
    imageUrl: String,
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

delete (mongoose.models as any).Offer;
const Offer = mongoose.model('Offer', offerSchema);

export default Offer;

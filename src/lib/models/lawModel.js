import mongoose from "mongoose";
const LawSchema = new mongoose.Schema({
  fact:{
    type: String,
    required: true,
    trim:true,
  },
  category:{
    type: String,
    required: true,
    enum: ['Historical', 'Modern', 'Contract Law', 'Fun Fact']
  },
  source: {
    type: String,
    default: 'Legal Lens Research Team'
  }

},{
  timestamps: true
})
LawSchema.index({ category: 1, createdAt: -1 });
LawSchema.pre('save', function(next) {
  if (this.isModified('fact')) {
    this.fact = this.fact.trim();
  }
  next();
});
LawSchema.statics.getRandomLaw = async function(category) {
  const matchStage = {};
  if (category) {
    matchStage.category = category;
  }

  const result = await this.aggregate([
    { $match: matchStage },
    { $sample: { size: 1 } }
  ]);

  return result.length > 0 ? result[0] : null;
};

export default mongoose.models.Law || mongoose.model('Law', LawSchema);
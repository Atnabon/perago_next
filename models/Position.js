import mongoose from 'mongoose'

const positionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },

  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Position' },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Position' }],

});

positionSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

positionSchema.set('toJSON', {
  virtuals: true,
});

export default mongoose.models.Position || mongoose.model('Position', positionSchema);


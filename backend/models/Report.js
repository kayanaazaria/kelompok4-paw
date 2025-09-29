const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema(
  {},
  {
    strict: false,
    collection: 'reports',
    timestamps: false, 
  }
);

ReportSchema.virtual('code').get(function () {
  return this._id?.toString();
});

ReportSchema.set('toJSON', { virtuals: true });
ReportSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Report', ReportSchema);
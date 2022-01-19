const mongoose = require('mongoose');

const VictoryRequirementsSchema = new mongoose.Schema({
    label: {
      type: String,
      required: true
    },
    figure: {
      type: String,
      required: true
    },
    identifier: {
      type: String,
      required: true
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      require: true
    }
});

module.exports = VictoryRequirements = mongoose.model('VictoryRequirements', VictoryRequirementsSchema);
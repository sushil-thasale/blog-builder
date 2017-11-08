module.exports = function () {
  var mongoose = require('mongoose');

  var WidgetSchema = mongoose.Schema({
    pageID: {type: mongoose.Schema.Types.ObjectId, ref: 'PageModel'},
    widgetType: {type: String, enum:['HEADING', 'IMAGE', 'YOUTUBE', 'HTML']},
    name: String,
    text: String,
    placeholder: String,
    description: String,
    url: String,
    width: String,
    height: String,
    rows: Number,
    size: Number,
    class: String,
    icon: String,
    deletable: Boolean,
    formatted: Boolean,
  }, {collection: "Widgets"});

  return WidgetSchema;
};
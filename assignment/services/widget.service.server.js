module.exports = function(app, WidgetModel){

  var multer = require('multer');
  var uploadPath= __dirname + '/../../src/assets/uploads';
  var upload = multer({dest: uploadPath});
  var fs = require("fs");

  app.post("/api/page/:pageID/widget", createWidget);
  app.get("/api/page/:pageID/widget", findAllWidgetsForPage);
  app.get("/api/widget/:widgetID", findWidgetById);
  app.put("/api/widget/:widgetID", updateWidget);
  app.delete("/api/widget/:widgetID", deleteWidget);
  app.put("/api/page/:pageID/widget", updateWidgetPosition);
  app.post("/api/upload", upload.single('myFile'), uploadImage);
  app.get("/api/upload/:filename", getFile);

  function createWidget(req, res){
    var newWidget = req.body;
    var pageID = req.params.pageID;

    WidgetModel.createWidget(pageID, newWidget)
      .then(function (widget) {
        res.json(widget);
      }, function (err) {
        res.send(err);
      });
  }

  function findAllWidgetsForPage(req, res) {
    var pageID = req.params.pageID;

    WidgetModel.findAllWidgetsForPage(pageID)
      .then(function (widgets) {
        res.json(widgets);
      }, function (err) {
        res.send(err);
      });
  }

  function findWidgetById(req, res) {
    var widgetID = req.params.widgetID;

    WidgetModel.findWidgetById(widgetID)
      .then(function (widget) {
        res.json(widget);
      }, function (err) {
        res.send(err);
      });
  }

  function updateWidget (req, res) {
    var widgetID = req.params.widgetID;
    var updatedWidget = req.body;

    WidgetModel.updateWidget(widgetID, updatedWidget)
      .then(function (widget) {
        res.json(widget);
      }, function (err) {
        res.send(err);
      });
  }

  function deleteWidget(req, res) {
    var widgetID = req.params.widgetID;

    WidgetModel.deleteWidget(widgetID)
      .then(function (widget) {
        res.json(widget);
      }, function (err) {
        res.send(err);
      });
  }

  function updateWidgetPosition(req, res) {
    var pageID = req.params.pageID;
    var startIndex = parseInt(req.query.startIndex);
    var endIndex = parseInt(req.query.endIndex);

    WidgetModel.reorderWidget(pageID, startIndex, endIndex)
      .then(function (widget) {
        res.json(widget);
      }, function (err) {
        res.send(err);
      });
  }

  function uploadImage(req, res) {
    var widgetID = req.body.widgetId;
    var myFile = req.file;
    var filename = myFile.filename;

    return WidgetModel.findWidgetById(widgetID)
      .then(function (imageWidget) {
        imageWidget.url = "assets/uploads/" + filename;
        // imageWidget.url = req.protocol + '://' + req.get('host') + "/assets/uploads/" + filename;

        WidgetModel.updateWidget(widgetID, imageWidget)
          .then(function (widget) {
            res.json(widget);
          }, function (err) {
            res.send(err);
          });

        res.redirect(req.get('referrer'));
        return widget;
      }, function (err) {
        console.log(err);
      });

    // // imageWidget.url = "/assets/uploads/" + filename;
    // imageWidget.url = req.protocol + '://' + req.get('host') + "/assets/uploads/" + filename;
    //
    // WidgetModel.updateWidget(widgetID, imageWidget)
    //   .then(function (widget) {
    //     res.json(widget);
    //   }, function (err) {
    //     res.send(err);
    //   });
    //
    // res.redirect(req.get('referrer'));
  }

  function getFile(req, res) {
    var filename = req.params.filename;

    fs.readdir(uploadPath,  function (err, files) {
      for(var file in files) {
        if (file === filename)
          res.send(file);
      }
    });
  }

};

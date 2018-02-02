window.addEventListener('load', function() {
    var editor;
});

ContentTools.StylePalette.add([
    new ContentTools.Style('Author', 'author', ['p'])
]);

editor = ContentTools.EditorApp.get();
editor.init('*[data-editable]', 'data-name');


editor.addEventListener('saved', function (ev) {
    var name, payload, regions, xhr;

    // Check that something changed
    regions = ev.detail().regions;
    if (Object.keys(regions).length == 0) {
        return;
    }

    // Set the editor as busy while we save our changes
    this.busy(true);

    // Collect the contents of each region into a FormData instance
    payload = {
      _id: pageId,
      url: url,
    }
    for (name in regions) {
        if (regions.hasOwnProperty(name)) {
            payload[name] = regions[name];
        }
    }

     $.ajax({
      method: 'POST',
      url: `/admin/editPage/editExist/${pageId}`,
      dataType: "json",
      data: payload
    })
    .done(function(response) {
      editor.busy(false);
      new ContentTools.FlashUI('ok');
    })
    .fail(function(response){
      new ContentTools.FlashUI('no');
    });

});

goog.provide('ScoreLibrary.ScoreDiv');
goog.require('ScoreLibrary');
goog.require('ScoreLibrary.Engraver.Pager');
goog.require('ScoreLibrary.MusicXMLLoader');
goog.require('ScoreLibrary.Renderer.Fonts.Gonville18');
/*goog.require('ScoreLibrary.Renderer.Fonts.GonvilleBrace');*/
goog.require('ScoreLibrary.Renderer.PaintContext.Canvas');
goog.require('ScoreLibrary.Score.Source');

/**
 * @constructor
 * @export
 */
ScoreLibrary.ScoreDiv = function(div_node, musicxml_file, is_standalone) {

    this.div_node = div_node;

    this.musicxml_ref = this.div_node.attr('musicxml_ref') || '';

    this.musicxml_file = musicxml_file;

    this.is_standalone = is_standalone;

    this.createCanvas();

    this.resize(Number(this.div_node.attr('width')) || 800,
                Number(this.div_node.attr('height')) || 650);

    this.asyncGetScore();
};

ScoreLibrary.ScoreDiv.prototype.resize = function(width, height) {

    this.width = width;
    this.height = height;

    this.div_node.css({
        'position': 'relative',
        'width': this.width,
        'height': this.height
    });

    if (this.canvas_node) {

        this.canvas_node.prop('width', this.width);
        this.canvas_node.prop('height', this.height - this.getToolbarHeight());
    }
};

ScoreLibrary.ScoreDiv.prototype.restContextCache = function() {

    delete this.context_caches;
};

ScoreLibrary.ScoreDiv.prototype.findContextCache =
    function(page_index, create) {

        page_index = (page_index >= 0 ? page_index : 0);

        this.context_caches = this.context_caches || [];

        var context_cached = this.context_caches[page_index];

        if (!context_cached && create) {

            var canvas_node = $('<canvas/>');

            canvas_node.attr('width', this.width);
            canvas_node.attr('height', this.height - this.getToolbarHeight());

            context_cached =
                new ScoreLibrary.Renderer.PaintContext.Canvas(canvas_node);

            var custom_renderer =
                context_cached.getCustomTextRenderer();

            custom_renderer.setGlyphFactory(this.glyph_factory);

            this.context_caches[page_index] = context_cached;
        }

        return context_cached;
    };

ScoreLibrary.ScoreDiv.prototype.createCanvas = function() {

    if (!this.canvas_node) {

        this.canvas_node = $('<canvas/>');

        this.canvas_node.css({

            'position': 'absolute',
            'left': 0,
            'top': 0
        });

        this.canvas_node.appendTo(this.div_node);
    }
};

ScoreLibrary.ScoreDiv.prototype.getCanvas = function() {

    return this.canvas_node[0];
};

ScoreLibrary.ScoreDiv.prototype.getToolbarHeight = function() {

    return 40;
};

ScoreLibrary.ScoreDiv.callbackEventHandler = function(event, ui) {

    var myself = event.data.myself;

    var event_handler = event.data.handler;

    event_handler.call(myself, event, ui);
};

ScoreLibrary.ScoreDiv.prototype.optionToolbarButton =
    function(this_prop, options) {

        var toolbar_button_node = this[this_prop];
        if (toolbar_button_node && options) {

            toolbar_button_node.button('option', options);
        }
    };

ScoreLibrary.ScoreDiv.prototype.createInput =
    function(this_prop, input_attrs, input_css, parent_node) {

        var toolbar_input_node = this[this_prop];
        if (!toolbar_input_node) {

            var toolbar_input_node = $('<input></input>', input_attrs);

            toolbar_input_node.css(input_css);

            toolbar_input_node.appendTo(parent_node);

            this[this_prop] = toolbar_input_node;
        }

        return toolbar_input_node;
    };

ScoreLibrary.ScoreDiv.prototype.createToolbarButton =
    function(this_prop, button_attrs, button_params, button_css,
             click_handler) {

        var toolbar_button_node = this[this_prop];
        if (!toolbar_button_node) {

            var toolbar_button_node = $('<button></button>', button_attrs);

            toolbar_button_node.css(button_css);

            toolbar_button_node.button(button_params);

            toolbar_button_node.appendTo(this.toolbar_node);

            if (click_handler) {

                toolbar_button_node.click({

                    myself: this,
                    handler: click_handler
                }, ScoreLibrary.ScoreDiv.callbackEventHandler);
            }

            this[this_prop] = toolbar_button_node;
        }

        return toolbar_button_node;
    };

ScoreLibrary.ScoreDiv.prototype.closeDialog = function(this_prop) {

    var dialog_node = this[this_prop];
    if (dialog_node) {

        dialog_node.dialog('close');
    }
};

ScoreLibrary.ScoreDiv.prototype.createDialog =
    function(this_prop, dialog_attrs, dialog_params,
             create_handler, resize_stop_handler, close_handler) {

        var dialog_node = this[this_prop];
        if (!dialog_node) {

            dialog_node = $('<div></div>', dialog_attrs);

            if (create_handler) {

                dialog_node.bind('dialogcreate', {

                    myself: this,
                    handler: create_handler
                }, ScoreLibrary.ScoreDiv.callbackEventHandler);
            }

            if (resize_stop_handler) {

                dialog_node.bind('dialogresizestop', {

                    myself: this,
                    handler: resize_stop_handler
                }, ScoreLibrary.ScoreDiv.callbackEventHandler);
            }

            if (close_handler) {

                dialog_node.bind('dialogclose', {

                    myself: this,
                    handler: close_handler
                }, ScoreLibrary.ScoreDiv.callbackEventHandler);
            }

            this[this_prop] = dialog_node;

            dialog_node.dialog(dialog_params);
        }

        dialog_node.dialog('open');

        return dialog_node;
    };

ScoreLibrary.ScoreDiv.prototype.createToolbar = function() {

    if (!this.toolbar_node) {

        if (this.hasNextPage()) {

            if (!this.is_standalone) {

                this.toolbar_node =
                    $('<span></span>', {
                        'id': 'toolbar',
                        'class': 'ui-widget-header ui-corner-all'
                    });

                this.toolbar_node.css({
                    'position': 'absolute',
                    'right': 0,
                    'bottom': 0,
                    'font-family':
                    "'Trebuchet MS', 'Arial', '" +
                        "''Helvetica', 'Verdana', 'sans-serif'",
                    'padding': '0px 4px'
                });

                this.toolbar_node.appendTo(this.div_node);
            }
            else {

                this.toolbar_node = this.div_node.prev('.ui-dialog-titlebar');

                this.toolbar_node.css({

                    'padding': '0px'
                });
            }

            if (!this.is_standalone) {

                this.createToolbarButton(
                    'open_file_btn_node', {

                        'id': 'open_file_btn',
                        'text': 'Open local MusicXML'
                    }, {

                        'text': false,
                        'icons': { 'primary': 'ui-icon-folder-collapsed' }
                    }, {
                    }, this.callbackClickFile);

                this.createInput(
                    'go_url_input_node', {
                        'id': 'go_url_input',
                        'type': 'text',
                        'value': this.musicxml_ref,
                        'size': 30,
                        'maxlength': 256
                    }, {
                        'font-size': '1.1em'
                    }, this.toolbar_node);

                this.createToolbarButton(
                    'go_url_btn_node', {

                        'id': 'go_url_btn',
                        'text': 'Refresh'
                    }, {

                        'text': false,
                        'icons': { 'primary': 'ui-icon-refresh' }
                    }, {
                    }, this.callbackClickGoURL);
            }
            else {

                this.createToolbarButton(
                    'go_url_btn_node', {

                        'id': 'go_url_btn',
                        'text': this.musicxml_ref
                    }, {
                        'icons': { 'secondary': 'ui-icon-refresh' }
                    }, {
                    }, this.callbackClickGoURL);
            }

            this.createToolbarButton(
                'page_1st_btn_node', {

                    'id': 'page_1st_btn',
                    'text': 'Goto First Page'
                }, {

                    'text': false,
                    'icons': { 'primary': 'ui-icon-arrowthickstop-1-w' },
                    'disabled': true
                }, {
                }, this.callbackClickPage1st);

            this.createToolbarButton(
                'page_prev_btn_node', {

                    'id': 'page_prev_btn',
                    'text': 'Goto Prev Page'
                }, {

                    'text': false,
                    'icons': { 'primary': 'ui-icon-arrowthick-1-w' },
                    'disabled': true
                },{
                }, this.callbackClickPagePrev);

            this.createToolbarButton(
                'page_next_btn_node', {

                    'id': 'page_next_btn',
                    'text': 'Goto Next Page'
                }, {

                    'text': false,
                    'icons': { 'primary': 'ui-icon-arrowthick-1-e' },
                    'disabled': true
                }, {
                }, this.callbackClickPageNext);

            this.createToolbarButton(
                'page_nth_btn_node', {

                    'id': 'page_nth_btn',
                    'text': 'Goto Last Page'
                }, {

                    'text': false,
                    'icons': { 'primary': 'ui-icon-arrowthickstop-1-e' },
                    'disabled': true
                }, {
                }, this.callbackClickPageNth);

            if (!this.is_standalone) {

                this.createToolbarButton(
                    'standalone_btn_node', {

                        'id': 'standalone_btn',
                        'text': 'Standalone Viewer'
                    }, {

                        'text': false,
                        'icons': { 'primary': 'ui-icon-newwin' }
                    }, {
                    }, this.callbackClickStandaloneBtn);
            }
        }
    }
};

ScoreLibrary.ScoreDiv.prototype.showCurrPage = function() {

    if (this.page_iterator.hasNext()) { // !NOTE: Really ask 'has current?'

        var page_index = this.page_iterator.current || 0;

        var page = this.page_iterator.next();

        var context = this.findContextCache(page_index);
        if (!context) {

            context = this.findContextCache(page_index, true);

            page.sizeAllocateRecursively({

                width: page.getRequisite('width'),
                height: page.getRequisite('height')
            });

            page.draw(context);
        }

        this.context.clear();
        this.context.context.drawImage(context.canvas[0], 0, 0);

        this.page_iterator.prev(); // back to current.
    }
};

ScoreLibrary.ScoreDiv.prototype.hasNextPage = function() {

    this.page_iterator.next();

    var has_next = this.page_iterator.hasNext();

    this.page_iterator.prev();

    return has_next;
};

ScoreLibrary.ScoreDiv.prototype.checkNavigateStates = function() {

    var has_prev = this.page_iterator.hasPrev();

    this.optionToolbarButton('page_prev_btn_node', { 'disabled': !has_prev });
    this.optionToolbarButton('page_1st_btn_node', { 'disabled': !has_prev });

    var has_next = this.hasNextPage();

    this.optionToolbarButton('page_next_btn_node', { 'disabled': !has_next });
    this.optionToolbarButton('page_nth_btn_node', { 'disabled': !has_next });
};

ScoreLibrary.ScoreDiv.prototype.callbackClickFile = function(event) {

    this.optionToolbarButton('open_file_btn_node', { 'disabled': true });

    this.createDialog('open_file_dialog_node', {
        'id': 'open_file_dialog'
    }, {
        'modal': true,
        'autoOpen': false,
        'position': ['center', 'center'],
        'title': 'Open local MusicXML',
        'resizable': false,
        'width': 500,
        'height': 'auto',
        'buttons': {
            'OK': function() {

                var dialog_node = $(this);

                dialog_node.prop('ok_clicked', true);

                dialog_node.dialog('close');
            },
            'Cancel': function() {

                var dialog_node = $(this);

                dialog_node.prop('ok_clicked', false);

                dialog_node.dialog('close');
            }
        }
    }, this.callbackCreateFileDialog, undefined, this.callbackCloseFileDialog);

    this.optionToolbarButton('open_file_btn_node', { 'disabled': false });
};


ScoreLibrary.ScoreDiv.prototype.callbackCreateFileDialog =
    function(event, ui) {

        var mime_types = ScoreLibrary.MusicXMLMIMETypes;

        this.createInput(
            'open_file_input_node', {
                'id': 'open_file_input',
                'type': 'file',
                'accept': mime_types.MIME_MXL + ', ' + mime_types.MIME_XML
            }, {
            }, this['open_file_dialog_node']);
    };

ScoreLibrary.ScoreDiv.prototype.callbackCloseFileDialog =
    function(event, ui) {

        var ok_clicked = this['open_file_dialog_node'].prop('ok_clicked');
        var files = this['open_file_input_node'].prop('files');

        if (ok_clicked && files && files.length === 1) {

            this.musicxml_file = files[0];
            this.musicxml_ref = this.musicxml_file.name;
            this['go_url_input_node'].prop('value', this.musicxml_ref);

            this.closeStandaloneViewer();
            this.asyncGetScore();
        }
    };

ScoreLibrary.ScoreDiv.prototype.callbackClickGoURL = function(event) {

    this.optionToolbarButton('go_url_btn_node', { 'disabled': true });

    if (this['go_url_input_node']) {

        this.musicxml_ref = this['go_url_input_node'].prop('value');
    }

    this.closeStandaloneViewer();
    this.asyncGetScore();
};

ScoreLibrary.ScoreDiv.prototype.callbackClickStandaloneBtn = function(event) {

    this.createDialog('standalone_dialog_node', {
        'id': 'standalone_dialog'
    }, {

        'modal': false,
        'autoOpen': false,
        'position': ['center', 'center'],
        'width': this.width,
        'minWidth': this.width,
        'height': this.height,
        'minHeight': this.height
    },
    this.callbackCreateStandaloneViewer,
    this.callbackResizeStopStandaloneViewer);
};

ScoreLibrary.ScoreDiv.prototype.callbackCreateStandaloneViewer =
    function(event, ui) {

        if (!this.standalone_scorediv) {

            this.standalone_scorediv =
                new ScoreLibrary.ScoreDiv(
                    this['standalone_dialog_node'].attr({
                        'width': this.width,
                        'height': this.height,
                        'musicxml_ref': this.musicxml_ref
                    }), this.musicxml_file, true);
        }
    };

ScoreLibrary.ScoreDiv.prototype.callbackResizeStopStandaloneViewer =
    function(event, ui) {

        if (this.standalone_scorediv) {

            this.standalone_scorediv.resize(
                ui['size']['width'], ui['size']['height']);

            this.standalone_scorediv.asyncGetScore();
        }
    };

ScoreLibrary.ScoreDiv.prototype.closeStandaloneViewer = function() {

    this.closeDialog('standalone_dialog_node');

    delete this.standalone_scorediv;
    delete this['standalone_dialog_node'];
};

ScoreLibrary.ScoreDiv.prototype.callbackClickPage1st = function(event) {

    while (this.page_iterator.hasPrev()) {

        this.page_iterator.prev();
    }

    this.showCurrPage();
    this.checkNavigateStates();
};

ScoreLibrary.ScoreDiv.prototype.callbackClickPagePrev = function(event) {

    this.page_iterator.prev();

    this.showCurrPage();
    this.checkNavigateStates();
};

ScoreLibrary.ScoreDiv.prototype.callbackClickPageNext = function(event) {

    this.page_iterator.next(); // Advance to next.

    this.showCurrPage();
    this.checkNavigateStates();
};

ScoreLibrary.ScoreDiv.prototype.callbackClickPageNth = function(event) {

    while (this.page_iterator.hasNext()) {

        this.page_iterator.next();
    }

    this.page_iterator.prev(); // Back to last.
    this.showCurrPage();
    this.checkNavigateStates();
};

ScoreLibrary.ScoreDiv.prototype.getRequisite = function(dimension) {

    return this[dimension];
};

ScoreLibrary.ScoreDiv.prototype.getMusicXMLRef = function(dimension) {

    return this.musicxml_ref;
};

ScoreLibrary.ScoreDiv.prototype.showWaitingImage = function() {

    if (!this.waiting_node) {

        this.waiting_node = $('<img/>', {

            'src': '/images/waiting.gif',
            'alt': 'musicxml loading...'
        });

        var left = (this.width - this.waiting_node.prop('width')) * 0.5;
        var bottom = (this.height - this.waiting_node.prop('height')) * 0.5;

        this.waiting_node.css({

            'position': 'absolute',
            'left': left,
            'bottom': bottom
        });
    }

    this.waiting_node.appendTo(this.div_node);
};

ScoreLibrary.ScoreDiv.prototype.hideWaitingImage = function() {

    if (this.waiting_node) {

        this.waiting_node.remove();

        delete this.waiting_node;
    }
};

ScoreLibrary.ScoreDiv.prototype.showErrorThrown = function(errorThrown) {

    throw errorThrown;
};

ScoreLibrary.ScoreDiv.prototype.callbackScore = function(xml) {

    try {

        this.source = new ScoreLibrary.Score.Source(xml);

        if (!this.context) {

            this.context =
                new ScoreLibrary.Renderer.PaintContext.Canvas(this.canvas_node);

            this.custom_renderer = this.context.getCustomTextRenderer();

            this.glyph_factory = this.custom_renderer.getGlyphFactory();

            this.glyph_factory.addFont(ScoreLibrary.Renderer.Fonts.Gonville18);
/*          this.glyph_factory.addFont(
                ScoreLibrary.Renderer.Fonts.GonvilleBrace);*/
        }

        this.restContextCache();

        this.engraver = new ScoreLibrary.Engraver.Pager(this.context);

        this.page_iterator = this.engraver.engrave(this.source);

        this.showCurrPage();

        this.createToolbar();
        this.checkNavigateStates();

    } catch (errorThrown) {

        this.callbackError(errorThrown);
    }

    this.hideWaitingImage();
    this.optionToolbarButton('go_url_btn_node', { 'disabled': false });
};

ScoreLibrary.ScoreDiv.prototype.callbackError = function(errorThrown) {

    this.hideWaitingImage();

    this.showErrorThrown(errorThrown);
};

ScoreLibrary.ScoreDiv.prototype.asyncGetScore = function() {

    if (this.context) {

        this.context.clear();
    }

    this.showWaitingImage();

    return ScoreLibrary.MusicXMLLoader.create(
        (this.musicxml_file ? this.musicxml_file : this.musicxml_ref),
        this, this.callbackScore, this.callbackError);
};

ScoreLibrary.ScoreDiv.divClass = '.score-div';

ScoreLibrary.ScoreDiv.divList = null;

ScoreLibrary.ScoreDiv.initialize = function() {

    ScoreLibrary.ScoreDiv.divList =
        $(ScoreLibrary.ScoreDiv.divClass).map(function(index) {

            return new ScoreLibrary.ScoreDiv($(this));
        }).get();
};

$(ScoreLibrary.ScoreDiv.initialize);
/**
 * @author XiongWenjie <navigator117@gmail.com>
 * @license This file is part of
 * score-library <http://www.musicxml-viewer.com>.
 * score-library is free software:
 * you can redistribute it and/or modify it under the terms of the
 * GNU General Public License as published by the Free Software Foundation,
 * either version 3 of the License, or (at your option) any later version.
 *
 * score-library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with score-library.
 * If not, see <http://www.gnu.org/licenses>.
 */

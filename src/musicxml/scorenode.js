goog.provide('ScoreLibrary.Score.Node');
goog.require('ScoreLibrary.Score');
goog.require('goog.asserts');

/**
 * @constructor
 */
ScoreLibrary.Score.Node = function(node) {

    if (node && ScoreLibrary.Score.Node.prototype.isPrototypeOf(node)) {
        // From Score.Node
        this.node = node.getXMLNode();
    }
    else if (node && typeof node === 'string') {
        // From XML String
        this.node = $($.parseXML(node)).children();
    }
    else if (node && ($.isXMLDoc(node) ||
                      Document.prototype.isPrototypeOf(node))) {
        // From XML Document
        this.node = $(node);

        // !NOTE: fix XML parser error.
        var parsererror = this.node.children('parsererror');
        if (parsererror && parsererror.length > 0) {

            throw parsererror.text();
        }
    }
    else {
        // From JQuery object or undefined
        this.node = node;
    }
};

ScoreLibrary.Score.Node.prototype.toString = function() {

    return 'Score.Node';
};

ScoreLibrary.Score.Node.prototype.getXMLNode = function(path) {

    return this.node;
};

ScoreLibrary.Score.Node.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.Node(this.node);

    return clone;
};

ScoreLibrary.Score.Node.prototype.getNodeName = function() {

    return (this.node ? this.node.prop('nodeName') : '');
};

ScoreLibrary.Score.Node.prototype.is = function(something) {

    something =
        (ScoreLibrary.Score.Node.prototype.isPrototypeOf(something) ?
         something.getXMLNode() : something);

    return this.node.is(something);
};

ScoreLibrary.Score.Node.prototype.getString = function(path) {

    var value = undefined;

    do {

        if (!this.node) {

            break;
        }

        if (path === undefined) {

            value = this.node.first().text();

            break;
        }

        value = this.node.attr(path);
        if (value !== undefined) {

            break;
        }

        value = this.node.children(path).first().text();

        break;

    } while (false);

    return value;
};

ScoreLibrary.Score.Node.prototype.getStringWithDefault =
    function(path, default_value) {

        var value = this.getString(path);

        return value ? value : default_value;
    };

ScoreLibrary.Score.Node.prototype.getNumber = function(path) {

    var string = this.getString(path);

    return (string ? Number(string) : undefined);
};

ScoreLibrary.Score.Node.prototype.getNumberWithDefault =
    function(path, default_value) {

        var value = this.getNumber(path);

        return (value !== undefined ? value : default_value);
    };

ScoreLibrary.Score.Node.prototype.getBool = function(path) {

    return (path && this.node &&
            this.node.children(path).length > 0 ? true : false);
};

ScoreLibrary.Score.Node.prototype.getNode = function(path, filter) {

    var node = (this.node && path ?
                 (filter ? this.node.filter(path) : this.node.children(path))
                 : undefined);

    if (node !== undefined && node.length > 0) {

        return new ScoreLibrary.Score.Node(node);
    }

    return undefined;
};

ScoreLibrary.Score.Node.prototype.forEachNode =
    function(path, functor, context) {

        if (this.node) {

            if (path) {

                this.node.children(path).each(
                    function(index, child) {

                        functor.call(
                            context, index,
                            new ScoreLibrary.Score.Node($(child)));
                    });
            }
            else {

                this.node.each(
                    function(index, child) {

                        functor.call(
                            context, index,
                            new ScoreLibrary.Score.Node($(child)));
                    });
            }
        }
    };

ScoreLibrary.Score.Node.prototype.get1stNode = function(path) {

    if (this.node) {

        if (path !== undefined) {

            return new ScoreLibrary.Score.Node(
                this.node.children(path).first());
        }
        else {

            return new ScoreLibrary.Score.Node(this.node.first());
        }
    }
};

ScoreLibrary.Score.Node.prototype.getLstNode = function(path) {

    if (this.node) {

        if (path !== undefined) {

            return new ScoreLibrary.Score.Node(this.node.children(path).last());
        }
        else {

            return new ScoreLibrary.Score.Node(this.node.last());
        }
    }
};

ScoreLibrary.Score.Node.prototype.getPrevNode = function(path) {

    var prev_node = (this.node ?
                (path ?
                 this.node.prevAll(path).first() :
                 this.node.prev()) :
                undefined);

    return (prev_node && prev_node.length ?
            new ScoreLibrary.Score.Node(prev_node) : undefined);
};

ScoreLibrary.Score.Node.prototype.getNextNode = function(path) {

    var next_node = (this.node ?
                (path ?
                 this.node.nextAll(path).first() :
                 this.node.next()) :
                undefined);

    return (next_node && next_node.length ?
            new ScoreLibrary.Score.Node(next_node) : undefined);
};

ScoreLibrary.Score.Node.prototype.getPrevUntil = function(path) {

    var prev_node = (this.node && path ?
                     this.node.prevUntil(path) :
                     undefined);

    return (prev_node && prev_node.length ?
            new ScoreLibrary.Score.Node(prev_node) : undefined);
};

ScoreLibrary.Score.Node.prototype.getNextUntil = function(path) {

    var next_node = (this.node && path ?
                     this.node.nextUntil(path) :
                     undefined);

    return (next_node && next_node.length ?
            new ScoreLibrary.Score.Node(next_node) : undefined);
};
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

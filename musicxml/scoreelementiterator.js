goog.provide('ScoreLibrary.Score.ElementEnfolder');
goog.provide('ScoreLibrary.Score.ElementFullInitIter');
goog.provide('ScoreLibrary.Score.ElementIterFactory');
goog.provide('ScoreLibrary.Score.ElementIterator');
goog.provide('ScoreLibrary.Score.ElementLazyInitIter');
goog.require('ScoreLibrary.Score.ElementFactory');
goog.require('ScoreLibrary.Score.ElementTunnel');
goog.require('goog.asserts');

/**
 * @constructor
 */
ScoreLibrary.Score.ElementIterator = function(owner, backward, tunnel) {

    this.owner = owner;
    this.backward = (backward ? true : false);
    this.tunnel = tunnel;
};

ScoreLibrary.Score.ElementIterator.prototype.toString = function() {

    return 'Score.ElementIterator';
};

ScoreLibrary.Score.ElementIterator.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.ElementIterator();

    return ScoreLibrary.copyAttributes(clone, this);
};

ScoreLibrary.Score.ElementIterator.prototype.getElementChildCount = function() {

    var owner = this.owner;

    return (owner && owner.child_elements ? owner.child_elements.length : 0);
};

ScoreLibrary.Score.ElementIterator.prototype.getTunnel = function() {

    return this.tunnel;
};

ScoreLibrary.Score.ElementIterator.prototype.getFactory = function() {

    var element_factory =
        ScoreLibrary.Score.ElementIterator.factory;

    if (element_factory === undefined) {

        element_factory = new ScoreLibrary.Score.ElementFactory();

        ScoreLibrary.Score.ElementFactory.factory = element_factory;
    }

    return element_factory;
};

ScoreLibrary.Score.ElementIterator.prototype.initCurrent = function() {

    this.current =
        (this.current !== undefined ?
         this.current :
         (this.backward ? this.getElementChildCount() : 0));
};

ScoreLibrary.Score.ElementIterator.prototype.hasNext = function() {

    return this.current < this.getElementChildCount();
};

ScoreLibrary.Score.ElementIterator.prototype.next = function() {

    goog.asserts.assert(
        this.hasNext(),
        'ScoreLibrary.Score.ElementIterator.next(): unexpect!');

    return this.owner.child_elements[this.current++];
};

ScoreLibrary.Score.ElementIterator.prototype.hasPrev = function() {

    return this.current > 0;
};

ScoreLibrary.Score.ElementIterator.prototype.prev = function() {

    goog.asserts.assert(
        this.hasPrev(),
        'ScoreLibrary.Score.ElementIterator.prev(): unexpect!');

    return this.owner.child_elements[--this.current];
};

/**
 * @constructor
 */
ScoreLibrary.Score.ElementEnfolder =
    function(element, enfolders, element_factory, element_tunnel) {

        this.element = element;

        this.enfolders = enfolders || [];
        this.enfolders.push(this.defaultEnfolder);

        this.folded_elements = element.child_elements || [];
        element.child_elements = this.folded_elements;

        this.element_factory = element_factory;
        this.element_tunnel = element_tunnel;
    };

ScoreLibrary.Score.ElementEnfolder.prototype.toString = function() {

    return 'Score.ElementEnfolder';
};

ScoreLibrary.Score.ElementEnfolder.prototype.enfoldPlainElement =
    function(plain_iterator) {

        var folded_element = undefined;

        if (plain_iterator.hasNextPlainElement()) {

            var plain_element =
                plain_iterator.nextPlainElement();

            this.enfolders.some(

                function(enfolder) {

                    folded_element =
                        enfolder.call(
                            this,
                            plain_element,
                            plain_iterator,
                            this.element,
                            this.element_factory,
                            this.element_tunnel);

                    if (folded_element) {

                        return true;
                    }

                    return false;
                }, this);
        }

        return folded_element;
    };

ScoreLibrary.Score.ElementEnfolder.prototype.defaultEnfolder =
    function(plain_element) {

        var folded_element = plain_element;

        var prev =
            (this.folded_elements.length > 0 ?
             this.folded_elements[this.folded_elements.length - 1] : undefined);

        var folded_index = this.folded_elements.length;

        this.folded_elements.push(folded_element);

        folded_element.folded_index = folded_index;

        if (prev) {

            prev.next = folded_element;
            folded_element.prev = prev;
        }

        if (this.element_tunnel) {

            this.element_tunnel.filter(folded_element);
        }

        return folded_element;
    };

/**
 * @constructor
 * @extends {ScoreLibrary.Score.ElementIterator}
 */
ScoreLibrary.Score.ElementFullInitIter = function(owner, backward, tunnel) {

    var supperclass = ScoreLibrary.Score.ElementFullInitIter.supperclass;

    supperclass.constructor.call(this, owner, backward, tunnel);

    this.initElementChildren();
    this.initCurrent();
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.ElementFullInitIter,
    ScoreLibrary.Score.ElementIterator);

ScoreLibrary.Score.ElementFullInitIter.prototype.toString = function() {

    return 'Score.ElementFullInitIter';
};

ScoreLibrary.Score.ElementFullInitIter.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.ElementFullInitIter();

    var supperclass = ScoreLibrary.Score.ElementFullInitIter.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.ElementFullInitIter.prototype.initElementChildren =
    function() {

        var owner = this.owner;

        if (owner && !owner.child_elements_inited) {

            owner.child_elements =
                this.enfoldPlainElements(
                    owner,
                    owner.getEnfolders(),
                    this.getFactory(),
                    this.collectPlainElements(owner));

            owner.child_elements_inited = true;
        }
    };

ScoreLibrary.Score.ElementFullInitIter.prototype.collectPlainElements =
    function(element) {

        var plain_elements = undefined;

        var element_factory = this.getFactory();

        element.forEachNode(
            element.getChildTypes().join(','),
            function(index, child_element_node) {

                var plain_element =
                    element_factory.create(element, index, child_element_node);

                plain_elements = plain_elements || [];
                plain_elements.push(plain_element);
            }, this);

        return plain_elements;
    };

/**
 * @constructor
 */
ScoreLibrary.Score.PlainIterator = function(plain_elements) {

    this.plain_elements = plain_elements;
    this.current = 0;
};

ScoreLibrary.Score.PlainIterator.prototype.clone = function(clone) {

    clone = clone || new ScoreLibrary.Score.PlainIterator();

    return ScoreLibrary.copyAttributes(clone, this);
};

ScoreLibrary.Score.PlainIterator.prototype.hasNextPlainElement = function() {

    return (this.plain_elements ?
            this.current < this.plain_elements.length : false);
};

ScoreLibrary.Score.PlainIterator.prototype.nextPlainElement = function() {

    return this.plain_elements[this.current++];
};

ScoreLibrary.Score.PlainIterator.prototype.hasPrevPlainElement = function() {

    return this.current > 0;
};

ScoreLibrary.Score.PlainIterator.prototype.prevPlainElement = function() {

    return this.plain_elements[--this.current];
};

ScoreLibrary.Score.ElementFullInitIter.prototype.enfoldPlainElements =
    function(element, enfolders, element_factory, plain_elements) {

        element.enfolder = element.enfolder ||
            new ScoreLibrary.Score.ElementEnfolder(
                element, enfolders, element_factory, this.tunnel);

        var plain_iterator =
            new ScoreLibrary.Score.PlainIterator(plain_elements);

        while (plain_iterator.hasNextPlainElement()) {

            element.enfolder.enfoldPlainElement(plain_iterator);
        }

        return element.enfolder.folded_elements;
    };

/**
 * @constructor
 * @extends {ScoreLibrary.Score.ElementIterator}
 * @extends {ScoreLibrary.Score.PlainIterator}
 */
ScoreLibrary.Score.ElementLazyInitIter = function(owner, backward, tunnel) {

    var supperclass = ScoreLibrary.Score.ElementLazyInitIter.supperclass;

    supperclass.constructor.call(this, owner, backward, tunnel);

    this.initElementChildNodes();
    this.initCurrent();
};

ScoreLibrary.inherited(
    ScoreLibrary.Score.ElementLazyInitIter,
    ScoreLibrary.Score.ElementIterator);

ScoreLibrary.Score.ElementLazyInitIter.prototype.toString = function() {

    return 'Score.ElementLazyInitIter';
};

ScoreLibrary.Score.ElementLazyInitIter.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.ElementLazyInitIter();

    var supperclass = ScoreLibrary.Score.ElementLazyInitIter.supperclass;

    return supperclass.clone.call(this, clone);
};

ScoreLibrary.Score.ElementLazyInitIter.prototype.hasNext = function() {

    var supperclass = ScoreLibrary.Score.ElementLazyInitIter.supperclass;

    return (supperclass.hasNext.call(this) || this.hasNextFoldedElement());
};

ScoreLibrary.Score.ElementLazyInitIter.prototype.next = function(no_prefetch) {

    this.initCurrent();

    var supperclass = ScoreLibrary.Score.ElementLazyInitIter.supperclass;

    var next_element =
        (supperclass.hasNext.call(this) ?
         supperclass.next.call(this) : this.nextFoldedElement());

    if (!no_prefetch && this.hasNext()) {
        // !NOTE: pre-fectch next element for
        // the use of element.next, element.prev

        this.next(true);
        this.prev();
    }

    return next_element;
};

ScoreLibrary.Score.ElementLazyInitIter.prototype.initElementChildNodes =
    function() {

        owner = this.owner;

        if (owner && !owner.child_elements_inited) {

            owner.children_nodes =
                owner.children_nodes ||
                owner.getNode(owner.getChildTypes());

            owner.child_1st_node = owner.children_nodes.get1stNode();
            owner.child_Lst_node = owner.children_nodes.getLstNode();

            owner.child_nth_node =
                owner.child_nth_node || owner.child_1st_node;

            owner.enfolder = owner.enfolder ||
                new ScoreLibrary.Score.ElementEnfolder(
                    owner, owner.getEnfolders(),
                    this.getFactory(), this.tunnel);
        }
    };

ScoreLibrary.Score.ElementLazyInitIter.prototype.hasNextPlainElement =
    function() {

        var owner = this.owner;

        return (owner.child_nth_node ? true : false);
    };

ScoreLibrary.Score.ElementLazyInitIter.prototype.nextPlainElement = function() {

    goog.asserts.assert(
        this.hasNextPlainElement(),
        'ScoreLibrary.Score.ElementLazyInitIter.nextPlainElement(): unexpect!');

    var owner = this.owner;

    var element_factory = this.getFactory();

    var child_element_node = owner.child_nth_node;

    owner.child_nth_node = owner.child_nth_node.getNextNode();

    var plain_element =
        element_factory.create(owner, undefined, child_element_node);

    owner.plain_elements = owner.plain_elements || [];

    owner.plain_elements.push(plain_element);

    return plain_element;
};

ScoreLibrary.Score.ElementLazyInitIter.prototype.hasNextFoldedElement =
    ScoreLibrary.Score.ElementLazyInitIter.prototype.hasNextPlainElement;

ScoreLibrary.Score.ElementLazyInitIter.prototype.nextFoldedElement =
    function() {

        goog.asserts.assert(
            this.hasNextFoldedElement(),
            'Score.ElementLazyInitIter.nextPlainElement(): unexpect!');

        var owner = this.owner;

        var enfolder = owner.enfolder;

        var folded_element = enfolder.enfoldPlainElement(this);

        ++this.current;

        if (!owner.child_nth_node) {

            owner.child_elements_inited = true;
        }

        return folded_element;
    };

/**
 * @constructor
 */
ScoreLibrary.Score.ElementIterFactory = function() {
};

ScoreLibrary.Score.ElementIterFactory.create = function(element, backward) {

    var tunnel = undefined;

    if (ScoreLibrary.Score.Part.prototype.isPrototypeOf(element)) {

        tunnel = element.getElementTunnel();
    }
    else if (ScoreLibrary.Score.Measure.prototype.isPrototypeOf(element)) {

        var part = element.getOwner();

        tunnel = part.getElementTunnel();
    }

    if (ScoreLibrary.Score.Part.prototype.isPrototypeOf(element)) {
        // Score.Part

        return new ScoreLibrary.Score.ElementLazyInitIter(
            element, backward, tunnel);
    }
    else {
        // Score.Source, Score.Measure, Score.Attributes, Score.PartList
        return new ScoreLibrary.Score.ElementFullInitIter(
            element, backward, tunnel);
    }
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

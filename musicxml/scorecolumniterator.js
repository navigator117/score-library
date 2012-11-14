goog.provide('ScoreLibrary.Score.ColumnIterator');
goog.require('ScoreLibrary.Score');
goog.require('ScoreLibrary.Score.ElementIterFactory');
goog.require('goog.asserts');

/**
 * @constructor
 */
ScoreLibrary.Score.ColumnIterator = function(parts) {

    this.parts_iterators =
        parts.map(
            function(part) {

                return ScoreLibrary.Score.ElementIterFactory.create(part);
            });

    this.current = 0;
};

ScoreLibrary.Score.ColumnIterator.prototype.getColumnCount = function() {

    return (this.columns ? this.columns.length : 0);
};

ScoreLibrary.Score.ColumnIterator.prototype.hasNext = function() {

    return (this.current < this.getColumnCount() ? true : this.hasNextColumn());
};

ScoreLibrary.Score.ColumnIterator.prototype.next = function() {

    goog.asserts.assert(
        this.hasNext(),
        'ScoreLibrary.Score.ColumnIterator.next(): unexpect!');

    return (this.current < this.getColumnCount() ?
            this.columns[this.current++] : this.nextColumn());
};

ScoreLibrary.Score.ColumnIterator.prototype.hasNextColumn = function() {

    return this.parts_iterators.every(

        function(part_iterator) {

            return part_iterator.hasNext();
        });
};

ScoreLibrary.Score.ColumnIterator.prototype.nextColumn = function() {

    var column = this.parts_iterators.map(

        function(parts_iterator) {

            return parts_iterator.next();
        });

    this.columns = this.columns || [];
    this.columns.push(column);

    ++this.current;

    return column;
};


ScoreLibrary.Score.ColumnIterator.prototype.hasPrev = function() {

    return this.current > 0;
};

ScoreLibrary.Score.ColumnIterator.prototype.prev = function() {

    goog.asserts.assert(
        this.hasPrev(),
        'ScoreLibrary.Score.ColumnIterator.prev(): unexpect!');

    return this.columns[--this.current];
};

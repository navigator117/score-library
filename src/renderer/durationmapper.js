goog.provide('ScoreLibrary.DurationAccumulator');
goog.provide('ScoreLibrary.DurationKeyGenerator');
goog.provide('ScoreLibrary.DurationMapper');
goog.require('ScoreLibrary.Score.Element');
goog.require('goog.array');
goog.require('goog.asserts');

/**
 * @constructor
 * @export
 */
ScoreLibrary.DurationAccumulator = function() {
};

/**
 * @export
 */
ScoreLibrary.DurationAccumulator.prototype.getAccDuration = function() {

    return this.acc_duration || 0;
};

/**
 * @export
 */
ScoreLibrary.DurationAccumulator.prototype.getMaxDuration = function() {

    return this.max_duration || 0;
};

/**
 * @export
 */
ScoreLibrary.DurationAccumulator.prototype.getCurDuration = function() {

    return this.cur_duration || 0;
};

/**
 * @export
 */
ScoreLibrary.DurationAccumulator.prototype.accumulate = function(duration) {

    this.cur_duration = duration;

    this.acc_duration =
        (this.acc_duration !== undefined ?
         this.acc_duration + duration :
         duration);

    if (this.acc_duration < 0) {

        this.acc_duration = 0;
    }

    this.max_duration =
        (this.max_duration !== undefined ?
         Math.max(this.max_duration, this.acc_duration) :
         this.acc_duration);
};

/**
 * @constructor
 * @export
 * @extends {ScoreLibrary.DurationAccumulator}
 */
ScoreLibrary.DurationKeyGenerator = function() {
};

ScoreLibrary.aggregate(
    ScoreLibrary.DurationKeyGenerator,
    ScoreLibrary.DurationAccumulator);

/**
 * @export
 */
ScoreLibrary.DurationKeyGenerator.prototype.generate = function(duration) {

    var acc_duration = this.getAccDuration();

    this.accumulate(duration);

    return acc_duration;
};

/**
 * @constructor
 * @export
 * @extends {ScoreLibrary.DurationKeyGenerator}
 */
ScoreLibrary.DurationMapper = function() {
};

ScoreLibrary.aggregate(
    ScoreLibrary.DurationMapper,
    ScoreLibrary.DurationKeyGenerator);

/**
 * @export
 */
ScoreLibrary.DurationMapper.prototype.keyDurationToIndex =
    function(acc_duration) {

        this.key_durations =
            this.key_durations || [];

        var key_index =
            goog.array.binarySearch(
                this.key_durations, acc_duration,
                function(key_duration, information) {

                    return (key_duration - information.key_duration);
                });

        return key_index;
    };

/**
 * @export
 */
ScoreLibrary.DurationMapper.prototype.setInformation =
    function(acc_duration, information, dont_copy, keyConflictResolver) {

        dont_copy = dont_copy || false;

        goog.asserts.assert(
            typeof information === 'object',
            'ScoreLibrary.DurationMapper.setInformation(): invalid argument!');

        var key_index = this.keyDurationToIndex(acc_duration);

        if (key_index >= 0) {

            if (keyConflictResolver) {

                keyConflictResolver(this.key_durations[key_index], information);
            }
            else {

                ScoreLibrary.extend(this.key_durations[key_index], information);
            }
        }
        else {

            if (!dont_copy) {

                information =
                    ScoreLibrary.extend({}, information);
            }

            information.key_duration = acc_duration;

            goog.array.insertAt(
                this.key_durations, information, -(key_index + 1));
        }
    };

/**
 * @export
 */
ScoreLibrary.DurationMapper.prototype.mapInformation =
    function(duration, information, dont_copy, keyConflictResolver) {

        var acc_duration = this.generate(duration);

        this.setInformation(
            acc_duration, information, dont_copy, keyConflictResolver);

        return acc_duration;
    };

/**
 * @export
 */
ScoreLibrary.DurationMapper.prototype.getAllInformations = function(dont_copy) {

    dont_copy = dont_copy || false;

    return (this.key_durations ?
            (dont_copy ?
             this.key_durations :
             this.key_durations.map(
                 function(information) {

                     information = ScoreLibrary.extend({}, information);

                     delete information.key_duration;

                     return information;
                 })) : undefined);
};

/**
 * @export
 */
ScoreLibrary.DurationMapper.prototype.getInformation =
    function(acc_duration, dont_copy) {

        dont_copy = dont_copy || false;

        var information = undefined;

        if (this.key_durations) {

            var key_index = this.keyDurationToIndex(acc_duration);

            if (key_index >= 0) {

                information = this.key_durations[key_index];

                if (!dont_copy) {

                    information =
                        ScoreLibrary.extend({}, information);

                    delete information.key_duration;
                }
            }
        }

        return information;
    };

/**
 * @export
 */
ScoreLibrary.DurationMapper.prototype.getKeyDurations = function() {

    return (this.key_durations ?
            this.key_durations.map(function(information) {
                return information.key_duration;
            }) : []);
};

/**
 * @export
 */
ScoreLibrary.DurationMapper.prototype.getAbsDurations = function() {

    var key_durations =
        this.getKeyDurations();

    key_durations.push(this.getMaxDuration());

    return key_durations;
};

/**
 * @export
 */
ScoreLibrary.DurationMapper.prototype.keyDurationToDuration =
    function(key_duration) {

        var duration = 0;

        if (this.key_durations) {

            var key_index = this.keyDurationToIndex(key_duration);

            if (key_index >= this.key_durations.length - 1) {

                duration = this.getMaxDuration() - key_duration;
            }
            else if (key_index >= 0) {

                duration =
                    this.key_durations[key_index + 1].key_duration -
                    key_duration;
            }
        }

        return duration;
    };

/**
 * @export
 */
ScoreLibrary.DurationMapper.prototype.backup = function(duration) {

    var divisionsScale =
        ScoreLibrary.Score.Element.Constants.divisionsScale;

    if (duration < divisionsScale ||
        duration % divisionsScale !== 0) {

        this.accumulate(-duration);
    }
    else {

        var abs_durations =
            this.getAbsDurations();

        abs_durations.reverse();

        abs_durations.some(

            function(abs_duration, index, abs_durations) {

                if (index < abs_durations.length - 1 &&
                    abs_duration >= divisionsScale) {

                    var delta_duration =
                        abs_duration - abs_durations[index + 1];

                    if (duration < delta_duration) {

                        this.accumulate(-duration);

                        return true;
                    }

                    this.accumulate(-delta_duration);

                    if (delta_duration >= divisionsScale) {

                        duration -= delta_duration;
                    }
                }

                return false;
            }, this);
    }
};

/**
 * @export
 */
ScoreLibrary.DurationMapper.prototype.save = function() {

    var acc_duration = this.getAccDuration();

    this.acc_stack = this.acc_stack || [];

    this.acc_stack.push(acc_duration);
};

/**
 * @export
 */
ScoreLibrary.DurationMapper.prototype.restore = function() {

    goog.asserts.assert(
        this.acc_stack && this.acc_stack.length > 0,
        'ScoreLibrary.DurationMapper.restore(): miss match save/restore!');

    var delta_acc_duration =
        this.getAccDuration() - this.acc_stack.pop();

    if (delta_acc_duration > 0) {

        this.backup(delta_acc_duration);
    }
    else if (delta_acc_duration < 0) {

        this.accumulate(-delta_acc_duration);
    }

    return delta_acc_duration;
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

goog.provide('ScoreLibrary');
goog.provide('ScoreLibrary.Delegate');
goog.provide('ScoreLibrary.Logger');
goog.require('goog.debug.FancyWindow');
goog.require('goog.debug.Logger');

ScoreLibrary = ScoreLibrary || {};

ScoreLibrary.extend = function(target, source, keyConflictResolver) {

    for (var prop in source) {

        target[prop] =
            (target[prop] !== undefined && keyConflictResolver ?
             keyConflictResolver(target[prop], source[prop]) :
             source[prop]);
    }

    return target;
};

ScoreLibrary.restrict = function(target, source) {

    for (var prop in target) {

        if (!(prop in source)) {

            delete target[prop];
        }
    }

    return target;
};

ScoreLibrary.subtract = function(target, source) {

    for (var prop in source) {

        delete target[prop];
    }

    return target;
};

ScoreLibrary.union = function(target, source) {

    return ScoreLibrary.extend(
        ScoreLibrary.extend(
            {}, target),
        source);
};

ScoreLibrary.intersection = function(target, source) {

    return ScoreLibrary.restrict(
        ScoreLibrary.extend(
            {}, target),
        source);
};

ScoreLibrary.keys = function(target, filter) {

    if (typeof target !== 'object') {

        throw TypeError();
    }

    var result = [];

    for (var prop in target) {

        if (target.hasOwnProperty(prop)) {

            if (filter && !filter.test(prop)) {

                continue;
            }

            result.push(prop);
        }
    }

    return result;
};

ScoreLibrary.copyAttributes = function(target, source) {

    for (var prop in source) {

        if (typeof source[prop] === 'function') {

            continue;
        }

        target[prop] = source[prop];
    }

    return target;
};

ScoreLibrary.inherited = function(child_ctor, parent_ctor) {

    child_ctor.supperclass = parent_ctor.prototype;
    child_ctor.prototype = new parent_ctor();
    child_ctor.prototype.constructor = child_ctor;
};

ScoreLibrary.callparent = function(me, opt_method_name, var_args) {

    var caller = arguments.callee.caller;
    if (caller.supperclass) {

        return caller.supperclass.constructor.apply(
            me, Array.prototype.slice.call(arguments, 1));
    }

    var args = Array.prototype.slice.call(arguments, 2);

    var found_caller = false;

    for (var ctor = me.constructor; ctor;
         ctor = ctor.supperclass && ctor.supperclass.constructor) {

        if (ctor.prototype[opt_method_name] === caller) {

            found_caller = true;
        } else if (found_caller) {

            return ctor.prototype[opt_method_name].apply(me, args);
        }
    }

    if (me[opt_method_name] === caller) {

        return me.constructor.prototype[opt_method_name].apply(me, args);

    } else {

        throw Error(
            'ScoreLibrary.callparent() called from a method of one name ' +
                'to a method of a different name');
    }
};

ScoreLibrary.aggregate = function(target, source, ignore_nonfunc) {

    var tgt_proto = target.prototype;
    var src_proto = source.prototype;

    for (var prop in src_proto) {

        var property = src_proto[prop];

        if (typeof property !== 'function') {

            if (ignore_nonfunc) {

                continue;
            }

            throw Error('ScoreLibrary.aggregate: unexpect!');
        }

        if (prop === 'constructor') {

            continue;
        }

        tgt_proto[prop] = src_proto[prop];
    }
};

ScoreLibrary.Delegate = function() {
};

ScoreLibrary.Delegate.prototype.setDelegate = function(delegate) {

    this.delegate = delegate;
};

ScoreLibrary.Delegate.prototype.getDelegate = function() {

    return (this.delegate ? this.delegate : this);
};

ScoreLibrary.delegate = function(target, source) {

    ScoreLibrary.aggregate(target, ScoreLibrary.Delegate);

    var functor_generator = function(functor) {

        return function() {

            return functor.apply(
                this.getDelegate(), arguments);
        };
    };

    var tgt_proto = target.prototype;
    var src_proto = source.prototype;

    for (var prop in src_proto) {

        var property = src_proto[prop];

        if (typeof property === 'function' && prop !== 'constructor') {

            tgt_proto[prop] = functor_generator(property);
        }
    }
};

/** @define {boolean} , Enable Logger Compile Switcher. */
ScoreLibrary.LOGGER_ENABLED = false;

ScoreLibrary.Logger = goog.debug.Logger.getLogger('ScoreLibrary');
ScoreLibrary.Logger.expose = goog.debug.expose;
ScoreLibrary.Logger.deepExpose = goog.debug.deepExpose;

if (ScoreLibrary.LOGGER_ENABLED) {

    ScoreLibrary.LoggerWindow = new goog.debug.FancyWindow('score-library');

    ScoreLibrary.LoggerWindow.setEnabled(true);
    ScoreLibrary.LoggerWindow.init();
}

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

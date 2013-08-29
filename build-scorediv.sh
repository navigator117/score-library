#!/bin/bash

extra_args=()
if [ "$1" = "--debug" ]; then
    extra_args+=(--compiler_flags="--formatting=PRETTY_PRINT")
    extra_args+=(--compiler_flags="--debug")
fi

# Send all of our files to closure, because we have @export's all over the place
# that we need to expose to the user. Let the compiler remove unused code instead.
# https://groups.google.com/d/msg/closure-library-discuss/iFkTR-WLBDo/6bqx8r6-NEUJ
find ./src -name "*.js" | grep -v ./src/renderer/fonts \
    | xargs printf "--input %s " \
    | xargs ./public/closure-library/closure/bin/build/closurebuilder.py \
        --root='./public/closure-library' \
        --root='./src' \
        --output_mode=compiled \
        --compiler_jar=./support/compiler.jar \
        --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" \
        --compiler_flags="--generate_exports" \
        --compiler_flags="--externs=./support/externs/html5.js" \
        --compiler_flags="--externs=./support/externs/fileapi.js" \
        --compiler_flags="--externs=./support/externs/contrib/jquery-1.7.js" \
        --compiler_flags="--externs=./support/externs/contrib/zip.js" \
        "${extra_args[@]}" \
    | java -jar ./support/compiler.jar \
        --compilation_level WHITESPACE_ONLY  \
        --create_source_map ./scorelib.map  \
        --js_output_file ./scorelib.min.js
        # Running closure again is the only way to make it remove comments
        # that have a @license instruction in them.

echo "/*
 This file is part of
 score-library <http://www.musicxml-viewer.com>.
 author & contact: XiongWenjie (navigator117 at gmail.com)
 score-library is free software:
 you can redistribute it and/or modify it under the terms of the
 GNU General Public License as published by the Free Software Foundation,
 either version 3 of the License, or (at your option) any later version.

 score-library is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 See the GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with score-library.
 If not, see <http://www.gnu.org/licenses>.
*/
" >> scorelib.min.js
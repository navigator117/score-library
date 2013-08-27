#!/usr/bin/perl -w
# reduce-license.pl --- script for reduce licenses
# Author: root <root@ubuntu>
# Created: 19 May 2012
# Version: 0.01

use warnings;
use strict;

our $command = 'java -jar ./support/compiler.jar ' .
  '--compilation_level WHITESPACE_ONLY ' .
  '--create_source_map ./js_mapfiles/scorediv-latest.map ' .
  '--js ./public/scorediv-compiled.js ' .
  '--js_output_file ./public/scorediv-latest.js';

system($command);

our $license = "/*
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
*/\n";

open(my $file, '>>', './public/scorediv-latest.js') or die $!;
print($file $license);
close($file);

__END__

=head1 NAME

reduce-license.pl - Describe the usage of script briefly

=head1 SYNOPSIS

reduce-license.pl [options] args

      -opt --long      Option description

=head1 DESCRIPTION

Stub documentation for reduce-license.pl, 

=head1 AUTHOR

root, E<lt>root@ubuntuE<gt>

=head1 COPYRIGHT AND LICENSE

Copyright (C) 2012 by root

This program is free software; you can redistribute it and/or modify
it under the same terms as Perl itself, either Perl version 5.8.2 or,
at your option, any later version of Perl 5 you may have available.

=head1 BUGS

None reported... yet.

=cut

'use strict';

var chalk = require('chalk');
var color = 'black';
var omaha = '\n' + chalk[color].bgYellow(
    '                                                                   \n',
    '  ██████╗ ███╗   ███╗ █████╗ ██╗  ██╗ █████╗          ██╗███████╗ \n',
    ' ██╔═══██╗████╗ ████║██╔══██╗██║  ██║██╔══██╗         ██║██╔════╝ \n',
    ' ██║   ██║██╔████╔██║███████║███████║███████║         ██║███████╗ \n',
    ' ██║   ██║██║╚██╔╝██║██╔══██║██╔══██║██╔══██║    ██   ██║╚════██║ \n',
    ' ╚██████╔╝██║ ╚═╝ ██║██║  ██║██║  ██║██║  ██║    ╚█████╔╝███████║ \n',
    '  ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝     ╚════╝ ╚══════╝ '
);
omaha = omaha + '\n';

module.exports = omaha;

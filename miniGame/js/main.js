var app = angular.module('gameEngine', []);
app.controller('game', function($rootScope, $scope) {
    //generates random 2d array of ints
    function createGround(width, height) {
        var result = [];
        for (var i = 0; i < width; i++) {
            result[i] = [];
            for (var j = 0; j < height; j++) {
                result[i][j] = Math.floor(Math.random() * 2) + 1;
            }
        }
        return result;
    }
    var levels = [{
        name: 0,
        height: 25,
        width: 25
    }, {
        name: 0,
        height: 25,
        width: 25
    }];
    $scope.character = {
        hp: 99,
        maxhp: 99,
        cash: 0,
        level: 0,
        inventory: [],
        location: {
            x: 0,
            y: 0,
            room: 0
        },
        world: 0,
        levelUp: function() {
            this.level++;
            this.maxhp = this.maxhp * 4;
        },
        use: function(item, on) {
            for (var i = 0; i < this.inventory.length; i++) {
                if (this.inventory[i].name === item.name) {
                    this.item.use(on);
                }
            }
        }
    };
    var ground = createGround(levels[$scope.character.world].height, levels[$scope.character.world].width);
    $scope.messages = 'Welcome to UNIX 89. Enter a command or type "HELP" to begin.\n';
    $scope.addMsg = function(msg) {
        $scope.messages += "$>" + msg + "\n";
    };
    $scope.commands = [{
        commandname: 'move',
        command: function(param) {
            switch (param[0]) {
                case "up":
                    $scope.addMsg('You walk forward\n');
                    $scope.character.y--;
                    break;
                case "down":
                    $scope.addMsg('You walk back\n');
                    $scope.character.y++;
                    break;
                case "right":
                    $scope.addMsg('You walk right\n');
                    $scope.character.x++;
                    break;
                case "left":
                    $scope.addMsg('You walk left\n');
                    $scope.character.x--;
                    break;
                default:
                    $scope.addMsg('ERROR ' + Math.round(Math.random() * 235) + ': Invalid Command');
            }
        },
        level: 0 // required level
    }, {
        commandname: 'view',
        command: function(param) {
            var map = '';
            for (var i = 0; i < ground.length; i++) {
                var row = ground[i];
                for (var k = 0; k < row.length; k++) {
                    if (($scope.character.location['x'] == k) && ($scope.character.location['y'] == i)) {
                        map = map.concat("X");
                        console.log($scope.character.location['x']);
                    } else {
                        map = map.concat(row[k]);
                    }
                }
                map = map.concat('\n  ');
            }
            $scope.addMsg(map);
        },
        level: 0 // required level
    }, ];
    $scope.commandPrompt = '';
    /*
    run() - breaks commandPrompt into a command and value to pass, searches for a valid command and
     */
    $scope.run = function() {
        if ($scope.commandPrompt.length > 1) {
            var commandRes = $scope.commandPrompt.split(" ");
            for (var i = 0; i < $scope.commands.length; i++) {
                if ((commandRes[0] === $scope.commands[i].commandname) && ($scope.commands[i].level <= $scope.character.level))
                    $scope.commands[i].command(commandRes.slice(commandRes.length - 1, commandRes.length));
            }
        } else {
            $scope.addMsg('ERROR ' + Math.round(Math.random() * 235) + ': Invalid Command');
        }
    };
    //listen for key presses
    $rootScope.$on('keypress', function(e, a, key) {
        $scope.$apply(function() {
            //13 = enter key
            if (key == 13)
                $scope.run();

        });
    });
});

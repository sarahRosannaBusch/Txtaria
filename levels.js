export const LEVELS = [
    {
        //tutorial defined in class
    }, { //lvl 1
        plats: [
            {x: 435, y: 330, key: 'platform0'}, // !!!
            {x: 744, y: 440, key: 'platform3'}, // ###
            {x: 0, y: 460, key: 'platform2'}, // %%%
            {x: 460, y: 580, key: 'platform1'}, // &&&
        ],
        art: [
            {x: 50, y: 727, key: 'tree1'},
            {x: 650, y: 727, key: 'shrub0'},
            {x: 875, y: 727, key: 'tree0'},
            {x: 480, y: 580, key: 'flower0'},
            {x: 50, y: 180, key: 'cloud0'},
            {x: 230, y: 230, key: 'cloud1'},
            {x: 840, y: 200, key: 'cloud0'}
        ]
    }, { // lvl 2        
        plats: [
            {x: 600, y: 580, key: 'platform0'}, //158px X 21px
            {x: 855, y: 430, key: 'platform0'},
            {x: 685, y: 270, key: 'platform0'},
            {x: 430, y: 350, key: 'platform0'},
            {x: 175, y: 200, key: 'platform0'},
            {x: -75, y: 340, key: 'platform0'},
            {x: 90, y: 500, key: 'platform0'}
        ],
        staticMobs: [
            [720, 500, 'mob0'],
            [210, 400, 'mob0'],
            [510, 300, 'mob0']
        ],
        art: [
            {x: 100, y: 727, key: 'flower3'},
            {x: 825, y: 727, key: 'flower4'},
            {x: 240, y: 200, key: 'flower1'},
            {x: 715, y: 270, key: 'flower2'}
        ]
    }, { //lvl 3
        plats: [
            {x: 770, y: 200, key: 'platform0'}, // !!!
            {x: 435, y: 310, key: 'platform1'}, // &&&
            {x: 90, y: 450, key: 'platform2'}, // %%%
            {x: 560, y: 580, key: 'platform3'}, // ###
        ],
        staticMobs: [
            [255, 430, 'mob0'], // %%%
            [595, 180, 'mob0']  // &&&
        ],
        dynamicMobs: [
            [950, 0, 'mob1']
        ],
        art: [
            {x: 200, y: 727, key: 'tree2'}, //group 1
            {x: 125, y: 727, key: 'mushroom0'},
            {x: 800, y: 727, key: 'tree3'}, //group 2
            {x: 850, y: 727, key: 'tree2'},
            {x: 925, y: 727, key: 'tree3'},
            {x: 680, y: 580, key: 'mushroom0'}, //platform  
            {x: 880, y: 580, key: 'mushroom1'},
            {x: 215, y: 230, key: 'cloud1'}, //sky
            {x: 75, y: 200, key: 'moon'}
        ]
    }, { //lvl 4
        plats: [
            {x: 350, y: 290, key: 'platform1'},
            {x: -200, y: 440, key: 'platform3'},
            {x: 760, y: 440, key: 'platform3'},
            {x: 440, y: 580, key: 'platform0'},
        ],
        dynamicMobs: [
            [512, 16, 'bomb'],
            [912, 16, 'bomb']
        ],
        art: [
            {x: 100, y: 727, key: 'tree0'},            
            {x: 750, y: 727, key: 'tree2'},
            {x: 875, y: 727, key: 'tree3'},
            {x: 470, y: 580, key: 'tower0'},
            {x: 100, y: 220, key: 'moon'},
            {x: 800, y: 200, key: 'star'}
        ]
    }, { //lvl 5
        plats: [
            {x: 345, y: 200, key: 'platform0'}, // !!!
            {x: 740, y: 280, key: 'platform4'}, // ///
            {x: 60, y: 350, key: 'platform5'}, // \\\
            {x: 480, y: 430, key: 'platform1'}, // &&&
            {x: 680, y: 580, key: 'platform2'}, // %%%
        ],
        staticMobs: [
            [200, 700, 'mob0'],
            [900, 550, 'mob0']
        ],
        dynamicMobs:[
            [312, 0, 'bomb'],
            [1012, 640, 'mob1']
        ],
        art: [
            {x: 100, y: 727, key: 'tree0'},            
            {x: 460, y: 727, key: 'hut'},
            {x: 550, y: 727, key: 'shrub0'},
            {x: 700, y: 580, key: 'rat'},
            {x: 40, y: 200, key: 'star'},
            {x: 400, y: 325, key: 'cloud1'},
            {x: 900, y: 150, key: 'star'}
        ]
    }, { // lvl 6
        plats: [
            {x: 345, y: 184, key: 'platform0'}, // !!!
            {x: 685, y: 265, key: 'platform0'}, // !!!
            {x: 800, y: 580, key: 'platform6'}, 
            {x: 566, y: 496, key: 'platform6'}, 
            {x: 275, y: 425, key: 'platform7'}, 
            {x: 8, y: 335, key: 'platform7'}, 
        ],
        staticMobs: [
            [485, 350, 'mob0'],
            [145, 700, 'mob0'],
            [900, 700, 'mob0']
        ],
        dynamicMobs: [
            [0, 270, 'mob1', 'right']
        ],
        art: [
            {x: 605, y: 496, key: 'flower0'},            
            {x: 80, y: 727, key: 'flower1'},
            {x: 715, y: 727, key: 'flower2'},
            {x: 900, y: 727, key: 'mushroom1'},
            {x: 100, y: 335, key: 'mushroom1'},
            {x: 46, y: 335, key: 'mushroom0'},
            {x: 450, y: 727, key: 'wagon'},
            {x: 820, y: 581, key: 'hut'},
            {x: 341, y: 425, key: 'tower0'},
            {x: 650, y: 150, key: 'cloud0'},
            {x: 900, y: 225, key: 'cloud1'}
        ]
    }
]
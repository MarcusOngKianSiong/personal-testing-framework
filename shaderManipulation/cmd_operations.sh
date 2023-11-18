function shaders(){
    echo "1. normal\n2. grid\n3. border"
}

function display(){
    
    echo "
        precision mediump float;
        uniform vec4 default_color;
        uniform vec4 grid_color;
        uniform float number_of_rows;
        uniform float number_of_columns;
        uniform float shape_width;
        uniform float shape_height;
        varying vec2 current_fragment_position;
    "
    
}


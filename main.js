// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 60, left: 100};

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = MAX_WIDTH * .9, graph_1_height = 250;
let graph_2_width = MAX_WIDTH * 0.4, graph_2_height = 250;
let graph_3_width = (MAX_WIDTH / 2) - 10, graph_3_height = 275;

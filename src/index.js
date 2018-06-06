import { SSL_OP_LEGACY_SERVER_CONNECT } from "constants";

console.log('Hackarto VL!');

const map = new mapboxgl.Map({
  container: 'map',
  style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  center: [-3.7038, 40.4168],
  zoom: 10,
  dragRotate: false
});

carto.setDefaultAuth({
  user: 'hacheka',
  apiKey: 'default_public'
});

const s = carto.expressions;
const source = new carto.source.Dataset('commuting_routes');
let duration = s.prop('duration');
let commuters = s.prop('commuters');
// let torque = s.torque(timestamp, 10);
const viz = new carto.Viz({
  width: s.ramp(s.linear(commuters), [1, 5]),
  color: s.ramp(s.linear(duration), s.palettes.PRISM)
});
const layer = new carto.Layer('layer', source, viz);

layer.addTo(map);

const interactivity = new carto.Interactivity(layer);
interactivity.on('featureHover', event => {
  if (event.features.length > 0) {
    console.log(event);
  }
})

window.viz = viz;
window.source = source;
window.s = s;

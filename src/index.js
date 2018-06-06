import { SSL_OP_LEGACY_SERVER_CONNECT } from "constants";

console.log('Hackarto VL!');

const map = new mapboxgl.Map({
  container: 'map',
  style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  center: [-3.7038, 40.4168],
  zoom: 8,
  dragRotate: false
});

carto.setDefaultAuth({
  user: 'hacheka',
  apiKey: 'Tkasddb8BH7YHIpHpw9xeQ'
});

const s = carto.expressions;
const source = new carto.source.Dataset('commuting_routes');
let duration = s.prop('duration');
let commuters = s.prop('commuters');

const viz = new carto.Viz({
  width: s.ramp(s.linear(commuters), [1, 5]),
  color: s.ramp(s.linear(duration), s.palettes.PRISM)
});
const layer = new carto.Layer('layer', source, viz);

layer.addTo(map);

window.viz = viz;
window.source = source;
window.s = s;

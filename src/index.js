console.log('Hackarto VL, co!');

const map = new mapboxgl.Map({
  container: 'map',
  style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  center: [-3.7038, 40.4168],
  zoom: 11,
  dragRotate: false
});

carto.setDefaultAuth({
  user: 'hacheka',
  apiKey: 'default_public'
});

const s = carto.expressions;

// Sources
const routes = new carto.source.Dataset('commuting_routes');
const homes = new carto.source.Dataset('home');
const workplaces = new carto.source.SQL('select a.*, b.duration from mad_comm_work a, commuting_routes b where a.cartodb_id = b.cartodb_id');


// Variables
let postalCodeProp = s.prop('postalcode');
let homeCpProp = s.prop('home_cp');
let workCpProp = s.prop('home_cp');
let workCommutersProp = s.prop('commuters');
let durationProp = s.prop('duration');
let duration = s.prop('duration');
let commuters = s.prop('commuters');

// Viz Taylor
const routesViz = new carto.Viz({
  variables: {
    duration: durationProp,
    homeCp: homeCpProp
  },
  width: s.ramp(s.linear(commuters), [5, 25]),
  color: s.ramp(s.globalQuantiles(duration, 4), s.palettes.TROPIC),
  filter: 0
});

const homesViz = new carto.Viz({
  variables: {
    postalCode: postalCodeProp,
    selectedPoly: 0,
  },
  // color: s.blend(s.rgba(114, 170, 161, 0.2), s.rgba(0, 147, 146, 0.2), s.var('polyColor')),
  color: s.rgba(114, 170, 161, 0.2),
  strokeColor: s.blend(s.rgba(255, 255, 255, 0.2), s.rgba(159, 227, 221, 1), s.var('selectedPoly')),
  strokeWidth: s.blend(0.5, 5, s.var('selectedPoly'))
});

const workplacesViz = new carto.Viz({
  variables: {
    polyColor: 0
  },
  width: s.mul(s.sqrt(workCommutersProp), 5),
  color: s.ramp(s.prop('comm_norm'), [s.rgba(114, 170, 161, 0.2), s.rgba(114, 170, 161, 0.8)]),
  strokeWidth: 0,
  filter: 0
});

// Layers
const routesLayer = new carto.Layer('routesLayer', routes, routesViz);
const homesLayer = new carto.Layer('homesLayer', homes, homesViz);
const workplacesLayer = new carto.Layer('workplacesLayer', workplaces, workplacesViz);

homesLayer.addTo(map);
workplacesLayer.addTo(map);
routesLayer.addTo(map);

// Interactivity
const homesInteractivity = new carto.Interactivity(homesLayer);
homesInteractivity.on('featureClick', event => {
  if (event.features.length === 0) {
    return;
  }
  const postalCode = event.features[0].variables.postalCode.value;
  homesViz.variables.selectedPoly.blendTo(s.eq(postalCodeProp, postalCode));
  routesViz.filter = s.and(s.torque(durationProp, 20, s.fade(0.1, 1000)), s.eq(homeCpProp, postalCode));
  workplacesViz.filter = s.and(s.torque(durationProp, 20, s.fade(0.1, 1000)), s.eq(workCpProp, postalCode));
});
homesInteractivity.on('featureClickOut', event => {
  homesViz.variables.selectedPoly.blendTo(0);
  routesLayer.filter = 0;
  workplacesViz.filter = 0;
});
window.s = s;

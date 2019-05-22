import 'babel-polyfill';
import turfArea from '@turf/area'

const areaDome = 46755

const map = new tilecloud.Map( document.querySelector( '#map' ) )

const clickFeature = event => {
  map.queryRenderedFeatures( { layers: [ "building" ] } ).forEach( feature => {
    map.setFeatureState( feature, { hover: false } )
  } )

  const features = map.queryRenderedFeatures( event.point )
  const feature = features[0]
  feature.layer.paint["fill-color"] = "#ff0000"
  map.setFeatureState( feature, { hover: true } )

  const area = turfArea( feature.geometry ).toFixed( 1 )
  const asDome = ( area / areaDome ).toFixed( 1 )

  new mapboxgl.Popup()
    .setLngLat( event.lngLat )
    .setHTML( `この建物の面積は ${area}㎡ で、東京ドーム ${asDome} 個分の面積です。` )
    .addTo( map );
}

const mouseEnter = () => {
  map.getCanvas().style.cursor = 'pointer'
}

const mouseLeave = () => {
  map.getCanvas().style.cursor = ''
}

map.on( 'load', () => {
  map.on('click', "building", clickFeature)
  map.on('mouseenter', "building", mouseEnter)
  map.on('mouseleave', "building", mouseLeave)

  map.setPaintProperty( "building", 'fill-color', ["case",
    ["boolean", ["feature-state", "hover"], false],
    "#ff0000",
    "#dedede"
  ] );

  map.setPaintProperty( "building", 'fill-opacity', ["case",
    ["boolean", ["feature-state", "hover"], false],
    0.2,
    1
  ] );
} )

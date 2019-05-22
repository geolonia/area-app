import 'babel-polyfill';
import turfArea from '@turf/area'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import './style.css'

const areaDome = 46755

const map = new tilecloud.Map( document.querySelector( '#map' ) )

const draw = new MapboxDraw( {
  boxSelect: false,
  controls: {
    point: false,
    line_string: false,
    polygon: true,
    trash: true,
    combine_features: false,
    uncombine_features: false,
  },
  userProperties: true,
} )

map.on( 'load', () => {
  map.addControl( draw, 'top-right' );

  [ 'draw.create', 'draw.update', 'draw.delete' ].forEach( eventType => {
    map.on( eventType, () => {
      const geoJson = draw.getAll()
      const area = turfArea( geoJson ).toFixed( 1 )
      if ( area ) {
        const asDome = ( area / areaDome ).toFixed( 4 )
        document.querySelector( '#message' ).innerText = `面積は ${area}㎡ です。東京ドーム ${asDome}個分の広さです。`
        document.querySelector( '#message' ).style.display = 'block'
      } else {
        document.querySelector( '#message' ).style.display = 'none'
      }
    } )
  } )
} )
